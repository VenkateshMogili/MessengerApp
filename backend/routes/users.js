const express = require('express');
const router = express.Router();
const connection = require('../db');
// const multer = require("multer");
const fs = require("fs");
const mime = require('mime');
const resizeOptimizeImages = require('resize-optimize-images');

//User Login
router.post('/', function(req, res, next) {
  var username=req.body.email;
  var password=req.body.password;
  if(!username || !password){
    res.send({'success':false,'message':'Please fill all the fields'});
  } else{
  connection.query("SELECT * FROM users WHERE email=? AND password=?",[username,password],function(err,row,fields){
    if(err) console.log(err);
    if(row.length>0){
      res.send({'success':true,'email':row[0].email,'username':row[0].username,'ids':row[0].id,'status':row[0].status});
    } else{
      res.send({'success':false,'message':'User not found, Please try again'});
    }
  });
}
});

//get all the contacts
router.post('/contacts', function(req, res, next) {
  var username=req.body.email;
  if(!username){
    res.send({'success':false,'message':'Please Login'});
  } else{
  connection.query("SELECT * FROM users WHERE email!=?",[username],function(err,row,fields){
    if(err) console.log(err);
    if(row.length>0){
      let contacts = [];
      row.map(contact=>{
        let singleContact = {
          username: contact.username,
          id: contact.id,
          status: contact.status
        }
        contacts.push(singleContact);
      });
      res.send({'success':true,'contacts':contacts});
    } else{
      res.send({'success':false,'message':'User not found, Please try again'});
    }
  });
}
});

//get all chats
router.post('/chats', function(req, res, next) {
  let id=req.body.id;
  if(!id){
    res.send({'success':false,'message':'Please Login'});
  } else{
  connection.query("SELECT * FROM conversation where user_id=? or userTo=?",[id,id],function(err,row,fields){
    if(err) console.log(err);
    if(row.length>0){
      let chats = [];
      let users = [];
      row.map(user=>{
        users.push(user.user_id);
        users.push(user.userTo);
      });
      users = users.filter(user=>user!=id);
      users = removeDuplicateUsers(users);
      users.map(user=>{
        connection.query("SELECT * FROM users WHERE id=?",[user],(err,rows,fields)=>{
          if(err) {throw err;}
          else{
        connection.query("SELECT createdAt,received,text FROM conversation where (user_id=? and userTo=?) or (user_id=? and userTo=?) ORDER BY createdAt DESC",[id,rows[0].id,rows[0].id,id],(err,rowss,fields)=>{
          if(err){throw err;}
          else{
            let lastActive = rowss[0].createdAt;
            let received = rowss[0].received;
            let text = rowss[0].text;
            let msgs = rowss.length;
            let user = {
              id: rows[0].id,
              username: rows[0].username,
              email: rows[0].email,
              avatar: rows[0].avatar,
              status: rows[0].status,
              lastActive,
              received,
              text
            }
            if(msgs>0){
              connection.query("SELECT * FROM conversation where user_id=? and userTo=? and received=0",[rows[0].id,id],(err,unreadMessages,fields)=>{
                if(err){throw err;}
                else{
                  if(unreadMessages.length>0){
                    user.unread = unreadMessages.length;
                  } else{
                    user.unread = 0;
                  }
                }
              });
            }
            chats.push(user);
          }
        });
          }
        })
      })
      setTimeout(() => {
        chats = chats.sort((a, b) => b.lastActive - a.lastActive);
        // console.log("chats",chats);
        res.send({success:true,chats});
      },1000);
    } else{
      res.send({'success':false,'message':'No chat found'});
    }
  });
}
});

//get particular one to one chat
router.post('/getChat',(req,res,next)=>{
  let messages = [];
  let details=req.body;
  let userFrom = parseInt(details.userFrom);
    let userTo = parseInt(details.userTo);
    let onlineStatus = details.online;
    let conversation = "SELECT * FROM conversation where (user_id=? or user_id=?) and (userTo=? or userTo=?) ORDER BY createdAt DESC";
    let getUser = "SELECT * FROM users WHERE id=?";
    let updateReceiveStatus = "UPDATE conversation SET ? WHERE _id=?";
    connection.query(conversation,[userFrom,userTo,userFrom,userTo],(err,rowss,fields)=>{
      if(err){throw err;}
      else{
          rowss.map(message=>{
        let userId=username=avatar='';
        connection.query(getUser,[message.user_id],(err,rows,fields)=>{
          if(err){throw err;}
          else{
            userId = rows[0].id;
            username = rows[0].username;
            avatar = rows[0].avatar;
            let singleMessage = {
              text: message.text,
              user: {_id: message.user_id,
                name:username,
                avatar
              },
              createdAt: message.createdAt,
              _id: message._id,
              userTo: message.userTo,
              userFrom: message.user_id,
              image: message.image,
              video: message.video,
              sent: message.sent==1?true:false
            }
            if(onlineStatus && message.received==0){
              connection.query(updateReceiveStatus,[{received:1},message._id],(err,results)=>{
              if(err){throw err;}
              else{
                singleMessage.received = true
              }
              });
            } else if(message.received==1){
              singleMessage.received = true
            } else{
              singleMessage.received = false
            }
            messages.push(singleMessage);
            }
      });
      });
      setTimeout(() => {
      // console.log(messages);
      res.send({success:true,messages});
      }, 1000);
    }
  });
});

//User registration
router.post('/addUser', (req, res, next)=> {
  let details=req.body;
  if(!details.email || !details.password){
    res.send({'success':false,'message':'Please fill all the fields'});
  } else{
  connection.query("SELECT * FROM users WHERE email = ?",[details.email],function(err,row,fields){
    if(row.length>0){
      res.send({'success':false,'message':'User Already Exists'});
    } else{
      connection.query("INSERT INTO users SET ?",[details],function(err,result){
        if(err) throw err;
        res.send({'success':true,'message':'Registered Successfully'});
      })
    }
  });
}
});

//forgot password route Not yet implemented
router.post('/forgotPassword', function(req, res, next) {
  var details=req.body;
  if(!details.email){
    res.send({'success':false,'message':'Please fill all the fields'});
  } else{
  connection.query("SELECT * FROM users WHERE email = ?",[details.email],function(err,row,fields){
    if(row.length>0){
      res.send({'success':true,'message':'Reset Password Link Sent To Your Email Successfully'});
    } else{
      res.send({'success':false,'message':'User Not Found!'});
    }
  });
}
});

//convert base64 to image
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1].replace('images','image');
  response.data = Buffer.from(matches[2], 'base64');

  return response;
}

//to upload image
router.post("/imageMsg",(req,res,next)=>{
      const newPhoto = JSON.stringify(req.body);
      let parsed = JSON.parse(newPhoto);
      const image = parsed._parts[0][1]['uri'];
      const destpath = './public/images/';
      const fileNames = parsed._parts[0][1]['name'];
      const decodedImg = decodeBase64Image(image);
      const imageBuffer = decodedImg.data;
      const type = decodedImg.type;
      const extension = mime.getExtension(type);
      const fileName =  destpath+fileNames;
      try{
        fs.writeFileSync(fileName, imageBuffer, 'utf8');
        (async () => {
          // Set the optimization options
          const options = {
            images: [fileName, fileName],
            // width: 2400,
            // height: 1500,
            quality: 50
          };
          await resizeOptimizeImages(options);
          res.send({success:true,fileName:fileNames,message:"Successfully uploaded"});
        })();
     }
     catch(err){
     res.send({success: false,message:"Something wrong"});
    }
});

//to remove duplicate elements from array
function removeDuplicateUsers(data){
  return [...new Set(data)]
}

/* To upload multiple images works for Web*/
/* const storage = multer.diskStorage({
   destination: (req,file,callBack)=>{
     callBack(null,'public/images');
   },
   filename: (req,file,callBack)=>{
     callBack(null,file.originalname);
   }
 });

 const upload = multer({storage: storage});
*/

module.exports = router;

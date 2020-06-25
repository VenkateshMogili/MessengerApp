const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port=3000;
const db = require('./db');
const userRoute = require('./routes/users');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/users',userRoute);
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.bodyParser({limit: '50mb'}));



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let messages = [];
let connected = false;
let usersGlobal = [];
io.on("connection",socket=>{
  // console.log("User Connected");
  var addedUser = false;
  let numUsers = 0;

  socket.on('add user', (username) => {
    console.log("connected",username);
    // console.log("addded",addedUser);
    // if (addedUser) return;
    // else{
    // we store the username in the socket session for this client
    socket.username = username;
    let check=usersGlobal.findIndex(id=>id==username);
    if(check==-1){
      usersGlobal.push(username);
      // addedUser = true;
      console.log(usersGlobal);
    // echo globally (all clients) that a person has connected
    }
    io.emit('user joined', {
      username: usersGlobal
    });
  });
  socket.on('close connection',(username)=>{
    console.log("connection closing");
    let check=usersGlobal.findIndex(id=>id==username);
    if(check!=-1){
      usersGlobal.splice(check,1);
      // addedUser = true;
      console.log(usersGlobal);
    // echo globally (all clients) that a person has connected
    }
    io.emit('user joined',{
      username: usersGlobal
    });
  })
  socket.on("disconnect",(username)=>{
    // console.log("Offline");
    // console.log("Logged out",username);
    let check=usersGlobal.findIndex(id=>id==username);
    if(check>-1){
      usersGlobal.slice(check,1);
      // addedUser = true;
      console.log(usersGlobal);
    // echo globally (all clients) that a person has connected
    }
    io.emit('user left',{
      username: usersGlobal
    });
  });
  // let loaded = true;
//   socket.on("connected",user=>{
//     console.log("a user connected.");
//     console.log(user);
//     let userFrom = parseInt(user.userFrom);
//     let userTo = user.userTo;
//     let conversation = "SELECT * FROM conversation where (user_id=? or user_id=?) and (userTo=? or userTo=?) ORDER BY _id DESC";
//     let getUser = "SELECT * FROM users WHERE id=?";
//     db.query(conversation,[userFrom,userTo,userFrom,userTo],(err,rowss,fields)=>{
//       if(err){throw err;}
//       else{
//         console.log("rows",rowss.length);
//           rowss.map(message=>{
//         let userId=username=avatar='';
//         db.query(getUser,[message.user_id],(err,rows,fields)=>{
//           if(err){throw err;}
//           else{
//           userId = rows[0].id;
//           username = rows[0].username;
//           avatar = rows[0].avatar;
//           let singleMessage = {
//           text: message.text,
//           user: {_id: userId,name:username,avatar},
//           createdAt: message.createdAt,
//           _id: message._id
//           }
//           let checkMsg = messages.findIndex(msg=>msg._id==message._id);
//           if(checkMsg==-1){
//           messages.push(singleMessage);
//           }
//           }
//       });
//       });
//       // setTimeout(() => {
//       // if(loaded){
//       //   console.log("length",messages.length);
//       //   console.log("messages",messages);
//       //   io.emit('chat message', {
//       //     username: socket.username,
//       //     message: messages
//       //   });
//       //   loaded = false;
//       //   }
//       // }, 1000);
//     }
//   });
// });
// socket.on('clicked back',msg=>{
//   console.log("clicked back");
//   console.log(messages.length);
//   messages = [];
// })

  socket.on("typing",user=>{
    io.emit("is typing",user);
  });
  socket.on("chat message",msg=>{
      // console.log(msg);
      let userTo = parseInt(msg.userTo);
      let userFrom = parseInt(msg.userFrom);
      let data = {_id:msg._id,text:msg.text,image:msg.image,video:msg.video,user_id:userFrom,userTo:userTo,sent:msg.sent,received:msg.received};
      var sql = "INSERT INTO conversation SET ?";
      let createdId;
      db.query(sql,[data], (err, result)=> {
        if (err) {throw err;}
        else{
        console.log("Message Sent Successfully");
        createdId = result.insertId;
        let getUser = "SELECT * FROM users WHERE id=?";
        let username=avatar='';
        db.query(getUser,[msg.userFrom],(err,rows,fields)=>{
          if(err){throw err;}
          else{
          // console.log("users id",userFrom);
          // console.log("users id",userTo);
          // let userDefault;
          // if(userFrom==rows[0].id){
          //   userDefault = 2;
          // } else{
          //   userDefault = 1;
          // }
          username = rows[0].username;
          avatar = rows[0].avatar;
          let output = {
            text: msg.text,
            user: {_id: msg.user._id,
              name:username,
              avatar
            },
            createdAt: msg.createdAt,
            _id: msg._id,
            image: msg.image,
            video: msg.video,
            sent: msg.sent==1?true:false,
            received: msg.received==1?true:false,
            userFrom: userFrom,
            userTo: userTo
            }
            // console.log("finals",output);
          io.emit("receive message",output);
        }
        })
      }
    });
    })
});

function removeDuplicateUsers(data){
  return [...new Set(data)]
}

server.listen(port,()=>console.log("server is running on port: ",port));
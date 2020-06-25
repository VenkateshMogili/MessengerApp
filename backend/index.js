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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let messages = [];
let usersGlobal = [];
io.on("connection",socket=>{
// console.log("New User Connected");

//user will be added whenever open any chat
  socket.on('add user', (username) => {
    //console.log("connected user",username);
    socket.username = username;
    let check=usersGlobal.findIndex(id=>id==username);
    if(check==-1){
      usersGlobal.push(username);
      console.log(usersGlobal);
    }
    io.emit('user joined', {
      username: usersGlobal
    });
  });

//when user close connection
  socket.on('close connection',(username)=>{
    console.log("connection closing");
    let check=usersGlobal.findIndex(id=>id==username);
    if(check!=-1){
      usersGlobal.splice(check,1);
      console.log(usersGlobal);
    }
    io.emit('user joined',{
      username: usersGlobal
    });
  })

//when user disconnects
  socket.on("disconnect",(username)=>{
    // console.log("Offline");
    // console.log("Logged out",username);
    let check=usersGlobal.findIndex(id=>id==username);
    if(check>-1){
      usersGlobal.slice(check,1);
      console.log(usersGlobal);
    }
    io.emit('user left',{
      username: usersGlobal
    });
  });

//while typing the message
  socket.on("typing",user=>{
    io.emit("is typing",user);
  });

//when message sent
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
          io.emit("receive message",output);
        }
        })
      }
    });
    })
});

//removes duplicate values from array.
function removeDuplicateUsers(data){
  return [...new Set(data)]
}

//start the server
server.listen(port,()=>console.log("server is running on port: ",port));

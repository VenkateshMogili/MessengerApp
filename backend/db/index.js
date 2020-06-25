const db = require('mysql');
const connection = db.createConnection({
  host:'localhost',
  user:'root',//username
  password:'root',//password
  database:'messenger',//db name
  charset : 'utf8mb4'//to allow emojis
});

connection.connect((err)=>{
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else{
    console.log('db connected successfully');
  }
});

module.exports = connection;
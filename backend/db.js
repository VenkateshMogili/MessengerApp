const db = require('mysql');
const connection = db.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'messenger',
  charset : 'utf8mb4'
});

connection.connect((err)=>{
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else{
    console.log('db connected successfully');
  }
});

module.exports = connection;
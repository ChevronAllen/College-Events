const express = require('express');
const path = require('path');
const cluster = require('cluster');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const numCPUs = require('os').cpus().length;

const crytpo = require('crypto');
const mysql = require('mysql');

const SALT_LENGTH = 16;
const SALT_RANGE = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const HASH_ALGO = 'sha256';
const HASH_OUT_FORMAT = 'hex';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const ERROR_CONN = "Connection Error";
const ERROR_LOGIN = "Incorrect Username/Password combination";
const ERROR_REG_EXISTS = "An account already exists with that email";



function generateSalt(){
  var salt = "";
  for( i = 0; i < SALT_LENGTH; i++){
    var rand = Math.floor(Math.random() * SALT_RANGE.length);
    
    salt = salt + SALT_RANGE[rand];
  }
  return salt;
}

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  
  //  Create Connection Object
  var conn = mysql.createConnection({
    host: "otmaa16c1i9nwrek.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "odexbq57g80uqove",
    password: "zafxdf0tnbo7vebq",
    database: "euwtker4demcwlxt",
    port: "3306"
  });

  //  Attempt Connection to database
  conn.connect(function(err){
    if(err){ throw err; }
    console.log("...Connected");
  });

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  //  Register a new User Account
  app.post('/api/register', function (req, res) {
    
    var message = {}; //  Response object

    var email = req.body['email'];
    var password = req.body['password']; // pre hashed (md5) password
    
    //  Salt and Hash  password
    var salt = generateSalt()+"";
    var auth = crytpo.createHmac(HASH_ALGO, salt );
    auth = auth.update(password).digest(HASH_OUT_FORMAT);    
    

    // Server debug data
    let debug = {};
    debug['sessionID'] = req.sessionID;
    debug['email'] = email;
    debug['salt'] = salt;
    debug['hash'] = auth;
    console.log(debug);

    let sql = `CALL euwtker4demcwlxt.proc_user_register('${req.sessionID}', '${email}', '${salt}', '${auth}' )`;
      
    message['sesssionID'] = req.sessionID;

    conn.query(sql, function(err,result){
      //  Process query result
      if(err){
        message['error'] = 1; 
        message['error_descr'] = ERROR_CONN;
        message['userID'] = null;
      }else{

        message['userID'] = result[0][0]['userID'];

        if(message['userID'] == null){
          message['error'] = 1; 
          message['error_descr'] = ERROR_REG_EXISTS;
        }

      }
      
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(message));
    });

  });

  //  Login to an existing user account
  app.post('/api/login', function (req, res) {
    let message = {};
    
    let email = req.body['email'];
    let password = req.body['password'];
    let salt = null;

    //  Request Salt from Server
    let sql = `SELECT euwtker4demcwlxt.fn_find_salt('${email}') AS salt`;
    conn.query(sql, function(err,result){
    
      if(err){ 
        message['error'] = 1; 
        message['error_descr'] = ERROR_CONN;
      }else{
        salt = result[0]['salt']+"";
      }

      //  Stop here if no salt is returned
      if(salt != null){
        
        let auth = crytpo.createHmac(HASH_ALGO, salt );
        auth = auth.update(password).digest(HASH_OUT_FORMAT);
        
        let debug = {};
        debug['sessionID'] = req.sessionID;
        debug['email'] = email;
        debug['salt'] = salt;
        debug['hash'] = auth;
        console.log(debug);
        
        sql = `CALL euwtker4demcwlxt.proc_user_login('${req.sessionID}', '${email}', '${auth}' ); `;
        
        conn.query(sql, function(err,result){
          //  Process query result
          if(err){ 
            message['error'] = 1; 
            message['error_descr'] = ERROR_CONN;
            message['userID'] = null;
          }else{
            
            message['userID'] = result[0][0]['userID'];
            if(message['userID'] == null){
              message['userID'] = null;
              message['error'] = 1;
              message['error_descr'] = ERROR_LOGIN;
            }            
          }            
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(message));
        });
        
      }else{
        message['error'] = 1;
        message['error_descr'] = ERROR_LOGIN;
      }
      
    });    

  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}

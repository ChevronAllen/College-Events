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
const HASH_TYPE = 'sha256';
const HASH_OUT = 'hex';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;



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

  app.post('/api/register', function (req, res) {
    var message = {};
    var email = req.body['email'];
    var password = req.body['password'];
    var salt = generateSalt()+"";

    var auth = crytpo.createHmac(HASH_TYPE, salt );
    auth = auth.update(password);
    
    let debug = {};
    debug['sessionID'] = req.sessionID;
    debug['email'] = email;
    debug['salt'] = salt;
    debug['hash'] = auth.digest(HASH_OUT);
    console.log(debug);

    var sql = `CALL euwtker4demcwlxt.proc_user_register('${req.sessionID}', '${email}', '${salt}', '${auth.digest(HASH_OUT)}' )`;
    //console.log(sql);
    //  TODO: Session ids can still avoid MitM attacks. The less times the front end sends authentication data, the better.
    message['sesssionID'] = req.sessionID;
    message['email'] = email;

    
    conn.query(sql, function(err,result){
      //  Process query result
      if(err){
        message['error'] = 1; 
        message['error_descr'] = `An error occured, please try again later`;
      }else{
        message['userID'] = result[0][0]['userID'];
        if(message['userID'] == null){
          message['error'] = 1; 
          message['error_descr'] = `An account with this email already exists`;
        }
      }

      
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(message));
    });

  });

  app.post('/api/login', function (req, res) {
    let message = {};
    
    let email = req.body['email'];
    let password = req.body['password'];
    let salt = "";

    //  TODO: Query to fetch salt (also checks if user is valid)
    let sql = `SELECT euwtker4demcwlxt.fn_find_salt('${email}') AS salt`;
    conn.query(sql, function(err,result){
      //  TODO Process query result
      if(err){ 
        message['error'] = 1; 
        message['error_descr'] = `Incorrect Username or Password`;
      }else{
        salt = result[0]['salt']+"";
        console.log(result);
        console.log(salt);
      }

      //  TODO: Query to Login (sort out what data the front end needs to be sent on a success)

      let auth = crytpo.createHmac(HASH_TYPE, salt );
      auth = auth.update(password);

      let debug = {};
      debug['sessionID'] = req.sessionID;
      debug['email'] = email;
      debug['salt'] = salt;
      debug['hash'] = auth.digest(HASH_OUT);
      console.log(debug);

      sql = `CALL euwtker4demcwlxt.proc_user_login( '${email}', '${debug['hash']}','${req.sessionID}' ); `;
      console.log(sql);

      conn.query(sql, function(err,result){
        //  Process query result
        if(err){ 
          message['error'] = 1; 
          message['error_descr'] = `Incorrect Username or Password`;
        }else{
          message['userID'] = result[0][0]['userID'];
          
          console.log(message);
        }
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(message));
      });
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

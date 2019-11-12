const express = require('express');
const path = require('path');
const cluster = require('cluster');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const numCPUs = require('os').cpus().length;

const crytpo = require('crypto');
const SALT_LENGTH = 16;
const HASH_TYPE = 'sha256';
const HASH_OUT = 'hex';
const mysql = require('mysql');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;



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

  app.post('/registerAPI', function (req, res) {
    var email = req.body['email'] ;
    var hashAuth = req.body['auth'];
    var salt = crytpo.randomBytes(SALT_LENGTH);

    var hmac = crytpo.createHmac(HASH_TYPE,salt);
    hmac.update(hashAuth);
    

    var sql = `CALL euwtker4demcwlxt.proc_user_register( '${email}', '${salt}', '${hmac.digest(HASH_OUT)}' )`;
    //  TODO: Session ids can still avoid MitM attacks. The less times the front end sends authentication data, the better.

    conn.query(sql, function(err,result){
      //  Process query result
      if(err){ throw err; }


    });

    res.send(req.body.email);
  });

  app.post('/loginAPI', function (req, res) {
    var email = req.body['email'] ;
    var hashAuth = req.body['auth'];

    //  TODO: Query to fetch salt (also checks if user is valid)

    //  TODO: Query to Login (sort out what data the front end needs to be sent on a success)

    var sql = "";

    conn.query(sql, function(err,result){
      //  Process query result
      if(err){ throw err; }


    });

    res.send(req.body.email);
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}

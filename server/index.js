const express = require('express');
const path = require('path');
const cluster = require('cluster');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const numCPUs = require('os').cpus().length;

const crytpo = require('crypto');
const mysql  = require('mysql');

const SALT_LENGTH = 16;
const SALT_RANGE = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const HASH_ALGO = 'sha256';
const HASH_OUT_FORMAT = 'hex';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const ERROR_CONN = "Connection Error";
const ERROR_LOGIN = "Incorrect Username/Password combination";
const ERROR_REG_EXISTS = "An account already exists with that email";

const VALIDATION_SQL  = `SELECT fn_session_valid('{0}', '{1}') AS 'valid';`;




function generateSalt(){
  var salt = "";
  for( i = 0; i < SALT_LENGTH; i++){
    var rand = Math.floor(Math.random() * SALT_RANGE.length);
    
    salt = salt + SALT_RANGE[rand];
  }
  return salt;
}

function validateUser(userID, sessionID){

  return new Promise(function(resolve,reject){
    conn.query(VALIDATION_SQL,[userID,sessionID], function(err, results){
      
      if(err){
        reject(err.toString());
      }

      try{
        console.log(results[0]);
        if( results[0]['valid'] == 1){
          resolve(true);
        }else{
          resolve(false);
        }

      } catch(error){

        reject(error.toString());

      }

    });

  });
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

  app.use(cookieParser());
  app.use(session({secret:"like this?"}));
  
  //  Create Connection Object
  var conn = mysql.createConnection({
    host: "otmaa16c1i9nwrek.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "odexbq57g80uqove",
    password: "zafxdf0tnbo7vebq",
    database: "euwtker4demcwlxt",
    port: "3306",
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

  
  app.get('/api/schools', function(req,res){
    let message = {};

    let sql = "SELECT * FROM schools";
    conn.query(sql,function(err,result){

      if(err){
        message['error'] = 1;
        message['error_description'] = ERROR_CONN;
      }else{
        message = result;
      }

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(message));
    });
  });

  app.post('/api/rsos', function (req, res) {
    
    let message = {error: null};

    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];
    
    validateUser(userID,sessionID)
    .then(function(value){
      // Valid User

      let sql =  `SELECT r2.* FROM rsoMembers r LEFT JOIN rsos r2 ON r.rsoID = r2.rsoID WHERE r.userID = '${userID}'; `;

      conn.query(sql,function(err,results){

        if(err){
          message['error'] = 1; 
          message['error_description'] = ERROR_CONN;
        }else{          
          message['rsos'] = results;          
        }
         
        res.set('Content-Type', 'application/json');
        res.send(message);      

      });
     

    },function(value){
      // Invalid User
      message['error'] = 1;
      message['error_description'] = value;

      res.set('Content-Type', 'application/json');
      res.send(message);
    })
    .catch(function(error){
      console.log(error);
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });
    

  }); 

  app.post('/api/schools', function (req, res) {
    
    let message = {error: null};

    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];
    
    validateUser(userID,sessionID)
    .then(function(value){
      // Valid User

      let sql =  `SELECT s.* FROM userAttendance u LEFT JOIN schools s ON u.schoolID = s.schoolID WHERE u.userID = '${userID}'; `;

      conn.query(sql,function(err,results){

        if(err){
          message['error'] = 1; 
          message['error_description'] = ERROR_CONN;
        }else{          
          message['rsos'] = results;          
        }
         
        res.set('Content-Type', 'application/json');
        res.send(message);      

      });
     

    },function(value){
      // Invalid User
      message['error'] = 1;
      message['error_description'] = value;

      res.set('Content-Type', 'application/json');
      res.send(message);
    })
    .catch(function(error){
      console.log(error);
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });
    

  });

  app.post('/api/rso/create', function(req, res){
    let message = { error: 0};
    let rsoName = req.body['nameRSO'];
    let rsoDesc = req.body['descriptionRSO'];

    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];
    
    let sql = `SELECT fn_session_valid('${userID}', '${sessionID}') AS 'valid';`;

    console.log(req.body);

    validateUser(userID,sessionID)
    .then(function(value){
      // Valid User

      res.set('Content-Type', 'application/json');

      sql = `CALL euwtker4demcwlxt.proc_rso_create( '${rsoName}', '${rsoDesc}', '${userID}', 'f7858ec0-0a6d-11ea-a27d-0649c169819a' );`;

      conn.query(sql, function(err, result){
        if(err){
          message['error'] = 1;
          message['error_description'] = ERROR_CONN;
        }else{
          message['rsoID'] = result[0];
        }
        
        res.send(JSON.stringify(message));

      });     

    },function(value){
      // Invalid User
      message['error'] = 1;
      message['error_description'] = ERROR_LOGIN;

      res.send(message);
    })
    .catch(function(error){
      console.log(error);
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });

  });

  app.get('/api/events', function(req, res){
    let message = {error: null};
      
    res.set('Content-Type', 'application/json');
    
    let sql = `SELECT * FROM view_events_public;`;
    
    conn.query(sql,function(err,results){

      if(err){
        message['error'] = 1; 
        message['error_description'] = ERROR_CONN;
      }else{          
        message['events'] = results;          
      }
        
      res.send(message);    

    });


  });  

  app.post('/api/events', function (req, res) {
    
    let message = {error: null};

    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];
    
    validateUser(userID,sessionID)
    .then(function(value){
      // Valid User

      res.set('Content-Type', 'application/json');

      let sql =  `CALL euwtker4demcwlxt.proc_events_available( '${userID}' )`;

      conn.query(sql,function(err,results){

        if(err){
          message['error'] = 1; 
          message['error_description'] = ERROR_CONN;
        }else{          
          message['events'] = results[0];          
        }
         
        res.send(message);      

      });
     

    },function(value){
      // Invalid User
      message['error'] = 1;
      message['error_description'] = value;

      res.send(message);
    })
    .catch(function(error){
      console.log(error);
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });
    

  }); 

  app.post('/api/events/create', function (req, res){
    let message = {error: null};

    let isPublic = !req.body['private'] | true;
    let name = req.body['nameEvent'] ;
    let description = req.body['descriptionEvent'] ;
    let startDate = req.body['startDate'] ;
    let endDate =  req.body['endDate'] ;
    let repeats = {}; // req.body['repeat']
    let location =  req.body['location'] ; 
    let rsoID    = (req.body['rsoID'] == null) ?  'dea3d9c0-0e48-11ea-a27d-0649c169819a' : req.body['rsoID'];
    let schoolID = (req.body['schoolID'] == null ) ? 'f7858ec0-0a6d-11ea-a27d-0649c169819a' : req.body['schoolID'];
    
    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];

    if(rsoID != null){
      rsoID = `'${rsoID}'`;
    }

    res.set('Content-Type', 'application/json');

    validateUser(userID,sessionID)
    .then(
      function(value){
        // Run comment Create        
        let sql = `CALL proc_event_create('${isPublic}','${name}','${description}','${startDate}', '${endDate}', '${JSON.stringify(repeats)}','${JSON.stringify(location)}', '${userID}', ${rsoID}, '${schoolID}')`;
        
        conn.query(sql,function(err,results){
          if(err){
            message['error'] = 1;
            message['error_description'] = ERROR_CONN;
          }else{
            message['events'] = results[0];
          }
          
          res.send(message); 
        });        
      },
      function(value){
        // send credential error
        message['error'] = 1
        message['error_description'] = ERROR_LOGIN;

        res.send(message);        
      }
    )
    .catch(function(error){
      console.log(error);
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });      
    
  });

  app.post('/api/events/:eventID', function(req, res){
    let message = {error: null};

    let eventID = req.params['eventID'];
    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];

    res.set('Content-Type', 'application/json');

    validateUser(userID,sessionID)
    .then(
      function(value){
        let sql = `CALL euwtker4demcwlxt.proc_events_tryGet('${userID}','${eventID}');`;

        conn.query(sql,function(err,results){

          if(err){
            message['error'] = 1; 
            message['error_description'] = ERROR_CONN;
          }else{          
            message['events'] = results[0];          
          }          
          res.send(message);    
        });

      },
      function(value){
          message['error'] = 1;
          message['error_description'] = ERROR_LOGIN;
          res.send(message); 
      }
    )
    .catch(function(error){
      console.log(error);
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });        
  }); 

  
  
  
  app.get('/api/events/:eventID/comments', function(req, res){
    let message = {error: null};
    let eventID = req.params['eventID'];

    res.set('Content-Type', 'application/json');
    
    let sql = `CALL proc_comments_get('${eventID}');`;

    conn.query(sql,function(err,results){

      if(err){
        message['error'] = 1; 
        message['error_description'] = ERROR_CONN;
      }else{          
        message['comments'] = results[0];          
      }        
        
      res.send(message);

    });       

  });

  app.post('/api/comment/create', function(req, res){
    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];
    let comment = req.body['comment'];
    let parent = req.body['parent'];
    let event = req.body['event'];

    let message = {error: null};

    if(parent != null){
      parent = `'${parent}'`;
    }

    res.set('Content-Type', 'application/json');

    validateUser(userID,sessionID)
    .then(
      function(value){
        // Run comment Create        
        let sql = `CALL proc_comment_create( '${comment}', ${parent}, '${event}', '${userID}')`;
       
          conn.query(sql,function(err,results){
            if(err){
              message['error'] = 1;
              message['error_description'] = ERROR_CONN;
            }else{              
              message['comment'] = results[0];
            }
            res.send(message); 
          });        
      },
      function(value){
        // send credential error

        message['error'] = 1
        message['error_description'] = value;

        res.send(message);       
      }
    )
    .catch(function(error){
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });

  });

  app.post('/api/comment/edit', function(req, res){
    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];
    let commentID = req.body['commentID'];
    let comment = req.body['comment'];
    
    let message = {error: null};

    res.set('Content-Type', 'application/json');

    validateUser(userID,sessionID)
    .then(
      function(value){
        // Run comment Create        
        let sql = `CALL proc_comment_edit( '${comment}', '${commentID}', '${userID}')`;
       
          conn.query(sql,function(err,results){
            if(err){
              message['error'] = 1;
              message['error_description'] = ERROR_CONN;
            }else{
              message['comment'] = results[0];
            }
            res.send(message); 
          });        
      },
      function(value){
        // send credential error

        message['error'] = 1
        message['error_description'] = value;

        res.send(message);       
      }
    )
    .catch(function(error){
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });
  });

  app.post('/api/comment/delete', function(req, res){
    let userID = req.body['userID'];
    let sessionID = req.body['sessionID'];
    let commentID = req.body['commentID'];
    
    let message = {error: null};

    res.set('Content-Type', 'application/json');

    validateUser(userID,sessionID)
    .then(
      function(value){
        // Run comment Create        
        let sql = `CALL proc_comment_delete( '${commentID}', '${userID}')`;
       
          conn.query(sql,function(err,results){
            if(err){
              message['error'] = 1;
              message['error_description'] = ERROR_CONN;
            }else{
              message['comment'] = results[0];
            }
            res.send(message); 
          });        
      },
      function(value){
        // send credential error

        message['error'] = 1
        message['error_description'] = value;

        res.send(message);       
      }
    )
    .catch(function(error){
      message['error'] = 1;
      message['error_description'] = error; 
      console.log(message);
      res.send(message);
    });
  });
  

  //  Register a new User Account
  app.post('/api/register', function (req, res) {
    
    var message = {error: null}; //  Response object

    var email = req.body['email'];
    var password = req.body['password']; // pre hashed (md5) password
    
    //  Salt and Hash  password
    var salt = generateSalt();
    var auth = crytpo.createHmac(HASH_ALGO, salt );
    auth = auth.update(password).digest(HASH_OUT_FORMAT);    
    
   
    let sql = `CALL euwtker4demcwlxt.proc_user_register('${email}', '${salt}', '${auth}' );`;
      
    message['sesssionID'] = req.session['sessionID'];

    conn.query(sql, function(err,result){
      //  Process query result
      if(err){
        message['error'] = 1; 
        message['error_description'] = ERROR_CONN;
        message['userID'] = null;
        message['debug'] = err;
      }else{

        message['userID'] = result[0][0]['userID'];
        message['sessionID'] = result[0][0]['sessionID'];        

        if(result[0][0]['error'] != null){
          message['error'] = 1; 
          message['error_descr'] = result[0][0]['error'];
        }        
      }
      
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(message));
    });

  });

  //  Login to an existing user account
  app.post('/api/login', function (req, res) {
    let message = {error:null};
    
    let email = req.body['email'];
    let password = req.body['password'];
    let salt = null;

    //  Request Salt from Server
    let sql = `SELECT euwtker4demcwlxt.fn_find_salt('${email}') AS salt`;
    conn.query(sql, function(err,result){
    
      if(err){ 
        message['error'] = 1; 
        message['error_descr'] = ERROR_CONN;
        salt = null;
      }else{
        salt = result[0]['salt'];
      }

      // Stop here if no salt is returned
      if(salt != null){
        
        let auth = crytpo.createHmac(HASH_ALGO, salt );
        auth = auth.update(password).digest(HASH_OUT_FORMAT);
        
        //  Login 
        sql = `CALL euwtker4demcwlxt.proc_user_login( '${email}', '${auth}' );`;        
        conn.query(sql, function(err,result){
          
          if(err){ 
            message['error'] = 1; 
            message['error_descr'] = ERROR_CONN;
            message['userID'] = null;
          }else{
            
            message['userID'] = result[0][0]['userID'];
            message['sessionID'] = result[0][0]['sessionID'];
            
            if(result[0][0]['error'] != null){
              message['error'] = 1;
              message['error_descr'] = result[0][0]['error'];
            }
            
          }    
          
          
          res.set('Content-Type', 'application/json');
          res.send(JSON.stringify(message));
        });
        
      }else{
        message['error'] = 1;
        message['error_descr'] = ERROR_LOGIN;

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(message));
      }
      
    });    

  });

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}

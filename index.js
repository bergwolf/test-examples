var express = require('express'),
    http = require('http'),
    redis = require('redis');

app = express();

console.log(process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);

// APPROACH 1: Using environment variables created by Docker
// var client = redis.createClient(
//  process.env.REDIS_PORT_6379_TCP_PORT,
//    process.env.REDIS_PORT_6379_TCP_ADDR
// );

// APPROACH 2: Using host entries created by Docker in /etc/hosts (RECOMMENDED)
var client = redis.createClient('6379', 'redis');


app.get('/', function(req, res, next) {
  client.incr('counter', function(err, counter) {
    if(err) return next(err);
    res.send(`
      <head>
        <link href="https://fonts.googleapis.com/css?family=Roboto:100" rel="stylesheet" type="text/css">
      </head>
      <style>
        body {
          font-family: 'Roboto', sans-serif;
          background-color: rgb(49, 49, 49);
          color: rgb(255, 136, 0);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          flex-direction: column;
        }
        footer {
          margin-top: 20px;
          font-size: 28px;
          color: #848484;
        }
        a {
          color: white;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
        span {
          margin: 0 5px;
          border-radius: 4px;
          color: white;
        }
        span::before {
          content: " ";
          position: absolute;
          background-color: black;
          width: 40px;
          margin-left: -4px;
          height: 36px;
          z-index: -1;
          border-radius: 4px;
        }
        span::after {
          content: " ";
          position: absolute;
          margin-top: 37px;
          background-color: black;
          width: 40px;
          height: 36px;
          z-index: -1;
          margin-left: -37px;
          border-radius: 4px;
        }
      </style>
      <body>
        <div>This page has been viewed <script>document.write(String(${counter}).split('').map(function(c) {return '<span>' + c + '</span>'}).join(''))</script> times</div>
        <footer>© 2016, HyperHQ Inc. All rights reserved. For more information, visit <a href="https://hyper.sh">hyper.sh</a></footer>
      </body>
    `);
  });
});

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});

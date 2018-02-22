var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var connect = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs_crud'
});

app.get('/items', function(req, res) {
  res.render('items');
});

app.get('/add-item', function(req, res) {
  res.render('add-item');
});

app.post('/add-item', urlencodedParser,  function(req, res) {
  var insert_item = "INSERT INTO items(first_name, last_name, email) VALUE (?, ?, ?)";
  // establishing connection...
  connect.getConnection(function(err, connection) {
    connection.query(insert_item, [req.body.fn, req.body.ln, req.body.email], function(err, connection) {
      if(err) {
        console.log(err);
      } else {
        console.log('item added Successfully!');
      }
    });
  });
  console.log(req.body);
});

app.get('/edit-item', function(req, res) {
  console.log(req.query);
  res.render('edit-item');
});

app.post('/edit-item', urlencodedParser, function(req, res) {
  console.log(req.body);
});

app.get('/delete-item', function(req, res) {
  console.log(req.query);
});

console.log('listening to port 3000...');
app.listen(3000);

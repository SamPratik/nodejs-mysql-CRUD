var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// mysql connection...
var connect = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs_crud'
});

// read item functionality added...
app.get('/items', function(req, res) {
  var select_items = "SELECT * FROM items";

  // establishing connection...
  connect.getConnection(function(err, connection) {
    connection.query(select_items, function(err, data) {
      if(err) {
        console.log(err);
      } else {
        //releasing connection
        connection.release();
        var items = JSON.stringify(data);
        console.log(items);
        res.render('items', {items: items});
      }
    });
  });

});

app.get('/add-item', function(req, res) {
  res.render('add-item');
});

// add item functionality...
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
  var itemId = req.query.id;
  // var edit_item = "SELECT * FROM items WHERE id=" + itemId;
  console.log(itemId);
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

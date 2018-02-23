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

// returning edit item prepopulated form...
app.get('/edit-item', function(req, res) {
  var itemId = req.query.id;
  var edit_item = "SELECT * FROM items WHERE id=" + itemId;

  // establishing connection...
  connect.getConnection(function(err, connection) {
    connection.query(edit_item, function(err, data) {
        if(err) {
          console.log(err);
        } else {
          var item = JSON.stringify(data);
          console.log(item);
          res.render('edit-item', {item: item});
        }
    });
  });
});

// update item functionality...
app.post('/edit-item', urlencodedParser, function(req, res) {
  var fn = req.body.fn;
  var ln = req.body.ln;
  var email = req.body.email;
  var id = req.body.id;
  var update_item = "UPDATE items SET first_name=?, last_name=?, email=? WHERE id=?";

  connect.getConnection(function(err, connection) {
    connection.query(update_item, [fn, ln, email, id], function(err, connection) {
      if(err) {
        console.log(err);
      } else {
        console.log('Item updated Successfully!');
      }
    });
  });
});

app.get('/delete-item', function(req, res) {
  console.log(req.query);
});

console.log('listening to port 3000...');
app.listen(3000);

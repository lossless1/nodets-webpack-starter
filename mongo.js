var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url,{ useNewUrlParser: false } , function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  console.log(db);

  // Insert a single document
  db.collection('inserts').insertOne({
        a:1
      , b: function() { return 'hello'; }
    }, {
        w: 'majority'
      , wtimeout: 10000
      , serializeFunctions: true
    }, function(err, r) {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);
    db.close();
  });
});
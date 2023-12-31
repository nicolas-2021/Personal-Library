/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let bookId;
let timeout=10000;
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({title:"Frog Prince"})
          .end(function(err,res){
            assert.equal(res.status,200);
            bookId=res.body._id;
            assert.equal(res.type,'application/json');
            assert.equal(res.body.title,"Frog Prince");
            done();
          }).timeout(timeout);
        //done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai 
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'missing required field title');
            done();
          }).timeout(timeout);
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai  
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.isArray(res.body, 'is an array');
            done();
          }).timeout(timeout);
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/notId')
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'no book exists');
            done();
          }).timeout(timeout);
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/'+bookId)
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body._id,bookId);
            done();
          }).timeout(timeout);
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/'+bookId)
          .send({comment:'great'})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.comments[0],'great');
            done();
          }).timeout(10000);
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/'+bookId)
          .send({})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'missing required field comment');
            done();
          }).timeout(timeout);
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/notId')
          .send({comment:'unconfortable'})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'no book exists');
            done();
          }).timeout(timeout);
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/'+bookId)
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'delete successful');
            done();
          }).timeout(timeout);
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/notId')
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,'no book exists');
            done();
          }).timeout(timeout);
        //done();
      });

    });

  });

});

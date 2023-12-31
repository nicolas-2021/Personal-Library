/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models.js').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) =>{
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try{
        const book = await Book.find({});
        if (!book){
          res.json([]);
          return;
        }
        const formatData = book.map((book)=>{
          return {
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length 
          }
        });
        res.json(formatData);
        return;
      }catch(err){
        res.json([]);
      }

    })
    
    .post(async (req, res) =>{
      let title = req.body.title;
      if (!title){
        res.send('missing required field title');
        return;
      }
      const newBook = new Book({title,comments:[]});
      try{
        const book = await newBook.save();
        res.json({title:book.title,_id:book._id});
      }catch(err){
        res.send('there was an error saving');
      }

      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res) =>{
      try{
        const deleted = await Book.deleteMany();
        res.send('complete delete successful');
      }catch(err){
        res.send('error');
      }
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res) =>{
      let bookid = req.params.id;
      try{
        const book = await Book.findById(bookid);
        res.json({
          _id:book._id,
          title:book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });
      }catch(err){
        res.send('no book exists')
      }

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async(req, res)=>{
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment){
        res.send('missing required field comment');
        return;
      }
      try{
        let book = await Book.findById(bookid);
        book.comments.push(comment);
        book = await book.save();
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });
      }catch(err){
        res.send('no book exists');
      }
    })
    
    .delete(async(req, res)=>{
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try{
        const deleted = await Book.findByIdAndDelete(bookid);
        if (!deleted){
          throw new Error("no book exists");
        }
        res.send('delete successful');
      }catch(err){
        res.send('no book exists');
      }
      //const deleted = await Book.deleteOne({_id:bookid});

    });
  
};

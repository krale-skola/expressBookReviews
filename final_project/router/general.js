const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//fonction help getting all books using promise callback
const getallbooks = () => Promise.resolve(books)

//fonction help getting book details using promise callback
const getDetailsISBN = (isbn) => {
  let myPromise = new Promise((resolve,reject) => {


    if(isbn > 0 && isbn < 11){
      let theBook = books[isbn]
      resolve( theBook )
    }
    else {
      resolve("No book found with the ISBN: " + isbn)
    }
  })
  return myPromise
}

 //fonction help getting all books by author using promise callback
const getbooksbyauthor = (author) => {
  let promise = new Promise((resolve,reject)=> {
    let livre = [];
    let livres = Object.values(books);
    livres.forEach(book => {
      if(book.author === author){
        livre.push(book);
      } 
    })
    if(livre.length !== 0){
      resolve(livre)
    } 
    else{
      resolve(`No book found with the author: ${author}`)
    }
  })
  return promise
}

//fonction help getting book by title using promise callback
const getbooksbytitle = (title) =>{
  let promise = new Promise((resolve,reject) =>{
    let livre = ""

    let theTitles = Object.values(books)

    theTitles.forEach(element =>{
      if(element.title === title){ livre = element}
    })
    if(livre.length !== 0 ){ resolve(livre)}
    else {resolve("No book found with the title: " + title) }
    })
    return promise
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if(username && password){
    //console.log(users)
    if(!isValid(username)){
      return res.status(400).json({message:"This user is already registered "});
    }else{
      users.push({"username":username,"password":password})
      return res.status(200).json({message:"user successfully registered, now you can login! "});
    }
  }
  return res.status(400).json({message: "Registration process failed no username or password!"});
});

/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  result = JSON.stringify(books,null,'--')
  return res.status(200).send(result);
}); */

//Getting all books using promise callback
public_users.get('/',function (req, res) {
  getallbooks()
   .then(result => res.status(200).send(JSON.stringify(result,null,'..')))
   .catch(err => res.status(500).send(err))
});

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  isbn = req.params.isbn
  const books_length = Object.keys(books).length

  if(isbn > 0 && isbn <= books_length){
    res.status(200).send(books[isbn])
    return
  }
  else {
    res.status(404).json({message: "No book found with ISBN: " + isbn})
  }
 }); */

 //Getting book details using promise callback
 public_users.get('/isbn/:isbn',function (req, res) {
  getDetailsISBN(req.params.isbn)
   .then(result => res.status(200).send(result))
   .catch(err => res.status(500).send(err))
    
});
  
/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  let livre = [];
  let livres = Object.values(books);
  livres.forEach(book => {

    if(book.author === author){
      livre.push(book);
    } 
  })
  if(livre.length !== 0){
    res.status(200).send(livre);
    return
  } 
  else{
    res.status(404).send(`No book found with the author: ${author}`);
    return
  }
}); */

//Getting all books by author using promise callback
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  getbooksbyauthor(author)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err))
});

/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  let livre = ""

  let theTitles = Object.values(books)

  theTitles.forEach(element =>{

    if(element.title === title){ livre = element}
  })
  if(livre.length !== 0 ){ 
    return res.status(200).send(livre)
  }
  else {
    return res.status(404).send("No book found with the title: " + title) 
  }
}); */

//Getting book by title using promise callback
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  getbooksbytitle(title)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err))
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  const books_length = Object.keys(books).length

  if(isbn > 0 && isbn <= books_length){
    res.send(books[isbn].reviews)
    return
  }
  else{
    res.status(404).send("No book found with the ISBN: " + isbn)
    return
  }
});

module.exports.general = public_users;

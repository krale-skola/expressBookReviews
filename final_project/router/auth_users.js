const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userWithSameName = users.filter((user)=>{
    return user.username === username
  });
  if(userWithSameName.length <= 0){return true}
  else{ return false}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
   });
   if(validusers.length <= 0){return false}
    else{ return true}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if(!username || !password){
      return res.status(400).json({message:"Error while logging in."});
    }
  
    if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({
        data: password
      }, 'Bootylicious',{expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).json({message:"User successfully logged in "});
    } else {
      return res.status(400).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn
  const books_length = Object.keys(books).length
  let current_user = req.session.authorization.username
  let review = req.query.review
  

  if( isbn <= books_length){
    let reviewList = books[isbn].reviews
    let userList = Object.keys(reviewList)
    userList.forEach( element => {
      if(element === current_user){
        books[isbn].reviews[current_user] = review
        res.json({message:`The review of ${current_user} is updated successfully`})
        return
      }
    })
    books[isbn].reviews[current_user] = review
    //res.send(reviewList)
    res.json({message:'The new review is added successfully'})
    return
  }
  else{
    res.status(404).json({message:"No book found with the ISBN: " + isbn})
    return
  }
});

// delete user review. user can only delete his/her own review
regd_users.delete("/auth/review/:isbn", (req,res)=> {
    let isbn = req.params.isbn
    const books_length = Object.keys(books).length
    let current_user = req.session.authorization.username
    let review = req.query.review
    
  
    if( isbn <= books_length){
      let reviewList = books[isbn].reviews
      if(Object.keys(reviewList).length === 0){
        res.send("the review list is empty")
        return
      }
      else{
        let userList = Object.keys(reviewList)
        userList.forEach( element => {
          if(element === current_user){
            delete books[isbn].reviews[current_user]
            res.json({message:`The review of ${current_user} is deleted`})
            return
          }
        })
        res.status(404).json({message:`No review found for user: ${current_user}`})
      }
      
    }
    else{
      res.status(404).json({message:"No book found with the ISBN: " + isbn})
      return
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

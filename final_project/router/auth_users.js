const { Router } = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let usersWithSamaName = users.filter(user => user.username === username);
    if (usersWithSamaName.length > 0) {
        return true;
    } else {
        return false;
    }
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter(user=>user.username===username && user.password===password);
  if(validUsers.length>0){
    return true;
  } else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Invalid input"});
  }
  if (authenticatedUser(username, password)) {
    let token = jwt.sign({
      data: password
  }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {token, username};
  console.log(JSON.stringify(users));
    return res.status(200).json({message: "User authenticated"});
  }
  return res.status(403).json({message: "User not authenticated"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review: newReview } = req.query;
  
  const username = req.session.authorization.username;
  const book = books[isbn];
  const reviewByIsbn = book.reviews;
  console.log(JSON.stringify(book));
  console.log(JSON.stringify(reviewByIsbn));
  if(username) {
    if (reviewByIsbn.username) {
      books[isbn].reviews[username] = newReview;
      return res.status(400).json({message: "Review updated"});
    } else {
      books[isbn].reviews[username] = newReview;
      return res.status(200).json({message: "Review added"});
    }
  }
  return res.status(403).json({message: "User not authenticated"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const reviewByIsbn = books[isbn].reviews;
  console.log(JSON.stringify(reviewByIsbn[username]));
  if(username) {
    if (reviewByIsbn[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted"});
    } else {
      return res.status(404).json({message: "Review not found"});
    }
  }
  return res.status(403).json({message: "User not authenticated"});
});

module.exports = {
    authenticated: regd_users,
    isValid,
    users
};

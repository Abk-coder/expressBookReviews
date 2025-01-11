const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Invalid input"});
  }
  if (isValid(username)) {
    return res.status(400).json({message: "User already exists"});
  }
  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User created"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((books) => {
    return res.status(200).json(books);
  })
  .catch((err) => {
    return res.status(500).json({message: "Internal Server Error"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({message: "Book not found"});
    }
  }).then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json(err);
  }
  );
 });
  
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author;
    let booksList = [];
    for (let book in books) {
      if (books[book].author === author) {
        booksList.push(books[book]);
      }
    }
    if (booksList.length > 0) {
      resolve(booksList);
    } else {
      reject({message: "Author not found"});
    }
  }).then((booksList) => {
    return res.status(200).json(booksList);
  }).catch((err) => {
    return res.status(404).json(err);
  });
});

public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title;
    let booksList = [];
    for (let book in books) {
      if (books[book].title === title) {
        booksList.push(books[book]);
      }
    }
    if (booksList.length > 0) {
      resolve(booksList);
    } else {
      reject({message: "Title not found"});
    }
  }).then((booksList) => {
    return res.status(200).json(booksList);
  }).catch((err) => {
    return res.status(404).json({message: "Title not found"});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports = {
  general: public_users
};

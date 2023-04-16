const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    let matchedUsers = users.filter((user)=> {
        return user.username === username; 
    })
    return matchedUsers.length > 0 ? true : false;
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!doesExist(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered."})
    }
    else{
        return res.status(404).json({message: "Username already exists."})
    }
  }
  else{
      return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let authorBooks = [];
    for (const isbn in books) {
        if(books[isbn]['author'] === author){
            authorBooks = [...authorBooks, books[isbn]];
        }
    }
    return res.send(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let titleBooks = [];
    for (const isbn in books) {
        if(books[isbn]['title'] === title){
            titleBooks = [...titleBooks, books[isbn]];
        }
    }
    return res.send(titleBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;

const axios = require('axios');
const http = require('http');

function makeHttpRequest(options) {
  return new Promise((resolve, reject) => {
    const request = http.request(options, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    });

    request.on('error', error => {
      reject(error);
    });

    request.end();
  });
}

const optionsGetAllBooks = {
  hostname: 'localhost',
  port: '5000',
  path: '/',
  method: 'GET'
};


makeHttpRequest(optionsGetAllBooks)
  .then(data => console.log(JSON.stringify(data,null,4)))
  .catch(error => console.error(error));

console.log("*******************************")

  const optionsBooksByIsbn = {
hostname: 'localhost',
port: '5000',
path: '/isbn/2/',
method: 'GET'
};

makeHttpRequest(optionsBooksByIsbn)
    .then(data => console.log(JSON.stringify(data,null,4)))
    .catch(error => console.error(error));


axios.get('http://localhost:5000/title/Things Fall Apart')
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

  axios.get('http://localhost:5000/author/Unknown')
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });


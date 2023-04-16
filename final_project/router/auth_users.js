const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let matchedUsers = users.filter((user)=> {
        return user.username === username && user.password === password; 
    })
    return matchedUsers.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(404).json({message: "Error logging in."})
    }
    if(authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 5 * 60 * 60});

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send({message: "User successfully logged in"});
    }
    else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username'];

    books[isbn]['review'] = {...books[isbn]['review'], [username] : review};
    
    return res.status(200).send({message: "Review Successfully added/modified."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    delete books[isbn]['review'][username];
    
    return res.status(200).send({message: "Review Successfully deleted."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

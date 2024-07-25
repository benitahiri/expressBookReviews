const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Function to check if username and password match the records
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
        req.session.token = token;
        return res.status(200).json({ message: "Logged in successfully", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;

    // Lejo të gjithë përdoruesit pa kontroll të tokenit
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Përdoruesi mund të jetë pa emër në këtë rast
    const username = req.user?.username || 'anonymous';
    books[isbn].reviews[username] = review; // Add or modify the review
    return res.status(200).json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Lejo të gjithë përdoruesit pa kontroll të tokenit
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[req.user?.username]) {
        return res.status(404).json({ message: "Review not found for the user" });
    }

    delete books[isbn].reviews[req.user?.username]; // Delete the review
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

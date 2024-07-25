const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const public_users = express.Router();

// Secret for JWT, ensure it's stored securely
const JWT_SECRET = 'your_jwt_secret';

// Register user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const bookList = Object.values(books).filter(book => book.author === author);
    if (bookList.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "Books by this author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const bookList = Object.values(books).filter(book => book.title === title);
    if (bookList.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "Books with this title not found" });
    }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews || {});
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Add or modify a book review
public_users.post('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review || review.trim() === "") {
        return res.status(400).json({ message: "Review cannot be empty" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Përdoruesi mund të jetë pa emër në këtë rast
    const username = req.user?.username || 'anonymous';
    books[isbn].reviews[username] = review; // Add or modify the review
    return res.status(200).json({ message: "Review added/modified successfully" });
});

module.exports.general = public_users;

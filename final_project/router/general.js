
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const BASE_URL = "http://localhost:5000"; 

// Enregistrement des nouveaux utilisateurs
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Utilisateur enregistré avec succès."});
        } else {
            return res.status(404).json({message: "Nom d'utilisateur déjà utilisé."});
        }
    }
    return res.status(404).json({message: "Nom d'utilisateur ou mot de passe manquant."});
});

// Obtenir la liste de tous les livres
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Obtenir les détails d'un livre par ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Livre non trouvé." });
});

// Obtenir les détails d'un livre par auteur
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const results = Object.values(books).filter(book => book.author === author);
    return res.status(200).json(results);
});

// Obtenir les détails d'un livre par titre
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const results = Object.values(books).filter(book => book.title === title);
    return res.status(200).json(results);
});

// Obtenir les critiques d'un livre
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    }
    return res.status(404).json({ message: "Livre non trouvé." });
});

async function getAllBooks() {
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        console.log("Tous les livres :", response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error.message);
    }
}

function getBookByISBN(isbn) {
    axios.get(`${BASE_URL}/books/isbn/${isbn}`)
        .then(response => {
            console.log(`Détails du livre avec ISBN ${isbn} :`, response.data);
        })
        .catch(error => {
            console.error(`Erreur lors de la recherche par ISBN ${isbn} :`, error.message);
        });
}

function getBooksByAuthor(author) {
    axios.get(`${BASE_URL}/books/author/${author}`)
        .then(response => {
            console.log(`Livres de l'auteur ${author} :`, response.data);
        })
        .catch(error => {
            console.error(`Erreur lors de la recherche par auteur ${author} :`, error.message);
        });
}

function getBooksByTitle(title) {
    axios.get(`${BASE_URL}/books/title/${title}`)
        .then(response => {
            console.log(`Livres avec le titre "${title}" :`, response.data);
        })
        .catch(error => {
            console.error(`Erreur lors de la recherche par titre "${title}" :`, error.message);
        });
}


module.exports.general = public_users;

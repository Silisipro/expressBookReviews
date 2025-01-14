// const express = require('express');
// const jwt = require('jsonwebtoken');
// let books = require("./booksdb.js");
// const regd_users = express.Router();

// let users = [];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

// //only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
// module.exports.users = users;


const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Vérifie si le nom d'utilisateur est valide
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};

// Vérifie si l'utilisateur est authentifié
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

// Connexion des utilisateurs enregistrés
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe manquant." });
    }
    if (authenticatedUser(username, password)) {
         let token = jwt.sign({
            data: password,
            username: username,
        }, 'loveCode', { expiresIn: 60 * 60 });
        req.session.authorization = {
            token, username
        }
        return res.status(200).json({ message: "Connexion réussie.", token });
    }
    return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
});

// Ajouter ou modifier une critique
regd_users.put("/auth/review/:isbn", (req, res) => {
    // const token = req.session.token;
    // if (!token) {
    //     return res.status(401).json({ message: "Non autorisé. Connectez-vous pour continuer." });
    // }

    if (req.session.authorization) {
        let token = req.session.authorization['token'];
        if (!token) {
            return res.status(401).json({ message: "Non autorisé. Connectez-vous pour continuer." });
        }else {
            const username = req.session.authorization['username'];
            const isbn = req.params.isbn;
            const { review } = req.body;

            if (!books[isbn]) {
                return res.status(404).json({ message: "Livre non trouvé." });
            }

            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Critique ajoutée/modifiée avec succès." });
                }
            }
});

// Supprimer une critique
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ message: "Non autorisé. Connectez-vous pour continuer." });
    }

    const decoded = jwt.verify(token, "loveCode");
    const { username } = decoded;
    const isbn = req.params.isbn;

    if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Critique introuvable." });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Critique supprimée avec succès." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

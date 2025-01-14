const axios = require('axios');

const BASE_URL = "http://localhost:5000"; 

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

(async () => {
    console.log("=== Obtenir tous les livres ===");
    await getAllBooks();

    console.log("\n=== Rechercher un livre par ISBN ===");
    getBookByISBN("12345"); 

    console.log("\n=== Rechercher des livres par Auteur ===");
    getBooksByAuthor("Chinua Achebe"); 

    console.log("\n=== Rechercher des livres par Titre ===");
    getBooksByTitle("Things Fall Apart");
})();

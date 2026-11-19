
const express = require('express');
const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store book details
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 250
    },
    {
        id: 2,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        price: 300
    }
];

// GET - Retrieve all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET - Retrieve a particular book by ID
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// POST - Add a new book
app.post('/books', (req, res) => {
    const { title, author, price } = req.body;

    if (!title || !author || price === undefined) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newBook = {
        id: books.length > 0
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title,
        author,
        price: Number(price)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// PUT - Update book details
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (!title || !author || price === undefined) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    book.title = title;
    book.author = author;
    book.price = Number(price);

    res.json({
        message: "Book updated successfully",
        book
    });
});

// DELETE - Delete a book
app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully"
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


const API = '/books';

// Display all books
async function loadBooks() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Unable to fetch books");
        }

        const books = await response.json();

        const list = document.getElementById('bookList');

        list.innerHTML = '';

        books.forEach(book => {
            list.innerHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>₹${book.price}</td>
                    <td>
                        <button class="edit"
                            onclick="editBook(${book.id})">
                            Edit
                        </button>

                        <button class="delete"
                            onclick="deleteBook(${book.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        showMessage(error.message);
    }
}

// Add or update book
async function saveBook() {
    const id = document.getElementById('bookId').value;
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const price = document.getElementById('price').value;

    if (!title || !author || price === '' ||
        !Number.isFinite(Number(price)) || Number(price) < 0) {
        showMessage("Please enter valid book details");
        return;
    }

    const book = {
        title,
        author,
        price: Number(price)
    };

    try {
        const response = await fetch(
            id ? `${API}/${id}` : API,
            {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        showMessage(result.message);

        clearForm();
        loadBooks();

    } catch (error) {
        showMessage(error.message);
    }
}

// Edit book
async function editBook(id) {
    try {
        const response = await fetch(`${API}/${id}`);

        const book = await response.json();

        if (!response.ok) {
            throw new Error(book.message);
        }

        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('price').value = book.price;

    } catch (error) {
        showMessage(error.message);
    }
}

// Delete book
async function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {
        const response = await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        showMessage(result.message);

        loadBooks();

    } catch (error) {
        showMessage(error.message);
    }
}

// Clear form
function clearForm() {
    document.getElementById('bookId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('price').value = '';
}

// Display messages
function showMessage(message) {
    document.getElementById('message').textContent = message;
}

// Load books when page opens
loadBooks();

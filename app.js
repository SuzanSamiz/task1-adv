"use strict";
class Book {
    #title;
    #author;
    #category;
    #isAvailable;
    constructor(title, author, category) {
        this.#title = title;
        this.#author = author;
        this.#category = category;
        this.#isAvailable = true;
    }
    get title() { return this.#title; }
    get author() { return this.#author; }
    get category() { return this.#category; }
    get isAvailable() { return this.#isAvailable; }
    toggleStatus() {
        this.#isAvailable = !this.#isAvailable;
    }
    displayInfo() {
        return `Author: ${this.#author} | Category: ${this.#category}`;
    }
}
class ReferenceBook extends Book {
    #locationCode;
    constructor(title, author, category, locationCode) {
        super(title, author, category);
        this.#locationCode = locationCode;
    }
    displayInfo() {
        return `${super.displayInfo()} |  Location: ${this.#locationCode}`;
    }
}
// Library Management Class
class Library {
    #books = [];
    addBook(book) {
        this.#books.push(book);
    }
    removeBook(title) {
        this.#books = this.#books.filter(b => b.title !== title);
    }
    get allBooks() { return this.#books; }
    searchBooks(query) {
        return this.#books.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) ||
            b.author.toLowerCase().includes(query.toLowerCase()));
    }
    filterByCategory(category) {
        if (category === "all")
            return this.#books;
        return this.#books.filter(b => b.category === category);
    }
}
const modal = document.getElementById('bookModal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');
const saveBtn = document.getElementById('saveBookBtn');
openBtn.onclick = () => {
    modal.style.display = "flex";
};
closeBtn.onclick = () => {
    modal.style.display = "none";
};
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
saveBtn.onclick = () => {
    const title = document.getElementById('newTitle').value;
    const author = document.getElementById('newAuthor').value;
    const category = document.getElementById('newCategory').value;
    const location = document.getElementById('newLocation').value;
    if (!title || !author) {
        alert("Please provide the royal details (Title & Author)!");
        return;
    }
    let book;
    if (location.trim()) {
        book = new ReferenceBook(title, author, category, location);
    }
    else {
        book = new Book(title, author, category);
    }
    myLibrary.addBook(book);
    render(myLibrary.allBooks);
    modal.style.display = "none";
    document.getElementById('newTitle').value = "";
    document.getElementById('newAuthor').value = "";
    document.getElementById('newLocation').value = "";
};
const myLibrary = new Library();
// Adding  Data
myLibrary.addBook(new Book("The Great Gatsby", "F. Scott Fitzgerald", "Fiction"));
myLibrary.addBook(new Book("A Brief History of Time", "Stephen Hawking", "Science"));
myLibrary.addBook(new ReferenceBook("Oxford Dictionary", "Oxford", "Reference", "Shelf-R1"));
const grid = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
function render(books) {
    const total = books.length;
    const available = books.filter(b => b.isAvailable).length;
    const statsBar = document.getElementById('statsBar');
    statsBar.innerHTML = `
        <span>Total: <b>${total}</b></span> | 
        <span>Available: <b style="color: green">${available}</b></span> | 
        <span>Borrowed: <b style="color: red">${total - available}</b></span>
    `;
    grid.innerHTML = "";
    books.forEach((book) => {
        const card = document.createElement('div');
        card.className = `book-card ${!book.isAvailable ? 'unavailable' : ''}`;
        card.innerHTML = `
            <span class="status-badge ${book.isAvailable ? 'available' : 'not-available'}">
                ${book.isAvailable ? 'Available' : 'Borrowed'}
            </span>
            <h3>${book.title}</h3>
            <p>${book.displayInfo()}</p>
            <button onclick="handleToggle('${book.title}')">Change Status</button>
        `;
        grid.appendChild(card);
    });
}
window.handleToggle = (title) => {
    const book = myLibrary.allBooks.find(b => b.title === title);
    if (book) {
        book.toggleStatus();
        render(myLibrary.allBooks);
    }
};
searchInput.addEventListener('input', () => {
    const results = myLibrary.searchBooks(searchInput.value);
    render(results);
});
categoryFilter.addEventListener('change', () => {
    const results = myLibrary.filterByCategory(categoryFilter.value);
    render(results);
});
render(myLibrary.allBooks);

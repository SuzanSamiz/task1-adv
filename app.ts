
class Book {
    #title: string;
    #author: string;
    #category: string;
    #isAvailable: boolean;

    constructor(title: string, author: string, category: string) {
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

    displayInfo(): string {
        return `Author: ${this.#author} | Category: ${this.#category}`;
    }
}

class ReferenceBook extends Book {
    #locationCode: string;

    constructor(title: string, author: string, category: string, locationCode: string) {
        super(title, author, category);
        this.#locationCode = locationCode;
    }

    override displayInfo(): string {
        return `${super.displayInfo()} |  Location: ${this.#locationCode}`;
    }
}

// Library Management Class
class Library {
    #books: Book[] = [];

    addBook(book: Book) {
        this.#books.push(book);
    }

    removeBook(title: string) {
        this.#books = this.#books.filter(b => b.title !== title);
    }

    get allBooks() { return this.#books; }

    searchBooks(query: string): Book[] {
        return this.#books.filter(b => 
            b.title.toLowerCase().includes(query.toLowerCase()) || 
            b.author.toLowerCase().includes(query.toLowerCase())
        );
    }

    filterByCategory(category: string): Book[] {
        if (category === "all") return this.#books;
        return this.#books.filter(b => b.category === category);
    }
}

const modal = document.getElementById('bookModal') as HTMLDivElement;
const openBtn = document.getElementById('openModalBtn') as HTMLButtonElement;
const closeBtn = document.querySelector('.close-btn') as HTMLElement;
const saveBtn = document.getElementById('saveBookBtn') as HTMLButtonElement;

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
    const title = (document.getElementById('newTitle') as HTMLInputElement).value;
    const author = (document.getElementById('newAuthor') as HTMLInputElement).value;
    const category = (document.getElementById('newCategory') as HTMLSelectElement).value;
    const location = (document.getElementById('newLocation') as HTMLInputElement).value;

    if (!title || !author) {
        alert("Please provide the royal details (Title & Author)!");
        return;
    }

    let book: Book;
    if (location.trim()) {
        book = new ReferenceBook(title, author, category, location);
    } else {
        book = new Book(title, author, category);
    }

    myLibrary.addBook(book);
    render(myLibrary.allBooks);
    
    modal.style.display = "none";
    (document.getElementById('newTitle') as HTMLInputElement).value = "";
    (document.getElementById('newAuthor') as HTMLInputElement).value = "";
    (document.getElementById('newLocation') as HTMLInputElement).value = "";
};

const myLibrary = new Library();

// Adding  Data
myLibrary.addBook(new Book("The Great Gatsby", "F. Scott Fitzgerald", "Fiction"));
myLibrary.addBook(new Book("A Brief History of Time", "Stephen Hawking", "Science"));
myLibrary.addBook(new ReferenceBook("Oxford Dictionary", "Oxford", "Reference", "Shelf-R1"));

const grid = document.getElementById('bookGrid') as HTMLDivElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;

function render(books: Book[]) {
    const total = books.length;
    const available = books.filter(b => b.isAvailable).length;

    const statsBar = document.getElementById('statsBar') as HTMLElement;
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

(window as any).handleToggle = (title: string) => {
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



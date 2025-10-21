const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];
let editingBookId = null; 

// mengecek localStorage
function isStorageExist() {
  return typeof Storage !== "undefined";
}

// menyimpan data ke localStorage
function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

// mengambil data dari localStorage
function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  }
  renderBooks();
}

// generate ID unik
function generateId() {
  return +new Date();
}

// membuuat objek buku
function createBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year: Number(year), isComplete };
}

// merender buku ke rak
function renderBooks(filter = "") {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  for (const book of books) {
    if (filter && !book.title.toLowerCase().includes(filter.toLowerCase())) {
      continue;
    }

    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Tombol pindah rak
    bookElement
      .querySelector("[data-testid='bookItemIsCompleteButton']")
      .addEventListener("click", () => toggleBookStatus(book.id));

    // Tombol hapus
    bookElement
      .querySelector("[data-testid='bookItemDeleteButton']")
      .addEventListener("click", () => deleteBook(book.id));

    // Tombol edit
    bookElement
      .querySelector("[data-testid='bookItemEditButton']")
      .addEventListener("click", () => editBook(book.id));

    if (book.isComplete) {
      completeList.appendChild(bookElement);
    } else {
      incompleteList.appendChild(bookElement);
    }
  }
}

// menambah buku
document.getElementById("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const id = generateId();
  const newBook = createBookObject(id, title, author, year, isComplete);

  books.push(newBook);
  saveData();
  renderBooks();

  e.target.reset();
});

// pindah rak
function toggleBookStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

// menghapus buku
function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveData();
  renderBooks();
}

// edit buku
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  deleteBook(bookId);
}

// mencari buku
document.getElementById("searchBook").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchBookTitle").value.trim();
  renderBooks(query);
});

// pencarian realtime saat mengetik
document.getElementById("searchBookTitle").addEventListener("input", (e) => {
  const query = e.target.value.trim();
  renderBooks(query);
});

// pertama kali load
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

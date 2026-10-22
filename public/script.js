
const bookList = document.getElementById("book-list");
const bookStatus = document.getElementById("book-status");
const searchInput = document.getElementById("search");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");

let books = [];
const cart = new Map();

const bookIcons = {
  "Self-Help": "🌱",
  Fiction: "📖",
  Technology: "💻",
  Biography: "🌟"
};

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

function renderBooks(query = "") {
  const term = query.trim().toLowerCase();

  const filteredBooks = books.filter(book =>
    `${book.title} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(term)
  );

  bookList.replaceChildren();

  if (filteredBooks.length === 0) {
    bookStatus.textContent = "No books found. Try another search.";
    return;
  }

  bookStatus.textContent = `${filteredBooks.length} book(s) available`;

  filteredBooks.forEach(book => {
    const card = document.createElement("article");
    card.className = "book-card";

    const icon = document.createElement("div");
    icon.className = "book-icon";
    icon.textContent = bookIcons[book.category] || "📚";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "author";
    author.textContent = `By ${book.author}`;

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = book.category;

    const bottom = document.createElement("div");
    bottom.className = "book-bottom";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = formatPrice(book.price);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-button";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(book.id));

    bottom.append(price, addButton);
    card.append(icon, title, author, category, bottom);
    bookList.append(card);
  });
}

function addToCart(bookId) {
  const quantity = cart.get(bookId) || 0;
  cart.set(bookId, quantity + 1);
  renderCart();
}

function changeQuantity(bookId, change) {
  const quantity = (cart.get(bookId) || 0) + change;

  if (quantity <= 0) {
    cart.delete(bookId);
  } else {
    cart.set(bookId, quantity);
  }

  renderCart();
}

function renderCart() {
  cartItems.replaceChildren();

  let itemCount = 0;
  let total = 0;

  cart.forEach((quantity, bookId) => {
    const book = books.find(item => item.id === bookId);
    if (!book) return;

    itemCount += quantity;
    total += book.price * quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = book.title;

    const price = document.createElement("small");
    price.textContent = `${formatPrice(book.price)} each`;

    details.append(title, price);

    const controls = document.createElement("div");
    controls.className = "cart-quantity";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "quantity-button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Remove one ${book.title}`);
    minus.addEventListener("click", () => changeQuantity(bookId, -1));

    const quantityText = document.createElement("span");
    quantityText.textContent = quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "quantity-button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Add one ${book.title}`);
    plus.addEventListener("click", () => changeQuantity(bookId, 1));

    controls.append(minus, quantityText, plus);
    row.append(details, controls);
    cartItems.append(row);
  });

  if (cart.size === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your cart is empty. Add a book to get started!";
    cartItems.append(emptyMessage);
  }

  cartCount.textContent = itemCount;
  cartTotal.textContent = formatPrice(total);
}

searchInput.addEventListener("input", event => {
  renderBooks(event.target.value);
});

clearCartButton.addEventListener("click", () => {
  cart.clear();
  renderCart();
});

async function loadBooks() {
  try {
    bookStatus.textContent = "Loading books...";

    const response = await fetch("/api/books");

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    books = await response.json();
    renderBooks(searchInput.value);
    renderCart();
  } catch (error) {
    console.error("Unable to load books:", error);
    bookStatus.textContent =
      "Unable to load books. Please check that the server is running and refresh.";
  }
}

loadBooks();

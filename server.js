
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const books = [
  { id: 1, title: "Atomic Habits", author: "James Clear", price: 450, category: "Self-Help" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", price: 650, category: "Technology" },
  { id: 4, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 300, category: "Biography" },
  { id: 5, title: "Ikigai", author: "Hector Garcia", price: 400, category: "Self-Help" },
  { id: 6, title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 700, category: "Technology" }
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", application: "online-book-store" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Online Book Store running on port ${PORT}`);
});

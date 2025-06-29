// Constants for localStorage keys
const STORAGE_KEY_QUOTES = 'quotesData';
const STORAGE_KEY_FILTER = 'lastSelectedCategory';

// Default quote list
const defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don’t take.", category: "Inspiration" }
];

let quotes = [];
let quoteDisplay, newQuoteBtn, addQuoteBtn, newQuoteText, newQuoteCategory, categoryFilter;

// Load quotes from localStorage or default
function loadQuotes() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY_QUOTES);
  quotes = storedQuotes ? JSON.parse(storedQuotes) : defaultQuotes.slice(); // deep copy default
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
}

// Populate categories dynamically from quotes
function populateCategories() {
  const categories = new Set();
  quotes.forEach(q => categories.add(q.category));

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem(STORAGE_KEY_FILTER);
  if (lastFilter && categoryFilter.querySelector(`option[value="${lastFilter}"]`)) {
    categoryFilter.value = lastFilter;
  }
}

// Display a random quote from current filter
function displayRandomQuote() {
  filterQuotes(); // display is handled in filtering
}

// Filter quotes by selected category and update DOM
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(STORAGE_KEY_FILTER, selectedCategory); // save selection

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
  }
}

// Add a new quote and update UI and storage
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  populateCategories(); // update dropdown
  categoryFilter.value = "all";
  localStorage.setItem(STORAGE_KEY_FILTER, "all");
  displayRandomQuote();
}

// Initialize app
window.onload = function () {
  // Link DOM elements
  quoteDisplay = document.getElementById("quoteDisplay");
  newQuoteBtn = document.getElementById("newQuote");
  addQuoteBtn = document.getElementById("addQuoteBtn");
  newQuoteText = document.getElementById("newQuoteText");
  newQuoteCategory = document.getElementById("newQuoteCategory");
  categoryFilter = document.getElementById("categoryFilter");

  loadQuotes();
  populateCategories();
  displayRandomQuote();

  // Event listeners
  newQuoteBtn.addEventListener("click", displayRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
};

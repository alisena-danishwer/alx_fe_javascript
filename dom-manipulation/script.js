const STORAGE_KEY_QUOTES = 'quotesData';
const STORAGE_KEY_FILTER = 'lastSelectedCategory';
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your actual API
const SYNC_INTERVAL = 30000; // 30 seconds

let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don’t take.", category: "Inspiration" }
];

let quoteDisplay, newQuoteBtn, addQuoteBtn, newQuoteText, newQuoteCategory, categoryFilter, conflictNotification;

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  const lastCategory = localStorage.getItem(STORAGE_KEY_FILTER);
  if (lastCategory) {
    categoryFilter.value = lastCategory;
  }
}

function filterQuote() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(STORAGE_KEY_FILTER, selectedCategory);

  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes found.";
  } else {
    const random = Math.floor(Math.random() * filtered.length);
    quoteDisplay.textContent = `"${filtered[random].text}" — (${filtered[random].category})`;
  }
}

function displayRandomQuote() {
  filterQuote();
}

function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  if (!text || !category) {
    alert("Both fields are required!");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));

  populateCategories();
  categoryFilter.value = "all";
  localStorage.setItem(STORAGE_KEY_FILTER, "all");
  filterQuote();
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// 🔁 Fetch and sync from mock API
async function syncWithServer() {
  try {
    const response = await fetch(MOCK_API_URL);
    const serverData = await response.json();

    // Simulated transformation (replace this with actual structure if using real server)
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));

    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY_QUOTES)) || [];

    // If mismatch in number, simulate conflict (basic example)
    const hasConflict = serverQuotes.length !== localData.length;

    if (hasConflict) {
      quotes = serverQuotes;
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(serverQuotes));
      showConflictNotification();
      populateCategories();
      filterQuote();
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

function showConflictNotification() {
  conflictNotification.style.display = "block";
  setTimeout(() => conflictNotification.style.display = "none", 5000);
}

// 🧠 Page load
window.onload = function () {
  const storedQuotes = localStorage.getItem(STORAGE_KEY_QUOTES);
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }

  quoteDisplay = document.getElementById("quoteDisplay");
  newQuoteBtn = document.getElementById("newQuote");
  addQuoteBtn = document.getElementById("addQuoteBtn");
  newQuoteText = document.getElementById("newQuoteText");
  newQuoteCategory = document.getElementById("newQuoteCategory");
  categoryFilter = document.getElementById("categoryFilter");
  conflictNotification = document.getElementById("conflictNotification");

  populateCategories();
  filterQuote();

  newQuoteBtn.addEventListener("click", displayRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);

  // 🔁 Set sync interval
  setInterval(syncWithServer, SYNC_INTERVAL);
};

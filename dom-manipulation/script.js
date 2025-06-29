const STORAGE_KEY_QUOTES = 'quotesData';
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts';
const SYNC_INTERVAL = 30000;

let quotes = [];

function fetchQuotesFromServer() {
  return fetch(MOCK_API_URL)
    .then(response => response.json())
    .then(data => data.slice(0, 5).map(item => ({
      text: item.title,
      category: 'Server'
    })));
}

function postQuoteToServer(quote) {
  return fetch(MOCK_API_URL, {
    method: 'POST',
    body: JSON.stringify(quote),
    headers: { 'Content-type': 'application/json; charset=UTF-8' }
  });
}

function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    const localQuotes = JSON.parse(localStorage.getItem(STORAGE_KEY_QUOTES)) || [];
    const conflict = JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes);

    if (conflict) {
      quotes = serverQuotes;
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
      showConflictNotification();
      populateCategories();
      filterQuote();
    }
  });
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  const savedCategory = localStorage.getItem("lastSelectedCategory");
  if (savedCategory) select.value = savedCategory;
}

function filterQuote() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selected);

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
  } else {
    const random = Math.floor(Math.random() * filtered.length);
    quoteDisplay.textContent = `"${filtered[random].text}" (${filtered[random].category})`;
  }
}

function displayRandomQuote() {
  filterQuote();
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) return;

  const newQuote = { text, category };
  quotes.push(newQuote);
  localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
  postQuoteToServer(newQuote);

  populateCategories();
  filterQuote();

  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';
}

function showConflictNotification() {
  const box = document.getElementById("conflictNotification");
  box.style.display = "block";
  setTimeout(() => box.style.display = "none", 4000);
}

window.onload = function () {
  const saved = localStorage.getItem(STORAGE_KEY_QUOTES);
  quotes = saved ? JSON.parse(saved) : [];

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

  populateCategories();
  filterQuote();
  syncQuotes();
  setInterval(syncQuotes, SYNC_INTERVAL);
};

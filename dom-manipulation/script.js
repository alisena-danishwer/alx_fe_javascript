const STORAGE_KEY_QUOTES = 'quotesData';
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts';
const SYNC_INTERVAL = 30000;

let quotes = [];

function fetchQuotesFromServer() {
  return fetch(MOCK_API_URL)
    .then(res => res.json())
    .then(data => {
      return data.slice(0, 5).map(item => ({
        text: item.title,
        category: 'Server'
      }));
    });
}

function postQuoteToServer(quote) {
  return fetch(MOCK_API_URL, {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { 'Content-type': 'application/json; charset=UTF-8' }
  });
}

function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    const storedQuotes = JSON.parse(localStorage.getItem(STORAGE_KEY_QUOTES)) || [];
    const hasConflict = storedQuotes.length !== serverQuotes.length;

    if (hasConflict) {
      quotes = serverQuotes;
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
      showConflictNotification();
      populateCategories();
      filterQuote();
    }
  });
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const last = localStorage.getItem("lastSelectedCategory");
  if (last) categoryFilter.value = last;
}

function filterQuote() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", category);
  const display = document.getElementById("quoteDisplay");

  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) {
    display.textContent = "No quotes available.";
  } else {
    const random = Math.floor(Math.random() * filtered.length);
    display.textContent = `"${filtered[random].text}" (${filtered[random].category})`;
  }
}

function displayRandomQuote() {
  filterQuote();
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please fill both fields");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
  postQuoteToServer(newQuote);

  populateCategories();
  filterQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function showConflictNotification() {
  const note = document.getElementById("conflictNotification");
  if (note) {
    note.style.display = "block";
    setTimeout(() => {
      note.style.display = "none";
    }, 4000);
  }
}

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_QUOTES));
  if (saved) quotes = saved;

  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

  populateCategories();
  filterQuote();
  syncQuotes();
  setInterval(syncQuotes, SYNC_INTERVAL);
};

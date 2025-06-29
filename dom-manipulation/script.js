// ✅ Global quotes array
var quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don’t take.", category: "Inspiration" }
];

// ✅ Declare DOM elements globally
var quoteDisplay;
var newQuoteBtn;
var addQuoteBtn;
var newQuoteText;
var newQuoteCategory;

// ✅ Define displayRandomQuote in global scope
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  var randomIndex = Math.floor(Math.random() * quotes.length);
  var quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
}

// ✅ Define addQuote in global scope
function addQuote() {
  var text = newQuoteText.value.trim();
  var category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  var newQuote = { text: text, category: category };
  quotes.push(newQuote);

  // Immediately display the new quote
  quoteDisplay.textContent = `"${text}" — (${category})`;

  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// ✅ Use window.onload to ensure elements are ready before assigning event listeners
window.onload = function () {
  quoteDisplay = document.getElementById("quoteDisplay");
  newQuoteBtn = document.getElementById("newQuote");
  addQuoteBtn = document.getElementById("addQuoteBtn");
  newQuoteText = document.getElementById("newQuoteText");
  newQuoteCategory = document.getElementById("newQuoteCategory");

  // ✅ Attach required event listeners
  newQuoteBtn.addEventListener("click", displayRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
};

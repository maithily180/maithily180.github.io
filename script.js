// Click and view tracking
document.addEventListener("click", (e) => {
  console.log(`${new Date().toISOString()}, click, ${e.target.tagName.toLowerCase()}`);
});

window.addEventListener("load", () => {
  document.querySelectorAll("*").forEach((el) => {
    console.log(`${new Date().toISOString()}, view, ${el.tagName.toLowerCase()}`);
  });
});

// Text analysis
function analyzeText() {
  const text = document.getElementById("inputText").value;
  const results = document.getElementById("analysisResults");

  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  const wordCount = (text.match(/\b\w+\b/g) || []).length;
  const spaceCount = (text.match(/ /g) || []).length;
  const newlineCount = (text.match(/\n/g) || []).length;
  const specialCharCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;

  const pronouns = ["he", "she", "they", "we", "i", "you", "him", "her", "us", "them"];
  const prepositions = ["in", "on", "at", "by", "with", "about", "against", "between", "into", "through", "during"];
  const articles = ["a", "an", "the"];

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const countItems = (items) =>
    items.reduce((acc, item) => {
      acc[item] = words.filter((w) => w === item).length;
      return acc;
    }, {});

  results.innerHTML = `
    <p><strong>Letters:</strong> ${letterCount}</p>
    <p><strong>Words:</strong> ${wordCount}</p>
    <p><strong>Spaces:</strong> ${spaceCount}</p>
    <p><strong>Newlines:</strong> ${newlineCount}</p>
    <p><strong>Special Characters:</strong> ${specialCharCount}</p>
    <p><strong>Pronouns:</strong> ${JSON.stringify(countItems(pronouns))}</p>
    <p><strong>Prepositions:</strong> ${JSON.stringify(countItems(prepositions))}</p>
    <p><strong>Articles:</strong> ${JSON.stringify(countItems(articles))}</p>
  `;
}

// Q2: Click and View Tracker
document.addEventListener("DOMContentLoaded", () => {
  const allElements = document.querySelectorAll("*");

  allElements.forEach((el) => {
    const type = el.tagName.toLowerCase();
    console.log(`${new Date().toISOString()}, view, ${type}`);
    el.addEventListener("click", () => {
      console.log(`${new Date().toISOString()}, click, ${type}`);
    });
  });
});

// Q3: Text Analyzer
function analyzeText() {
  const text = document.getElementById("inputText").value;
  const resultsDiv = document.getElementById("results");

  const letters = text.match(/[a-zA-Z]/g)?.length || 0;
  const words = text.match(/\\b\\w+\\b/g)?.length || 0;
  const spaces = text.match(/ /g)?.length || 0;
  const newlines = text.match(/\\n/g)?.length || 0;
  const specials = text.match(/[^\\w\\s\\n]/g)?.length || 0;

  const tokens = text.toLowerCase().split(/\\s+/);
  const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they'];
  const prepositions = ['on', 'in', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into'];
  const articles = ['a', 'an'];

  const countGroup = (list) => {
    const counts = {};
    for (const token of tokens) {
      if (list.includes(token)) {
        counts[token] = (counts[token] || 0) + 1;
      }
    }
    return counts;
  };

  const pronounCount = countGroup(pronouns);
  const prepositionCount = countGroup(prepositions);
  const articleCount = countGroup(articles);

  resultsDiv.innerHTML = `
    <strong>Text Statistics:</strong><br/>
    Letters: ${letters}<br/>
    Words: ${words}<br/>
    Spaces: ${spaces}<br/>
    Newlines: ${newlines}<br/>
    Special Symbols: ${specials}<br/><br/>

    <strong>Pronoun Count:</strong><br/>${JSON.stringify(pronounCount)}<br/><br/>
    <strong>Preposition Count:</strong><br/>${JSON.stringify(prepositionCount)}<br/><br/>
    <strong>Article Count:</strong><br/>${JSON.stringify(articleCount)}<br/>
  `;
}

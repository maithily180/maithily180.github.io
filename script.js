// Track clicks and views
document.addEventListener("click", function(e) {
    console.log(`${new Date().toISOString()}, click, ${e.target.tagName}`);
  });
  
  window.addEventListener("load", function () {
    console.log(`${new Date().toISOString()}, view, Page Loaded`);
  });
  
  // Text Analysis Function
  function analyzeText() {
    const text = document.getElementById("textInput").value;
  
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const words = (text.match(/\b\w+\b/g) || []).length;
    const spaces = (text.match(/ /g) || []).length;
    const newlines = (text.match(/\n/g) || []).length;
    const specialSymbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  
    const pronouns = ['he', 'she', 'it', 'they', 'we', 'i', 'you', 'him', 'her', 'us', 'them'];
    const prepositions = ['in', 'on', 'at', 'by', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below'];
    const articles = ['a', 'an', 'the'];
  
    const tokens = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    let pronounCount = {}, prepCount = {}, articleCount = {};
  
    tokens.forEach(word => {
      if (pronouns.includes(word)) pronounCount[word] = (pronounCount[word] || 0) + 1;
      if (prepositions.includes(word)) prepCount[word] = (prepCount[word] || 0) + 1;
      if (articles.includes(word)) articleCount[word] = (articleCount[word] || 0) + 1;
    });
  
    document.getElementById("result").textContent = `
  Letters: ${letters}
  Words: ${words}
  Spaces: ${spaces}
  Newlines: ${newlines}
  Special Symbols: ${specialSymbols}
  
  Pronouns: ${JSON.stringify(pronounCount, null, 2)}
  Prepositions: ${JSON.stringify(prepCount, null, 2)}
  Articles: ${JSON.stringify(articleCount, null, 2)}
    `;
  }
  
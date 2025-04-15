// Tab functionality
function openTab(tabId) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab and set its button as active
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`button[onclick="openTab('${tabId}')"]`).classList.add('active');
    
    // Record page view event for analytics
    logEvent('view', `${tabId} tab`);
}

// Q2: Event tracking functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event logger
    initEventLogger();
    
    // Record initial page view
    logEvent('view', 'page load');
    
    // Initialize text analyzer
    initTextAnalyzer();
});

// Event tracking setup
function initEventLogger() {
    // Capturing clicks on all elements
    document.addEventListener('click', function(event) {
        // Get the element that was clicked
        const element = event.target;
        // Create a description of the element
        let objectType = getElementType(element);
        
        // Log the event
        logEvent('click', objectType);
    });
    
    // Add specific listeners for demo elements in the Event Tracker tab
    document.getElementById('demo-button').addEventListener('click', () => {});
    document.getElementById('demo-dropdown').addEventListener('change', () => {
        logEvent('interaction', 'dropdown selection');
    });
    document.getElementById('demo-image').addEventListener('click', () => {});
    document.getElementById('demo-text').addEventListener('click', () => {});
}

// Helper function to determine element type
function getElementType(element) {
    // Check for ID
    if (element.id) {
        return `${element.tagName.toLowerCase()} #${element.id}`;
    }
    
    // Check for specific elements
    if (element.tagName === 'BUTTON') {
        return `button containing "${element.innerText.trim()}"`;
    }
    
    if (element.tagName === 'A') {
        return `link to "${element.href}" containing "${element.innerText.trim()}"`;
    }
    
    if (element.tagName === 'IMG') {
        return `image with alt "${element.alt || 'no alt text'}"`;
    }
    
    if (element.tagName === 'SELECT') {
        return 'dropdown menu';
    }
    
    // For other elements, try to give useful info
    if (element.innerText && element.innerText.trim().length > 0) {
        const text = element.innerText.trim();
        const shortText = text.length > 20 ? text.substring(0, 20) + '...' : text;
        return `${element.tagName.toLowerCase()} containing "${shortText}"`;
    }
    
    return element.tagName.toLowerCase();
}

// Function to log events to console and display
function logEvent(eventType, objectDescription) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} , ${eventType} , ${objectDescription}`;
    
    // Log to console
    console.log(logMessage);
    
    // Add to display if the element exists
    const logDisplay = document.getElementById('event-log-display');
    if (logDisplay) {
        const logEntry = document.createElement('div');
        logEntry.textContent = logMessage;
        logDisplay.appendChild(logEntry);
        
        // Auto-scroll to bottom
        logDisplay.scrollTop = logDisplay.scrollHeight;
    }
}

// Q3: Text analyzer functionality
function initTextAnalyzer() {
    const analyzeButton = document.getElementById('analyze-button');
    if (analyzeButton) {
        analyzeButton.addEventListener('click', analyzeText);
    }
}

function analyzeText() {
    const textInput = document.getElementById('text-input').value;
    
    if (textInput.trim().length === 0) {
        alert('Please enter text to analyze.');
        return;
    }
    
    // Check if text has at least 10000 words
    const wordCount = textInput.trim().split(/\s+/).length;
    if (wordCount < 10000) {
        alert(`Text should contain at least 10,000 words. Current word count: ${wordCount}`);
        return;
    }
    
    // Basic statistics
    const stats = calculateBasicStats(textInput);
    displayBasicStats(stats);
    
    // Pronouns count
    const pronounsCounts = countPronouns(textInput);
    displayPronounsCounts(pronounsCounts);
    
    // Prepositions count
    const prepositionsCounts = countPrepositions(textInput);
    displayPrepositionsCounts(prepositionsCounts);
    
    // Indefinite articles count
    const articlesCounts = countIndefiniteArticles(textInput);
    displayArticlesCounts(articlesCounts);
    
    // Log the analysis event
    logEvent('analysis', 'text analysis performed');
}

function calculateBasicStats(text) {
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    const wordCount = text.trim().split(/\s+/).length;
    const spaceCount = (text.match(/\s/g) || []).length;
    const newlineCount = (text.match(/\n/g) || []).length;
    const specialCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    
    return {
        letters: letterCount,
        words: wordCount,
        spaces: spaceCount,
        newlines: newlineCount,
        specialSymbols: specialCount
    };
}

function displayBasicStats(stats) {
    const basicStatsElement = document.getElementById('basic-stats');
    basicStatsElement.innerHTML = `
        <p><strong>Letters:</strong> ${stats.letters}</p>
        <p><strong>Words:</strong> ${stats.words}</p>
        <p><strong>Spaces:</strong> ${stats.spaces}</p>
        <p><strong>Newlines:</strong> ${stats.newlines}</p>
        <p><strong>Special Symbols:</strong> ${stats.specialSymbols}</p>
    `;
}

function countPronouns(text) {
    // List of common pronouns
    const pronounsList = [
        'i', 'me', 'my', 'mine', 'myself',
        'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself',
        'she', 'her', 'hers', 'herself',
        'it', 'its', 'itself',
        'we', 'us', 'our', 'ours', 'ourselves',
        'they', 'them', 'their', 'theirs', 'themselves',
        'who', 'whom', 'whose', 'this', 'that', 'these', 'those'
    ];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const counts = {};
    
    pronounsList.forEach(pronoun => {
        counts[pronoun] = 0;
    });
    
    words.forEach(word => {
        if (pronounsList.includes(word)) {
            counts[word]++;
        }
    });
    
    // Filter out pronouns with zero count
    return Object.fromEntries(
        Object.entries(counts).filter(([_, count]) => count > 0)
    );
}

function displayPronounsCounts(counts) {
    const pronounsStatsElement = document.getElementById('pronouns-stats');
    
    if (Object.keys(counts).length === 0) {
        pronounsStatsElement.innerHTML = '<p>No pronouns found in the text.</p>';
        return;
    }
    
    let html = '<ul>';
    for (const [pronoun, count] of Object.entries(counts)) {
        html += `<li><strong>${pronoun}:</strong> ${count}</li>`;
    }
    html += '</ul>';
    
    pronounsStatsElement.innerHTML = html;
}

function countPrepositions(text) {
    // List of common prepositions
    const prepositionsList = [
        'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
        'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
        'beyond', 'by', 'down', 'during', 'except', 'for', 'from', 'in', 'inside',
        'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over',
        'past', 'through', 'throughout', 'to', 'toward', 'under', 'underneath',
        'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
    ];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const counts = {};
    
    prepositionsList.forEach(preposition => {
        counts[preposition] = 0;
    });
    
    words.forEach(word => {
        if (prepositionsList.includes(word)) {
            counts[word]++;
        }
    });
    
    // Filter out prepositions with zero count
    return Object.fromEntries(
        Object.entries(counts).filter(([_, count]) => count > 0)
    );
}

function displayPrepositionsCounts(counts) {
    const prepositionsStatsElement = document.getElementById('prepositions-stats');
    
    if (Object.keys(counts).length === 0) {
        prepositionsStatsElement.innerHTML = '<p>No prepositions found in the text.</p>';
        return;
    }
    
    let html = '<ul>';
    for (const [preposition, count] of Object.entries(counts)) {
        html += `<li><strong>${preposition}:</strong> ${count}</li>`;
    }
    html += '</ul>';
    
    prepositionsStatsElement.innerHTML = html;
}

function countIndefiniteArticles(text) {
    // Indefinite articles
    const articlesList = ['a', 'an'];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const counts = {};
    
    articlesList.forEach(article => {
        counts[article] = 0;
    });
    
    words.forEach(word => {
        if (articlesList.includes(word)) {
            counts[word]++;
        }
    });
    
    return counts;
}

function displayArticlesCounts(counts) {
    const articlesStatsElement = document.getElementById('articles-stats');
    
    let html = '<ul>';
    for (const [article, count] of Object.entries(counts)) {
        html += `<li><strong>${article}:</strong> ${count}</li>`;
    }
    html += '</ul>';
    
    articlesStatsElement.innerHTML = html;
}

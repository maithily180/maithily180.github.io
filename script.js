// Global event tracking for Q2
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event tracking
    initEventTracking();
    
    // Log initial page view
    logEvent('view', 'page load');
    
    // Initialize text analyzer
    initTextAnalyzer();
});

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
    
    // Record page view event
    logEvent('view', `${tabId} tab`);
}

// Q2: Event tracking functionality for the entire website
function initEventTracking() {
    // Track all click events
    document.addEventListener('click', function(event) {
        const element = event.target;
        const objectType = getElementDescription(element);
        logEvent('click', objectType);
    });
    
    // Track all view events for important elements
    trackElementViews();
    
    // Track specific interactions
    document.addEventListener('change', function(event) {
        if (event.target.tagName === 'SELECT') {
            logEvent('interaction', `dropdown selection: ${event.target.value}`);
        }
    });
    
    // Track form inputs
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('focus', function() {
            logEvent('interaction', `focused on ${input.tagName.toLowerCase()}`);
        });
    });
    
    // Track CV download
    const cvLink = document.querySelector('.cv-button');
    if (cvLink) {
        cvLink.addEventListener('click', function() {
            logEvent('download', 'CV PDF');
        });
    }
}

// Function to get detailed description of elements
function getElementDescription(element) {
    // Elements with IDs
    if (element.id) {
        return `${element.tagName.toLowerCase()} #${element.id}`;
    }
    
    // Process by element type
    switch (element.tagName) {
        case 'BUTTON':
            return `button "${element.textContent.trim()}"`;
            
        case 'A':
            const linkText = element.textContent.trim();
            const href = element.getAttribute('href');
            return `link "${linkText}" (${href})`;
            
        case 'IMG':
            const alt = element.getAttribute('alt') || 'no alt text';
            const src = element.getAttribute('src');
            return `image "${alt}" (${src})`;
            
        case 'SELECT':
            return 'dropdown menu';
            
        case 'INPUT':
            const type = element.getAttribute('type') || 'text';
            return `input field (${type})`;
            
        case 'TEXTAREA':
            return 'text area';
            
        case 'LI':
            return `list item "${element.textContent.trim().substring(0, 20)}${element.textContent.trim().length > 20 ? '...' : ''}"`;
            
        default:
            // For other elements with text content
            if (element.textContent && element.textContent.trim().length > 0) {
                const text = element.textContent.trim();
                const shortText = text.length > 20 ? text.substring(0, 20) + '...' : text;
                return `${element.tagName.toLowerCase()} "${shortText}"`;
            }
            
            // Default case
            return element.tagName.toLowerCase();
    }
}

// Track views of important elements using Intersection Observer
function trackElementViews() {
    // Elements to track views for
    const elementsToTrack = [
        '.profile-section',
        '.hometown-section',
        '.education-section',
        '.achievements-section',
        '.skills-section',
        '.cv-section',
        '.profile-image img',
        '.hometown-images img'
    ];
    
    // Set up the intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is now visible
                let elementDesc = '';
                
                // Get appropriate description based on element type
                if (entry.target.tagName === 'IMG') {
                    elementDesc = `image "${entry.target.alt || 'no alt text'}"`;
                } else if (entry.target.classList.contains('profile-section')) {
                    elementDesc = 'profile section';
                } else if (entry.target.classList.contains('hometown-section')) {
                    elementDesc = 'hometown section';
                } else if (entry.target.classList.contains('education-section')) {
                    elementDesc = 'education section';
                } else if (entry.target.classList.contains('achievements-section')) {
                    elementDesc = 'achievements section';
                } else if (entry.target.classList.contains('skills-section')) {
                    elementDesc = 'skills section';
                } else if (entry.target.classList.contains('cv-section')) {
                    elementDesc = 'CV section';
                } else {
                    elementDesc = entry.target.tagName.toLowerCase();
                }
                
                logEvent('view', elementDesc);
                
                // Unobserve the element after the first view
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Element is considered visible when 50% of it is in viewport
    });
    
    // Start observing all target elements
    elementsToTrack.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    });
}

// Function to log events with timestamp to console (Q2)
function logEvent(eventType, objectDescription) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} , ${eventType} , ${objectDescription}`);
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

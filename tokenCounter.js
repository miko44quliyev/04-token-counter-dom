function cleanText(text) {
  return text.trim();
}

function splitIntoWords(text) {
  return text.split(" ");
}

function removeEmptyWords(words) {
  return words.filter(function(word) {
    return word !== "";
  });
}

function estimateTokens(words) {
  return Math.ceil(words.length * 0.75);
}

function countTokens(text) {
  const cleaned = cleanText(text);
  const words = splitIntoWords(cleaned);
  const filtered = removeEmptyWords(words);
  return estimateTokens(filtered);
}

function estimateCost(tokenCount, pricePerMillion) {
  return (tokenCount / 1000000) * pricePerMillion;
}

function characterCount(text) {
  const cleaned = cleanText(text);
  return cleaned.length;
}

function analyzeText(text) {
  const cleaned = cleanText(text);
  const words = splitIntoWords(cleaned);
  const filtered = removeEmptyWords(words);

  return {
    characters: cleaned.length,
    words: filtered.length,
    tokens: estimateTokens(filtered)
  };
}

const textarea = document.querySelector('#inputText');
const statChars = document.querySelector('#stat-chars');
const statWords = document.querySelector('#stat-words');
const statTokens = document.querySelector('#stat-tokens');
const saveBtn = document.querySelector('#save-btn');
const clearBtn = document.querySelector('#clear-btn');
const historyList = document.querySelector('#history-list');
const highestTokenBadge = document.querySelector('#highest-token-badge');
const highestTokenValue = document.querySelector('#highest-token-value');

const history = [];

textarea.addEventListener('input', function () {
  const currentText = textarea.value;
  const analysis = analyzeText(currentText);
  
  statChars.textContent = 'Characters: ' + analysis.characters;
  statWords.textContent = 'Words: ' + analysis.words;
  statTokens.textContent = 'Estimated tokens: ' + analysis.tokens;

  if (currentText.trim() === '') {
    saveBtn.disabled = true;
    saveBtn.style.opacity = '0.5';
    saveBtn.style.cursor = 'not-allowed';
  } else {
    saveBtn.disabled = false;
    saveBtn.style.opacity = '1';
    saveBtn.style.cursor = 'pointer';
  }
});

saveBtn.addEventListener('click', function() {
  if (textarea.value.trim() === '') return;

  const analysis = analyzeText(textarea.value);
  analysis.label = 'Snapshot ' + (history.length + 1);
  history.push(analysis);
  
  renderHistory();
  updateHighestToken();
});

clearBtn.addEventListener('click', function() {
  history.length = 0;
  renderHistory();
  updateHighestToken();
});

function renderHistory() {
  historyList.innerHTML = '';

  history.forEach(function(entry) {
    const li = document.createElement('li');
    li.style.backgroundColor = 'var(--color-surface)';
    li.style.border = '1px solid var(--color-border)';
    li.style.padding = '15px';
    li.style.borderRadius = '8px';
    li.style.fontSize = '0.95rem';
    
    li.textContent = entry.label + ': ' + entry.tokens + ' tokens, ' + entry.words + ' words, ' + entry.characters + ' characters';
    historyList.appendChild(li);
  });
}

function updateHighestToken() {
  if (history.length === 0) {
    highestTokenBadge.style.display = 'none';
    return;
  }
  
  const tokenCounts = history.map(function(e) { 
    return e.tokens; 
  });
  const maxTokens = Math.max(...tokenCounts);
  
  highestTokenValue.textContent = maxTokens;
  highestTokenBadge.style.display = 'block';
}
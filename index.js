// ============================================
// LEFTY PROXY - Complete Server Setup
// ============================================
// This is your main server file (index.js)

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Main route - serves the Lefty interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lefty - Private Web Proxy</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Rubik', sans-serif;
      background-color: #1C1D21;
      color: #CCBCBC;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    /* Top Navigation Bar */
    .top-nav {
      background-color: #252630;
      padding: 10px 20px;
      display: none;
    }
    
    .top-nav.active {
      display: block;
    }
    
    .tabs-container {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
      align-items: center;
    }
    
    .tab {
      background-color: #2A2B35;
      padding: 8px 16px;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      max-width: 180px;
    }
    
    .tab.active {
      background-color: #1C1D21;
      border-bottom: 2px solid #CCBCBC;
    }
    
    .tab:hover {
      opacity: 0.8;
    }
    
    .tab-title {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .tab-close {
      background: none;
      border: none;
      color: #CCBCBC;
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
    }
    
    .tab-close:hover {
      opacity: 0.6;
    }
    
    .new-tab-btn {
      background-color: #2A2B35;
      border: none;
      color: #CCBCBC;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    
    .new-tab-btn:hover {
      opacity: 0.7;
    }
    
    .url-bar-container {
      display: flex;
      align-items: center;
      background-color: #1C1D21;
      padding: 10px 16px;
      border-radius: 50px;
      gap: 12px;
    }
    
    .url-bar {
      flex: 1;
      background: transparent;
      border: none;
      color: #CCBCBC;
      font-size: 14px;
      outline: none;
      font-family: 'Rubik', sans-serif;
    }
    
    .url-bar::placeholder {
      color: #CCBCBC;
      opacity: 0.5;
    }
    
    /* Main Landing Page */
    .landing {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .landing.hidden {
      display: none;
    }
    
    .logo {
      font-size: 60px;
      font-weight: 700;
      margin-bottom: 60px;
      color: #CCBCBC;
    }
    
    .search-container {
      width: 100%;
      max-width: 700px;
    }
    
    .search-box {
      background-color: #252630;
      border-radius: 50px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.3s;
    }
    
    .search-box:hover {
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
    }
    
    .search-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
    
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #CCBCBC;
      font-size: 18px;
      outline: none;
      font-family: 'Rubik', sans-serif;
    }
    
    .search-input::placeholder {
      color: #CCBCBC;
      opacity: 0.6;
    }
    
    .footer-text {
      margin-top: 40px;
      font-size: 14px;
      opacity: 0.6;
    }
    
    /* Proxy View */
    .proxy-view {
      flex: 1;
      display: none;
      background-color: #252630;
    }
    
    .proxy-view.active {
      display: block;
    }
    
    .proxy-frame {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    /* Demo placeholder */
    .demo-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
    }
    
    .demo-icon {
      width: 60px;
      height: 60px;
      opacity: 0.5;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <!-- Top Navigation (Hidden initially) -->
  <div class="top-nav" id="topNav">
    <div class="tabs-container" id="tabsContainer">
      <!-- Tabs will be inserted here -->
    </div>
    <div class="url-bar-container">
      <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input 
        type="text" 
        class="url-bar" 
        id="urlBar"
        placeholder="Enter URL or search..."
      >
    </div>
  </div>

  <!-- Landing Page -->
  <div class="landing" id="landing">
    <h1 class="logo">Lefty</h1>
    <div class="search-container">
      <div class="search-box">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          class="search-input" 
          id="mainSearch"
          placeholder="Search the internet freely and privately."
        >
      </div>
    </div>
    <p class="footer-text">Powered by Ultraviolet • Private • Secure</p>
  </div>

  <!-- Proxy View -->
  <div class="proxy-view" id="proxyView">
    <div class="demo-placeholder">
      <svg class="demo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <p style="font-size: 18px; margin-bottom: 10px;">Proxy View</p>
      <p style="font-size: 14px; opacity: 0.6; max-width: 500px;">
        In a full implementation, this area would display the proxied website.<br>
        <span style="font-size: 12px; opacity: 0.4; display: block; margin-top: 15px;">
          This requires Ultraviolet backend integration
        </span>
      </p>
    </div>
  </div>

  <script>
    // Tab management
    let tabs = [{ id: 1, url: '', title: 'New Tab' }];
    let activeTabId = 1;
    const MAX_TABS = 3;

    const landing = document.getElementById('landing');
    const proxyView = document.getElementById('proxyView');
    const topNav = document.getElementById('topNav');
    const mainSearch = document.getElementById('mainSearch');
    const urlBar = document.getElementById('urlBar');
    const tabsContainer = document.getElementById('tabsContainer');

    // Check if input is a URL
    function isValidUrl(string) {
      if (string.includes('.') && !string.includes(' ')) {
        try {
          const url = string.startsWith('http') ? string : 'https://' + string;
          new URL(url);
          return true;
        } catch (_) {
          return false;
        }
      }
      return false;
    }

    // Process search/URL input
    function processInput(input) {
      if (!input.trim()) return;
      
      let targetUrl;
      if (isValidUrl(input)) {
        targetUrl = input.startsWith('http') ? input : 'https://' + input;
      } else {
        targetUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(input);
      }
      
      // Update active tab
      const activeTab = tabs.find(t => t.id === activeTabId);
      activeTab.url = targetUrl;
      activeTab.title = input.slice(0, 20);
      
      // Show proxy view
      landing.classList.add('hidden');
      proxyView.classList.add('active');
      topNav.classList.add('active');
      
      urlBar.value = targetUrl;
      renderTabs();
      
      // In real implementation, load URL in iframe here
      console.log('Loading:', targetUrl);
    }

    // Main search handler
    mainSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processInput(mainSearch.value);
        mainSearch.value = '';
      }
    });

    // URL bar handler
    urlBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processInput(urlBar.value);
      }
    });

    // Render tabs
    function renderTabs() {
      tabsContainer.innerHTML = tabs.map(tab => \`
        <div class="tab \${tab.id === activeTabId ? 'active' : ''}" onclick="switchTab(\${tab.id})">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span class="tab-title">\${tab.title}</span>
          \${tabs.length > 1 ? \`
            <button class="tab-close" onclick="event.stopPropagation(); closeTab(\${tab.id})">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"></path>
              </svg>
            </button>
          \` : ''}
        </div>
      \`).join('') + (tabs.length < MAX_TABS ? \`
        <button class="new-tab-btn" onclick="addTab()">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      \` : '');
    }

    function switchTab(tabId) {
      activeTabId = tabId;
      const tab = tabs.find(t => t.id === tabId);
      urlBar.value = tab.url;
      renderTabs();
    }

    function closeTab(tabId) {
      if (tabs.length === 1) return;
      tabs = tabs.filter(t => t.id !== tabId);
      if (activeTabId === tabId) {
        activeTabId = tabs[0].id;
        urlBar.value = tabs[0].url;
      }
      renderTabs();
    }

    function addTab() {
      if (tabs.length >= MAX_TABS) {
        alert('Maximum 3 tabs allowed to prevent lag!');
        return;
      }
      const newId = Math.max(...tabs.map(t => t.id)) + 1;
      tabs.push({ id: newId, url: '', title: 'New Tab' });
      activeTabId = newId;
      urlBar.value = '';
      renderTabs();
    }

    // Initialize
    renderTabs();
    mainSearch.focus();
  </script>
</body>
</html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Lefty Proxy running on port \${PORT}\`);
  console.log(\`Visit: http://localhost:\${PORT}\`);
});

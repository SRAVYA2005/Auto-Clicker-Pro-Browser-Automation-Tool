# ⚡ Auto Clicker Pro – Browser Automation Tool

A Chrome Extension built using Manifest V3 that automates repetitive browser interactions by simulating user clicks with configurable controls, real-time feedback, and robust error handling.

---

## 🚀 Features

- 🖱️ Automated clicking at custom intervals  
- 📍 Optional click position selection  
- ⏸️ Start / Pause / Resume / Stop controls  
- ⌨️ Keyboard shortcuts for quick control  
- ⏱️ Persistent timer with session tracking  
- 📊 Real-time click counter in popup  
- 🔴 Visual click indicator on screen  
- 🔁 Dynamic content script injection  
- ⚠️ Safe handling of restricted pages  
- 💾 State persistence using Chrome storage  

---

## 🧠 Architecture

This extension follows a modular Chrome Extension (Manifest V3) architecture:

- **background.js**
  - Handles automation logic
  - Manages intervals and state
  - Injects content scripts dynamically
  - Handles keyboard shortcuts

- **content.js**
  - Executes click actions on the webpage
  - Tracks selected click position
  - Displays visual click markers

- **popup.js**
  - User interface logic
  - Controls start/stop/pause/resume
  - Displays timer and click feedback

- **popup.html / style.css**
  - Interactive UI with responsive design

---

## 🛠️ Tech Stack

- JavaScript (ES6+)
- Chrome Extension APIs (Manifest V3)
- HTML5 & CSS3

---

## 📦 Installation (Local)

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/auto-clicker-pro.git

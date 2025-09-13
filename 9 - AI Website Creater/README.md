# AI Landing Page Generator

This project is a **React + Express full-stack application** that generates clean and responsive landing pages using the **OpenAI (via OpenRouter)** API.  

## 🚀 Features
- Input your product **idea** and select a **type** (e.g., AI SaaS, mobile app, etc.).  
- Generates a **responsive HTML landing page** using **Tailwind CSS**.  
- Displays the generated code inside the app.  
- Backend proxy for secure API key handling.  

## 🛠️ Tech Stack
- **Frontend:** React, Axios, Tailwind CSS  
- **Backend:** Express.js, CORS, Axios  
- **AI Model:** OpenAI (via OpenRouter API)  

## 📂 Project Structure
```
.
├── client/           # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Home.jsx
│   │   ├── Start.jsx
│   │   └── index.js
│   └── package.json
├── server/           # Express backend
│   ├── index.js
│   └── package.json
├── .env              # API keys (not committed to GitHub)
├── README.md
```

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/sanjaydeveloper-001/AI-Website-Generator.git
cd ai-landing-page-generator
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file inside the **server** folder:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Run the backend:
```bash
npm start
```
Server will run at `http://localhost:5000` 🚀

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` ⚡

## 🎯 Usage
1. Start both **backend** and **frontend**.  
2. Go to the homepage, enter your **idea** and **type**.  
3. Click **Generate** → AI will generate a landing page HTML.  

## 📌 Example
For idea: `"TaskMaster Pro"` and type: `"AI SaaS"` →  
The app generates a landing page with a heading, subheading, features, and CTA button.

## 🤝 Contributing
Pull requests are welcome!  

## 📜 License
This project is licensed under the **MIT License**.

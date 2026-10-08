# Murarisai Tadepalli - Personal Portfolio

A premium, modern, and professional personal portfolio website featuring an integrated profile-specific AI chatbot. Built for a CSE-IoT Student specializing in Software Development, AI, GenAI, and Backend Systems.

## Features
- **Modern Minimal UI:** Clean, technical aesthetic designed for recruiters and hackathon judges.
- **Dynamic Content Loading:** All portfolio data (projects, skills, experience) is driven by a clean JSON structure, separating data from UI.
- **Integrated AI Portfolio Assistant:** A custom AI chatbot powered by Gemini that answers questions specifically based on the portfolio's knowledge base.
- **Responsive Design:** Optimized for Desktop, Tablet, and Mobile.
- **Micro-interactions:** Smooth scrolling, hover effects, and a polished chatbot interface.

## Architecture
The project is divided into a static frontend and a lightweight backend for the AI.

- **Frontend:** HTML5, Vanilla CSS3 (Custom Variables, Flexbox/Grid), Vanilla JavaScript.
- **Backend:** Node.js, Express.js.
- **AI Integration:** Google Gemini API (`@google/genai` SDK) acting as the brain of the chatbot.

### Chatbot Architecture
1. **Data Source:** `frontend/data/portfolioData.json` acts as the single source of truth.
2. **System Instruction:** The backend reads this JSON and provides it as a strict System Instruction to the LLM to prevent hallucinations.
3. **API Layer:** The frontend sends user queries to the Express backend (`/api/chat`).
4. **LLM Engine:** The Gemini 2.5 Flash model processes the query against the structured profile data and returns concise, relevant answers.

## Folder Structure
```
portfolio/
├── frontend/
│   ├── css/
│   │   └── style.css          # Core styling and theme variables
│   ├── js/
│   │   ├── main.js            # Dynamic rendering of JSON data
│   │   └── chatbot.js         # Chatbot UI logic and API calls
│   ├── data/
│   │   └── portfolioData.json # Single source of truth for all content
│   ├── assets/                # Images and media
│   └── index.html             # Main layout
│
├── backend/
│   ├── server.js              # Express API & Gemini integration
│   ├── package.json           
│   └── .env.example           
│
└── README.md
```

## Installation & Running Locally

1. **Clone the repository.**
2. **Setup the Backend:**
   - Navigate to the `backend` directory: `cd backend`
   - Install dependencies: `npm install`
   - Copy `.env.example` to `.env`: `cp .env.example .env` (or create it manually).
   - Add your Gemini API key to the `.env` file: `GEMINI_API_KEY=your_actual_key`
   - Start the backend server: `npm run dev` (Runs on `http://localhost:3000`)
3. **Setup the Frontend:**
   - You can serve the frontend folder using any static server (like VS Code Live Server, or Python's `http.server`).
   - For example: `cd frontend` then `npx serve` or `python -m http.server 8000`
4. **Open your browser** and navigate to the local frontend URL (e.g., `http://localhost:8000`).

## Environment Variables
- `PORT`: (Optional) Port for the backend server (default: 3000).
- `GEMINI_API_KEY`: (Required) API key from Google AI Studio.

## Future Improvements
- **RAG Implementation:** Move from passing the full JSON as a system prompt to a Retrieval-Augmented Generation approach with vector embeddings if the portfolio data grows significantly.
- **Expanded Project Case Studies:** Add dedicated modal windows or separate pages for deep-dive technical case studies.
- **Automated Deployments:** Add GitHub Actions for seamless deployment to platforms like Vercel (frontend) and Render (backend).

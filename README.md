# Life Mirror - AI-Powered Healthcare Digital Twin

A compassionate AI healthcare assistant that provides real-time, personalized wellness guidance by analyzing your daily activities and health metrics. Life Mirror creates a digital twin of your health state and offers organ-specific insights, actionable tips, and intelligent nudges to support your wellbeing journey.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)

## 🎯 Overview

Life Mirror is an innovative healthcare AI application that bridges the gap between daily health tracking and personalized wellness guidance. The app features:

- **Real-time Health Dashboard**: Monitor your energy, glucose stress, and overall stress levels
- **Organ-Specific Chat**: Have conversations with different organ systems (Heart, Pancreas, Blood Vessels) for targeted health insights
- **AI Health Companion**: Get personalized tips, daily summaries, and wellness guidance powered by Google Gemini AI
- **Life Moment Logging**: Record daily activities and health moments with context and intensity
- **What-If Analysis**: Explore hypothetical health scenarios and understand their impact
- **Context-Aware AI**: Every response considers your complete health history and current state

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI framework with Hooks for state management
- **Vite** 7.3.1 - Lightning-fast build tool and dev server
- **Tailwind CSS** 3.4.13 - Utility-first CSS framework for responsive design
- **Lucide React** 0.563.0 - Beautiful, customizable SVG icon library

### Backend & APIs
- **Google Generative AI** (@google/generative-ai v0.24.1) - AI model integration
- **Gemini 2.5 Flash** - Fast, cost-effective language model for real-time responses
- **JSON Server** 1.0.0-beta.5 - Mock REST API for local development and data persistence

### Development Tools
- **Concurrently** 9.2.1 - Run multiple processes (Vite + JSON Server) simultaneously
- **Vite React Plugin** 5.1.1 - React-specific optimizations for Vite
- **ESLint** 9.39.1 - Code quality and consistency checks

## 🔌 API Documentation

### Google Gemini API Integration

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

**Authentication**: API key required in `VITE_GEMINI_API_KEY` environment variable

**Request Format**:
```json
{
  "contents": [{
    "parts": [{
      "text": "Your prompt here"
    }]
  }],
  "generationConfig": {
    "temperature": 0.8,
    "maxOutputTokens": 2000
  }
}
```

**Response Format**:
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "AI generated response as JSON"
      }]
    }
  }]
}
```

### Local JSON Server

**Port**: 3001 (development)  
**Database**: `db.json` in project root  
**Endpoints**:
- `GET /healthState` - Current health metrics
- `GET /lifeMoments` - Recorded life moments and activities
- `GET /currentTwin` - Current health twin state
- `GET /whatIfTwin` - Hypothetical health scenario state

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18+ and **npm** (or yarn/pnpm)
- **Git** for version control
- **Google Gemini API Key** (free tier available at [console.cloud.google.com](https://console.cloud.google.com))

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/life-mirror.git
cd life-mirror
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_JSON_SERVER_URL=http://localhost:3002
```

**Get your Gemini API Key**:
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Generative AI API
4. Create an API key in the Credentials section
5. Copy the key to your `.env` file

## 🚀 Running the Application

### Development Mode (Recommended)

Run both Vite dev server and JSON Server simultaneously:

```bash
npm run dev:all
```

The application will be available at:
- **Frontend**: [http://localhost:5173](http://localhost:5173) (or next available port)
- **JSON Server**: http://localhost:3002

### Alternative: Run Separately

**Terminal 1 - Vite Dev Server**:
```bash
npm run dev
```

**Terminal 2 - JSON Server**:
```bash
npm run server
```

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📁 Project Structure

```
life-mirror/
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main application component
│   │   ├── DashboardOverview.jsx # Health metrics overview
│   │   ├── LifeMomentInput.jsx   # Life moment logging form
│   │   ├── Companion.jsx         # AI health companion
│   │   ├── OrganChatPanel.jsx    # Organ-specific conversations
│   │   ├── NudgePanel.jsx        # Health nudges/reminders
│   │   ├── ParallelTwinView.jsx  # What-if scenario comparison
│   │   └── AvatarView.jsx        # User avatar display
│   ├── services/
│   │   ├── api.js               # Generic API utilities
│   │   └── geminiService.js      # Google Gemini AI integration
│   ├── utils/
│   │   ├── avatarState.js        # Avatar state management
│   │   └── healthLogic.js        # Health calculation logic
│   ├── styles/
│   │   └── globals.css           # Global Tailwind styles
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # React entry point
├── public/                       # Static assets
├── db.json                       # JSON Server database
├── .env                          # Environment variables (create this)
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## 🔑 Key Features

- **Real-time AI Responses**: Powered by Google Gemini 2.5 Flash for instant, intelligent guidance
- **Persistent Conversations**: Each organ maintains its own conversation history
- **Health Context Awareness**: Every AI response considers your complete health profile
- **Rate-Limited API**: Smart rate limiting (2 requests per 2 seconds) ensures smooth UX
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Error Handling**: Graceful fallbacks and human-friendly error messages

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 or 3002 is in use, Vite will automatically use the next available port. Check the terminal output for the correct URL.

### Gemini API Key Errors
- Verify `VITE_GEMINI_API_KEY` is set in `.env`
- Check API key validity in Google Cloud Console
- Ensure Generative AI API is enabled in your GCP project


---

**Built with ❤️ for better health outcomes**

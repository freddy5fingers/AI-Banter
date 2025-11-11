# AI Banter

AI Banter is a web application that simulates entertaining debates, roasts, and conversations between two or more AI-powered personas. Users can select from a diverse cast of famous characters, provide a topic, and watch as the AIs generate a unique, back-and-forth dialogue in real-time, complete with distinct, AI-generated voices.

![AI Banter Screenshot](https://storage.googleapis.com/aistudio-project-marketplace-public/ce918809-5561-464a-a111-b847a956972d/screencapture-240730-174026.png)

## ✨ Features

-   **Dynamic Persona Selection**: Choose 2 to 4 combatants from a list of iconic figures like Elon Musk, Taylor Swift, Batman, and Donald Trump.
-   **Multiple Conversation Modes**:
    -   **Banter**: A standard, engaging discussion on a given topic.
    -   **Instant Roast**: A witty and clever roast battle.
    -   **18+ Vulgar Roast**: An uncensored, no-holds-barred roast for mature audiences.
-   **Real-time AI Dialogue**: The conversation unfolds live, with each persona responding to the previous statement.
-   **AI-Generated Voice**: Each character has a unique voice powered by the Gemini text-to-speech model, bringing the conversation to life.
-   **Interactive Controls**: Play, pause, mute, and end the conversation at any time.
-   **Topic Suggestions**: Get inspired with a list of suggested debate topics.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI & Speech Generation**: Google Gemini API (`gemini-2.5-flash` for text, `gemini-2.5-flash-preview-tts` for speech)
-   **Authentication**: Firebase Auth (for user sign-in)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later recommended)
-   A package manager like `npm` or `yarn`
-   A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   A **Firebase Project**. Set up a new project in the [Firebase Console](https://console.firebase.google.com/) to get your configuration keys.

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-banter.git
    cd ai-banter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    You need to provide your API keys to the application. The project expects environment variables for this.

    First, update the Firebase configuration in `src/services/firebase.ts` with your actual project credentials.

    Next, create a file named `.env` in the root of your project and add your Google Gemini API key:

    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    ```

    *Note: The vite setup only exposes variables prefixed with `VITE_`. For this project, `process.env` is polyfilled so you can use `API_KEY` directly.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) (or the address shown in your terminal) to view the application in your browser.

## 🌐 Deployment with Vercel

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Push your code to a Git repository** (e.g., on GitHub, GitLab, or Bitbucket).

2.  **Import your project into Vercel**. Vercel will automatically detect that it's a Vite project and configure the build settings.

3.  **Configure Environment Variables**: This is the most important step for a secure deployment. In your Vercel project's settings, go to the "Environment Variables" section and add the following:

    -   `API_KEY`: Your Google Gemini API key.
    -   You should also add your Firebase credentials here as environment variables (e.g., `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.) and update `src/services/firebase.ts` to use `import.meta.env.VITE_...` for better security.

4.  **Deploy!** Vercel will build and deploy your application. Any time you push a change to your Git repository, Vercel will automatically redeploy the site.

## 📁 Project Structure

```
/
├── public/         # Static assets
├── src/
│   ├── components/ # React components
│   ├── constants/  # App-wide constants (personas, topics)
│   ├── services/   # API service modules (Gemini, Firebase)
│   ├── utils/      # Utility functions (e.g., audio processing)
│   ├── App.tsx     # Main application component
│   └── index.tsx   # Entry point
├── .env.example    # Example environment variables
├── index.html      # HTML entry point
├── package.json
└── README.md
```

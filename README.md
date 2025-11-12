# AI Banter

AI Banter is a web application that simulates entertaining debates, roasts, and conversations between two or more AI-powered personas. Users can select from a diverse cast of famous characters, provide a topic, and watch as the AIs generate a unique, back-and-forth dialogue in real-time, complete with distinct, AI-generated voices.

![AI Banter Screenshot](https://storage.googleapis.com/aistudio-project-marketplace-public/ce918809-5561-464a-a111-b847a956972d/screencapture-240730-174026.png)

## ✨ Features

-   **Dynamic Persona Selection**: Choose 2 to 4 combatants from a list of iconic figures like Elon Musk, Taylor Swift, Batman, and Donald Trump.
-   **Add Characters Mid-Conversation**: Inject new personalities into an ongoing discussion to spice things up.
-   **Multiple Conversation Modes**:
    -   **Banter**: A standard, engaging discussion on a given topic.
    -   **Instant Roast**: A witty and clever roast battle.
    -   **18+ Vulgar Roast**: An uncensored, no-holds-barred roast for mature audiences.
-   **Real-time AI Dialogue**: The conversation unfolds live, with each persona responding to the previous statement.
-   **AI-Generated Voice**: Each character has a unique voice powered by the Gemini text-to-speech model, bringing the conversation to life.
-   **Interactive Controls**: Play, pause, mute, skip to the next turn, and end the conversation at any time.
-   **Topic Suggestions**: Get inspired with a list of suggested debate topics.
-   **Local API Key Storage**: Securely uses your own Gemini API key, storing it only in your browser's local storage.

## 🛠️ Core Technologies

-   **Frontend**: React & TypeScript
-   **Styling**: Tailwind CSS (via CDN)
-   **AI Text Generation**: Google Gemini API (`gemini-2.5-flash`)
-   **AI Speech Generation**: Google Gemini API (`gemini-2.5-flash-preview-tts`)
-   **Audio Playback**: Web Audio API

## 🚀 How to Use

This application is a self-contained static web app. To run it, you simply need to serve the files with any basic web server or open the `index.html` file in your browser.

1.  **Get a Gemini API Key**: You'll need a Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey). Ensure that your key has billing enabled to avoid rate-limiting issues.

2.  **Open the App**: Launch `index.html` in your web browser.

3.  **Enter Your API Key**: On the setup screen, you'll be prompted to enter your Gemini API Key. The app will validate it and save it to your browser's local storage for future visits. It is never sent to any server other than Google's.

4.  **Set up the Banter**:
    -   Select 2 to 4 characters to participate.
    -   Enter a topic for them to discuss (required for "Banter" mode).
    -   Choose your mode: Banter, Instant Roast, or 18+ Vulgar Roast.

5.  **Enjoy the Show**: Watch the conversation unfold in real time! Use the controls at the bottom to manage the experience.

## 📁 Project Structure

The project is structured as a simple, single-page application without a complex build process:

-   `index.html`: The main HTML file that loads Tailwind CSS and the main React script.
-   `index.tsx`: The entry point for the React application.
-   `App.tsx`: The root component that manages the view state (setup vs. conversation).
-   `components/`: Contains all the reusable React components like `SetupView`, `ConversationView`, `PersonaCard`, etc.
-   `constants/`: Holds static data arrays for `PERSONAS` and `SUGGESTED_TOPICS`.
-   `services/`: Includes `geminiService.ts`, which handles all interactions with the Gemini API.
-   `types.ts`: Defines the core TypeScript interfaces (`Persona`, `Message`).
-   `utils/`: Contains utility functions, such as `audioUtils.ts` for decoding the audio data from the API.

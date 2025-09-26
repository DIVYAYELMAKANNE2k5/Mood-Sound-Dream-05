# Mood Sound Dream

Mood Sound Dream is an interactive web application built with React and Vite, designed to create immersive soundscapes based on user moods or dream themes. Users can explore ambient audio experiences tailored to their emotional state, featuring a modern, responsive interface powered by Tailwind CSS and Shadcn UI components.

## Features

- **Personalized Soundscapes**: Generate ambient sounds and audio layers inspired by moods (e.g., calm, energetic) or dream scenarios.
- **Responsive UI**: Built with Shadcn UI for accessible, customizable components like cards, sliders, and dialogs.
- **Mobile-Friendly**: Includes hooks for mobile detection and optimized layouts.
- **Ambient Visuals**: Background imagery and placeholders for an engaging experience.
- **Simple Navigation**: Basic routing with home (Index) and 404 pages.

## Tech Stack

- **Frontend**: React (with TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS
- **UI Components**: Shadcn UI
- **Package Management**: Bun (with npm compatibility)
- **Linting**: ESLint
- **Other**: Custom hooks (e.g., use-toast, use-mobile), utils for common operations

## Installation

1. Clone the repository (if applicable) or navigate to the project directory:
   ```
   cd c:/Users/DELL/Desktop/mood-sound-dream-main
   ```

2. Install dependencies using npm (or Bun if preferred):
   ```
   npm install
   ```
   Or with Bun:
   ```
   bun install
   ```

3. Ensure Node.js (v18+) and npm/Bun are installed on your system.

## Usage

1. Start the development server:
   ```
   npm run dev
   ```
   Or with Bun:
   ```
   bun run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (default Vite port).

3. Interact with the SoundscapeApp to select moods, adjust audio layers, and immerse yourself in generated soundscapes.

For production builds:
```
npm run build
```
Output will be in the `dist/` directory. Serve it with any static file server.

## Project Structure

```
mood-sound-dream-main/
├── public/              # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── assets/          # Images and media (e.g., ambient-background.jpg)
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Shadcn UI primitives (button, card, etc.)
│   │   └── SoundscapeApp.tsx  # Main application component
│   ├── hooks/           # Custom React hooks (use-mobile, use-toast)
│   ├── lib/             # Utilities (utils.ts)
│   ├── pages/           # Page components (Index, NotFound)
│   ├── App.tsx          # Root App component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind setup
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch.
3. Make your changes and ensure the app runs without errors.
4. Submit a pull request.

For major changes, please open an issue first to discuss.

## License

This project is open-source and available under the MIT License (or specify if different).

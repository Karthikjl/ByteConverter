# Byte Converter [use it](https://karthikjl.github.io/ByteConverter/)

A sleek, real-time unit converter for data measurements, built with Next.js and enhanced with AI-powered suggestions. This tool provides a seamless experience for developers, students, and anyone working with digital data sizes.

![Byte Converter Screenshot](https://placehold.co/800x600.png?text=App+Screenshot)

## ✨ Features

- **Real-time Conversion**: Instantly see conversions across Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes.
- **Interactive UI**: 
    - **Single-tap to edit** values directly.
    - **Double-tap to copy** any converted value to your clipboard.
- **Incremental Controls**: Fine-tune values with up/down stepper buttons.
- **AI-Powered Suggestions**: Get smart conversion suggestions based on your input.
- **Responsive Design**: A clean, modern interface that works beautifully on all devices.
- **Toast Notifications**: Get clear feedback when you copy a value.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **AI**: [Google Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **State Management**: React Hooks (`useState`, `useCallback`)
- **Linting & Formatting**: ESLint & Prettier (configured with Next.js)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (v18 or later) and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/byte-converter.git
   cd byte-converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of your project and add any necessary environment variables (e.g., your Google AI API key for Genkit).
   ```
   GOOGLE_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

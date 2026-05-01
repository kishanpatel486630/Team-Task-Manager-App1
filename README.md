# Team Task Manager App

A modern, collaborative task management application built with React, TypeScript, and Vite. This app enables teams to efficiently organize, track, and collaborate on tasks with an intuitive user interface.

**Design Reference:** [Figma Project](https://www.figma.com/design/jiawZwdZEBFxi84D16IaJO/Team-Task-Manager-App)

## ✨ Features

- **Task Management** - Create, update, and delete tasks with ease
- **Team Collaboration** - Work together with real-time updates
- **Drag & Drop** - Intuitive drag-and-drop interface for organizing tasks
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark/Light Theme** - Theme switcher for comfortable viewing
- **Rich Components** - Built with shadcn/ui and Radix UI components
- **Charts & Analytics** - Visualize task progress with Recharts
- **Form Validation** - Robust form handling with React Hook Form

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.3
- **Language:** TypeScript
- **Build Tool:** Vite 6.3
- **UI Components:** shadcn/ui, Radix UI, Material-UI
- **Styling:** Tailwind CSS 4.1
- **State Management:** React Hook Form
- **Drag & Drop:** React DnD
- **Charts:** Recharts
- **Animations:** Motion
- **Database:** Supabase

## 📋 Prerequisites

- Node.js 16+
- npm or yarn package manager

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/kishanpatel486630/Team-Task-Manager-App1.git
cd Team-Task-Manager-App1

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Main app component
│   ├── components/
│   │   ├── custom/            # Custom components (Avatar, Badge, Button, etc.)
│   │   ├── figma/             # Figma-specific components
│   │   └── ui/                # shadcn/ui components
│   └── utils/
│       └── api.ts             # API utilities
├── imports/                    # Import resources and documentation
├── main.tsx                    # Application entry point
└── styles/                     # Global stylesheets
```

## 🌐 Deployment

### Deploy to Vercel

The easiest way to deploy this app is using [Vercel](https://vercel.com).

#### Option 1: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
3. Click "New Project"
4. Select your `Team-Task-Manager-App1` repository
5. Vercel will automatically detect it's a Vite project
6. Click "Deploy"

#### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Environment Variables

Create a `.env.local` file in the root directory if needed:

```env
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

### Other Deployment Options

- **Netlify:** Connect your GitHub repo at netlify.com
- **AWS Amplify:** Connect through AWS Amplify Console
- **GitHub Pages:** Configure GitHub Actions for automatic deployment

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🐛 Troubleshooting

**Issue:** Dependencies not installing

```bash
# Clear npm cache
npm cache clean --force
npm install
```

**Issue:** Port 5173 already in use

```bash
# Use a different port
npm run dev -- --port 3000
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions, please open an issue on [GitHub Issues](https://github.com/kishanpatel486630/Team-Task-Manager-App1/issues).

## 🙏 Acknowledgments

- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Design inspiration from the Figma project
- Built with [Vite](https://vitejs.dev/)

# Finance Dashboard

A simple React-based finance dashboard with mock data.

## Features

- Dashboard overview with summary cards
- Transaction management with filtering and sorting
- Role-based UI (Admin/Viewer)
- Insights section
- Responsive design
- Dark mode support

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Recharts for charts
- Zustand for state management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── dashboard/   # Dashboard-specific components
│   ├── transactions/ # Transaction components
│   └── layout/      # Layout components
├── context/         # React contexts
├── hooks/           # Custom hooks
├── lib/             # Utilities
├── pages/           # Page components
├── store/           # State management
└── utils/           # Helper functions
```

## Mock Data

The application uses static mock data for transactions and calculations. All data is stored in memory and persists during the session.
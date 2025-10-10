# React Interview Practice Challenges

A curated collection of progressively challenging React exercises designed to help you prepare for technical interviews. Each exercise focuses on modern React patterns and commonly tested concepts in 30-60 minute live coding sessions.

## 🎯 Purpose

This repository simulates real interview scenarios where you need to:
- Solve practical React problems under time constraints
- Demonstrate understanding of React APIs and patterns
- Show proficiency with modern React 18/19 features
- Write clean, type-safe TypeScript code
- Manage state effectively

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## 📚 Exercises

The repository contains **7 exercises** covering essential React concepts:

| # | Exercise | Time | Difficulty | Concepts |
|---|----------|------|------------|----------|
| 1 | Counter with Undo/Redo | 15-20m | Easy | `useState`, state history |
| 2 | Custom Hooks | 20-25m | Easy-Medium | `useEffect`, `useLocalStorage`, `useDebounce` |
| 3 | Dynamic Form Builder | 25-30m | Medium | Controlled inputs, validation |
| 4 | Data Fetching with Suspense | 30-35m | Medium | Suspense, Error Boundaries |
| 5 | Search with useTransition | 30-35m | Medium | Concurrent features (React 18) |
| 6 | Performance Optimization | 35-40m | Medium-Hard | `React.memo`, `useMemo`, `useCallback` |
| 7 | Todo with useReducer | 40-45m | Medium-Hard | Complex state, discriminated unions |

## 🎓 How to Practice

1. **Choose an exercise** from the `exercises/` directory
2. **Read the prompt** in `exercise.md` to understand requirements
3. **Open `src/App.tsx`** and uncomment the starter file import
4. **Implement your solution** in the `starter/` folder
5. **Compare with solution** in the `solution/` folder when done

### Example: Starting Exercise 1

```tsx
// In src/App.tsx
import CounterUndo from '../exercises/01-counter-undo/starter/CounterUndo'

function App() {
  return <CounterUndo />
}
```

## 🏗️ Project Structure

```
practice-react-challenges/
├── exercises/
│   ├── 01-counter-undo/
│   │   ├── exercise.md           # Challenge description
│   │   ├── starter/
│   │   │   ├── CounterUndo.tsx   # Your solution here
│   │   │   └── CounterUndo.module.css
│   │   └── solution/
│   │       ├── CounterUndo.tsx   # Reference solution
│   │       └── CounterUndo.module.css
│   ├── 02-custom-hooks/
│   ├── 03-dynamic-form/
│   ├── 04-suspense-data/
│   ├── 05-search-transition/
│   ├── 06-performance/
│   └── 07-todo-reducer/
├── src/
│   ├── App.tsx                   # Import exercises here
│   └── ...
└── README.md
```

## ✨ Modern React Features Covered

- ✅ **React 18+ Suspense** for data fetching
- ✅ **Concurrent features** (`useTransition`, `useDeferredValue`)
- ✅ **New hooks** (`useId`, React 18/19 APIs)
- ✅ **Error Boundaries** for error handling
- ✅ **Performance optimization** (memo, useMemo, useCallback)
- ✅ **Custom hooks** patterns
- ✅ **Complex state** management with `useReducer`
- ✅ **TypeScript** with React
- ✅ **CSS Modules** for styling

## 💡 Interview Tips

1. **Understand requirements first** - Ask clarifying questions before coding
2. **Start simple** - Get basic functionality working, then add features
3. **Think out loud** - Explain your thought process as you code
4. **Handle edge cases** - Consider empty states, errors, loading states
5. **Write clean code** - Use meaningful names and proper structure
6. **Use TypeScript** - Leverage types to catch errors early
7. **Time management** - Don't over-engineer; focus on requirements

## 🛠️ Tech Stack

- **React 18** - UI library with concurrent features
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Scoped styling
- **ESLint** - Code quality

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/29/react-v18)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 🎯 What's NOT Covered

This repository focuses on client-side React and intentionally excludes:
- Next.js and React Server Components
- Full application architecture
- Backend/API development
- Complex routing scenarios
- State management libraries (Redux, Zustand, etc.)

These are isolated UI challenges perfect for practicing component-level React skills.

## 🤝 Contributing

This is a personal practice repository, but feel free to fork it and customize the exercises for your own needs!

## 📝 License

MIT

---

**Good luck with your interviews!** 🚀

Remember: The goal is not just to solve the problems, but to demonstrate your understanding of React patterns, best practices, and modern features.

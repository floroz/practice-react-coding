import { createContext, useContext, useState } from "react";
import styles from "./ContextOptimization.module.css";

// TODO: Define context types
interface AppContextValue {
  // Theme
  theme: "light" | "dark";
  primaryColor: string;
  fontSize: number;
  // User
  userName: string;
  userRole: "admin" | "user" | "guest";
  notifications: number;
  // Actions
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
  setFontSize: (size: number) => void;
  setUserName: (name: string) => void;
  incrementNotifications: () => void;
}

// TODO: Create Context
const AppContext = createContext<AppContextValue | undefined>(undefined);

// TODO: Create Provider (start with unoptimized version)
function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [primaryColor, setPrimaryColor] = useState("#0066cc");
  const [fontSize, setFontSize] = useState(16);
  const [userName, setUserName] = useState("John Doe");
  const [userRole] = useState<"admin" | "user" | "guest">("user");
  const [notifications, setNotifications] = useState(3);

  // TODO: Create value object (unoptimized - not memoized)
  // TODO: Implement this pattern, then optimize later

  return (
    <AppContext.Provider value={undefined as any}>
      {children}
    </AppContext.Provider>
  );
}

// TODO: Create useAppContext hook
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

// TODO: Create components and add render counters
function Header() {
  // TODO: Add render counter
  // TODO: Use context

  return (
    <header className={styles.header}>
      {/* TODO: Display user name and notifications */}
    </header>
  );
}

function ThemeControls() {
  // TODO: Add render counter
  // TODO: Use context

  return (
    <div className={styles.section}>
      <h3>Theme Controls</h3>
      {/* TODO: Add theme toggle buttons */}
    </div>
  );
}

function UserProfile() {
  // TODO: Add render counter
  // TODO: Use context

  return (
    <div className={styles.section}>
      <h3>User Profile</h3>
      {/* TODO: Display and edit user info */}
    </div>
  );
}

function ExpensiveComponent() {
  // TODO: Add render counter
  // Simulate expensive render
  const start = performance.now();
  while (performance.now() - start < 50) {
    // Busy work
  }

  return (
    <div className={styles.section}>
      <h3>Expensive Component</h3>
      <p>This component takes time to render</p>
    </div>
  );
}

export default function ContextOptimization() {
  return (
    <AppProvider>
      <div className={styles.container}>
        <h2>Context Performance Optimization</h2>
        <p className={styles.subtitle}>
          Watch the render counts as you interact with the UI
        </p>

        <Header />
        <ThemeControls />
        <UserProfile />
        <ExpensiveComponent />
      </div>
    </AppProvider>
  );
}


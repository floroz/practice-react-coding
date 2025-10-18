import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  memo,
} from "react";
import styles from "./ContextOptimization.module.css";

// Separate contexts for better performance
interface ThemeContextValue {
  theme: "light" | "dark";
  primaryColor: string;
  fontSize: number;
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
  setFontSize: (size: number) => void;
}

interface UserContextValue {
  userName: string;
  userRole: "admin" | "user" | "guest";
  notifications: number;
  setUserName: (name: string) => void;
  incrementNotifications: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Optimized Theme Provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [primaryColor, setPrimaryColor] = useState("#0066cc");
  const [fontSize, setFontSize] = useState(16);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setPrimaryColorCallback = useCallback((color: string) => {
    setPrimaryColor(color);
  }, []);

  const setFontSizeCallback = useCallback((size: number) => {
    setFontSize(size);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      primaryColor,
      fontSize,
      toggleTheme,
      setPrimaryColor: setPrimaryColorCallback,
      setFontSize: setFontSizeCallback,
    }),
    [
      theme,
      primaryColor,
      fontSize,
      toggleTheme,
      setPrimaryColorCallback,
      setFontSizeCallback,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Optimized User Provider
function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("John Doe");
  const [userRole] = useState<"admin" | "user" | "guest">("user");
  const [notifications, setNotifications] = useState(3);

  const setUserNameCallback = useCallback((name: string) => {
    setUserName(name);
  }, []);

  const incrementNotifications = useCallback(() => {
    setNotifications((prev) => prev + 1);
  }, []);

  const value = useMemo(
    () => ({
      userName,
      userRole,
      notifications,
      setUserName: setUserNameCallback,
      incrementNotifications,
    }),
    [
      userName,
      userRole,
      notifications,
      setUserNameCallback,
      incrementNotifications,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hooks
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}

// Render counter hook
function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return renderCount.current;
}

// Memoized components
const Header = memo(function Header() {
  const { userName, notifications } = useUser();
  const renderCount = useRenderCount("Header");

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div>
          <h3>Welcome, {userName}!</h3>
          <div className={styles.badge}>
            🔔 {notifications} notification{notifications !== 1 ? "s" : ""}
          </div>
        </div>
        <div className={styles.renderBadge}>Renders: {renderCount}</div>
      </div>
    </header>
  );
});

const ThemeControls = memo(function ThemeControls() {
  const {
    theme,
    primaryColor,
    fontSize,
    toggleTheme,
    setPrimaryColor,
    setFontSize,
  } = useTheme();
  const renderCount = useRenderCount("ThemeControls");

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>Theme Controls</h3>
        <div className={styles.renderBadge}>Renders: {renderCount}</div>
      </div>

      <div className={styles.controls}>
        <div className={styles.control}>
          <label>Theme Mode:</label>
          <button onClick={toggleTheme} className={styles.button}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
          </button>
        </div>

        <div className={styles.control}>
          <label>Primary Color:</label>
          <div className={styles.colorPicker}>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className={styles.colorInput}
            />
            <span>{primaryColor}</span>
          </div>
        </div>

        <div className={styles.control}>
          <label>Font Size:</label>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className={styles.slider}
            />
            <span>{fontSize}px</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const UserProfile = memo(function UserProfile() {
  const { userName, userRole, incrementNotifications, setUserName } = useUser();
  const renderCount = useRenderCount("UserProfile");
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSave = () => {
    setUserName(tempName);
    setEditing(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>User Profile</h3>
        <div className={styles.renderBadge}>Renders: {renderCount}</div>
      </div>

      <div className={styles.controls}>
        <div className={styles.control}>
          <label>Name:</label>
          {editing ? (
            <div className={styles.editContainer}>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className={styles.input}
              />
              <button onClick={handleSave} className={styles.button}>
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className={styles.buttonSecondary}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className={styles.nameDisplay}>
              <span>{userName}</span>
              <button
                onClick={() => setEditing(true)}
                className={styles.buttonSecondary}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className={styles.control}>
          <label>Role:</label>
          <span className={styles.roleBadge}>{userRole}</span>
        </div>

        <div className={styles.control}>
          <button onClick={incrementNotifications} className={styles.button}>
            Add Notification
          </button>
        </div>
      </div>
    </div>
  );
});

const ExpensiveComponent = memo(function ExpensiveComponent() {
  const renderCount = useRenderCount("ExpensiveComponent");

  // Simulate expensive computation
  const start = performance.now();
  while (performance.now() - start < 50) {
    // Busy work to simulate expensive render
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>Expensive Component</h3>
        <div className={styles.renderBadge}>Renders: {renderCount}</div>
      </div>
      <p className={styles.note}>
        ⚠️ This component takes ~50ms to render. With proper optimization, it
        should rarely re-render.
      </p>
      <div className={styles.grid}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={styles.gridItem}>
            Item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
});

export default function ContextOptimization() {
  return (
    <ThemeProvider>
      <UserProvider>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <h2>Context Performance Optimization</h2>
            <p className={styles.subtitle}>
              This is the optimized version with split contexts and memoization
            </p>
          </header>

          <div className={styles.info}>
            <h3>Optimization Techniques Applied:</h3>
            <ul>
              <li>✅ Split contexts (Theme and User separate)</li>
              <li>✅ Memoized context values with useMemo</li>
              <li>✅ Memoized callbacks with useCallback</li>
              <li>✅ Wrapped components with React.memo</li>
              <li>✅ Render counters to track re-renders</li>
            </ul>
            <p className={styles.instruction}>
              👉 Try changing theme settings or user info and watch which
              components re-render!
            </p>
          </div>

          <Header />
          <ThemeControls />
          <UserProfile />
          <ExpensiveComponent />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}


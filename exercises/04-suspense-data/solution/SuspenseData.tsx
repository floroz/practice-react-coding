import { Suspense, Component, ReactNode, useState } from "react";
import styles from "./SuspenseData.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

// Resource wrapper for Suspense
function createResource<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: Error;

  const suspender = promise.then(
    (data) => {
      status = "success";
      result = data;
    },
    (err) => {
      status = "error";
      error = err;
    }
  );

  return {
    read(): T {
      if (status === "pending") {
        throw suspender; // Suspense catches this
      } else if (status === "error") {
        throw error; // ErrorBoundary catches this
      }
      return result;
    },
  };
}

// Mock API with artificial delay and random failures
function fetchUsers(shouldFail = false): Promise<User[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail || Math.random() < 0.1) {
        reject(new Error("Failed to fetch users. Network error occurred."));
      } else {
        // Using real API
        fetch("https://jsonplaceholder.typicode.com/users")
          .then((res) => res.json())
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      }
    }, 1500);
  });
}

// Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

// Component that reads the resource
interface UserListProps {
  resource: ReturnType<typeof createResource<User[]>>;
}

function UserList({ resource }: UserListProps) {
  const users = resource.read(); // This might throw (Suspense or Error)

  return (
    <div className={styles.userList}>
      <h3>Users ({users.length})</h3>
      {users.map((user) => (
        <div key={user.id} className={styles.userCard}>
          <h3>{user.name}</h3>
          <p>📧 {user.email}</p>
          <p>📱 {user.phone}</p>
          <p>🌐 {user.website}</p>
        </div>
      ))}
    </div>
  );
}

export default function SuspenseData() {
  const [resource, setResource] = useState(() => createResource(fetchUsers()));

  const handleRefresh = () => {
    setResource(createResource(fetchUsers()));
  };

  const handleForceError = () => {
    setResource(createResource(fetchUsers(true)));
  };

  return (
    <div className={styles.container}>
      <h2>Suspense Data Fetching</h2>
      <p>
        This example demonstrates React 18's Suspense for data fetching with
        error handling.
      </p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleRefresh}>Refresh Data</button>
        <button
          onClick={handleForceError}
          style={{ backgroundColor: "#f44336" }}
        >
          Force Error
        </button>
      </div>

      <ErrorBoundary
        fallback={(error, reset) => (
          <div className={styles.error}>
            <h3>Something went wrong!</h3>
            <p>{error.message}</p>
            <button
              onClick={() => {
                reset();
                handleRefresh();
              }}
            >
              Retry
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={<div className={styles.loading}>Loading users...</div>}
        >
          <UserList resource={resource} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

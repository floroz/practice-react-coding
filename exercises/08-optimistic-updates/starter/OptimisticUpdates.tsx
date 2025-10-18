import { useState } from "react";
import styles from "./OptimisticUpdates.module.css";

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  likedByUser: boolean;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  status: "pending" | "confirmed" | "error";
}

// Mock initial data
const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "Alice Johnson",
    content: "Just finished building my first React app with TypeScript! 🚀",
    likes: 15,
    likedByUser: false,
    comments: [
      {
        id: "c1",
        author: "Bob Smith",
        text: "Congrats! What did you build?",
        createdAt: Date.now() - 3600000,
        status: "confirmed",
      },
    ],
  },
  {
    id: "2",
    author: "Charlie Brown",
    content: "Anyone else excited about React 19 features?",
    likes: 42,
    likedByUser: false,
    comments: [],
  },
];

// TODO: Implement mock API functions
// - toggleLike(postId: string): Promise<{ success: boolean; likes: number }>
// - addComment(postId: string, text: string): Promise<{ success: boolean; comment: Comment }>

export default function OptimisticUpdates() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // TODO: Implement optimistic like toggle
  const handleLike = async (postId: string) => {
    // 1. Update UI immediately (optimistic update)
    // 2. Call mock API
    // 3. On success: confirm the update
    // 4. On failure: rollback and show error
  };

  // TODO: Implement optimistic comment add
  const handleAddComment = async (postId: string, text: string) => {
    // 1. Validate input
    // 2. Add comment with "pending" status immediately
    // 3. Call mock API
    // 4. On success: update with real ID and "confirmed" status
    // 5. On failure: remove comment and show error
  };

  return (
    <div className={styles.container}>
      <h2>Optimistic UI Updates</h2>
      <p className={styles.subtitle}>
        Like posts and add comments with instant feedback
      </p>

      <div className={styles.posts}>
        {posts.map((post) => (
          <article key={post.id} className={styles.post}>
            {/* TODO: Render post content */}
            {/* TODO: Render like button */}
            {/* TODO: Render comments */}
            {/* TODO: Render add comment form */}
          </article>
        ))}
      </div>
    </div>
  );
}


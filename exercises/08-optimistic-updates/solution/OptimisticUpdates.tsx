import { useState, useRef } from "react";
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
  {
    id: "3",
    author: "Diana Prince",
    content: "Optimistic UI updates make apps feel so much faster! ⚡",
    likes: 28,
    likedByUser: true,
    comments: [
      {
        id: "c2",
        author: "Eve Taylor",
        text: "Totally agree! But error handling is tricky.",
        createdAt: Date.now() - 7200000,
        status: "confirmed",
      },
    ],
  },
];

// Mock API with configurable failure rate
const mockApi = {
  failureRate: 0.1, // 10% failure rate

  async toggleLike(
    postId: string
  ): Promise<{ success: boolean; likes: number; error?: string }> {
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    const shouldFail = Math.random() < this.failureRate;
    if (shouldFail) {
      return { success: false, likes: 0, error: "Failed to update like" };
    }

    return { success: true, likes: Math.floor(Math.random() * 100) };
  },

  async addComment(
    postId: string,
    text: string
  ): Promise<{ success: boolean; comment?: Comment; error?: string }> {
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 700)
    );

    const shouldFail = Math.random() < this.failureRate;
    if (shouldFail) {
      return { success: false, error: "Failed to add comment" };
    }

    return {
      success: true,
      comment: {
        id: `c${Date.now()}`,
        author: "You",
        text,
        createdAt: Date.now(),
        status: "confirmed",
      },
    };
  },
};

export default function OptimisticUpdates() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [error, setError] = useState<string | null>(null);
  const pendingLikes = useRef(new Set<string>());

  const handleLike = async (postId: string) => {
    // Prevent duplicate requests
    if (pendingLikes.current.has(postId)) return;
    pendingLikes.current.add(postId);

    // Store previous state for rollback
    const previousPost = posts.find((p) => p.id === postId);
    if (!previousPost) return;

    // Optimistic update
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser,
            }
          : post
      )
    );

    try {
      const response = await mockApi.toggleLike(postId);

      if (!response.success) {
        // Rollback on failure
        setPosts((prev) =>
          prev.map((post) => (post.id === postId ? previousPost : post))
        );
        setError(response.error || "Failed to update like");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      // Rollback on error
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? previousPost : post))
      );
      setError("Network error occurred");
      setTimeout(() => setError(null), 3000);
    } finally {
      pendingLikes.current.delete(postId);
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    if (trimmedText.length > 280) {
      setError("Comment must be 280 characters or less");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Generate temporary ID
    const tempId = `temp-${Date.now()}`;

    // Optimistic update - add pending comment
    const optimisticComment: Comment = {
      id: tempId,
      author: "You",
      text: trimmedText,
      createdAt: Date.now(),
      status: "pending",
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, optimisticComment] }
          : post
      )
    );

    try {
      const response = await mockApi.addComment(postId, trimmedText);

      if (response.success && response.comment) {
        // Replace temp comment with confirmed one
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.map((c) =>
                    c.id === tempId ? response.comment! : c
                  ),
                }
              : post
          )
        );
      } else {
        // Remove temp comment on failure
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter((c) => c.id !== tempId),
                }
              : post
          )
        );
        setError(response.error || "Failed to add comment");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      // Remove temp comment on error
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== tempId),
              }
            : post
        )
      );
      setError("Network error occurred");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Optimistic UI Updates</h2>
        <p className={styles.subtitle}>
          Like posts and add comments with instant feedback
        </p>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert">
          ❌ {error}
        </div>
      )}

      <div className={styles.posts}>
        {posts.map((post) => (
          <article key={post.id} className={styles.post}>
            <div className={styles.postHeader}>
              <strong className={styles.author}>{post.author}</strong>
            </div>

            <p className={styles.content}>{post.content}</p>

            <div className={styles.actions}>
              <button
                onClick={() => handleLike(post.id)}
                className={`${styles.likeButton} ${
                  post.likedByUser ? styles.liked : ""
                }`}
                disabled={pendingLikes.current.has(post.id)}
                aria-label={post.likedByUser ? "Unlike post" : "Like post"}
              >
                {post.likedByUser ? "❤️" : "🤍"} {post.likes}
              </button>
            </div>

            <div className={styles.comments}>
              <h4 className={styles.commentsTitle}>
                Comments ({post.comments.length})
              </h4>

              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`${styles.comment} ${
                    comment.status === "pending" ? styles.pending : ""
                  }`}
                >
                  <div className={styles.commentHeader}>
                    <strong className={styles.commentAuthor}>
                      {comment.author}
                    </strong>
                    {comment.status === "pending" && (
                      <span className={styles.pendingBadge}>Sending...</span>
                    )}
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))}

              <CommentForm
                onSubmit={(text) => handleAddComment(post.id, text)}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function CommentForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onSubmit(text);
    setText("");
    setIsSubmitting(false);
  };

  const remaining = 280 - text.length;

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className={styles.commentInput}
        maxLength={280}
        disabled={isSubmitting}
        rows={2}
      />
      <div className={styles.commentFormFooter}>
        <span
          className={`${styles.charCount} ${remaining < 20 ? styles.warning : ""}`}
        >
          {remaining} characters left
        </span>
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}


# Exercise 08: Optimistic UI Updates

**Difficulty**: Medium-Hard  
**Time**: 35-40 minutes  
**Concepts**: Optimistic updates, async actions, error handling, `useTransition` (React 18/19)

## Challenge

Build a social media-style posts feed with likes and comments that uses optimistic UI updates. The UI should update immediately when users interact, then reconcile with the server response. If the server request fails, roll back the optimistic update and show an error.

This pattern is crucial for modern web apps where perceived performance matters more than actual latency.

## Requirements

### Part 1: Post Component with Likes

1. Display a list of posts (3-5 mock posts)
2. Each post shows:
   - Author name
   - Post content
   - Like count
   - Like button (heart icon or text)
   - Comments section
3. Implement optimistic like toggle:
   - Update UI immediately when clicking like
   - Send async request to "server" (mock API)
   - Keep optimistic state until server responds
   - Rollback if server returns error
   - Show error message on failure

### Part 2: Comments with Optimistic Add

1. Display existing comments for each post
2. Add comment form with:
   - Text input
   - Submit button
   - Character limit (280 chars)
3. Implement optimistic comment creation:
   - Show comment immediately with "pending" indicator
   - Generate temporary ID
   - Replace with server ID on success
   - Remove and show error on failure
   - Disable form during submission

### Part 3: Mock Server API

Create a mock API that:

1. Simulates network delay (500-1500ms random)
2. Has configurable success/failure rate (default 90% success)
3. Returns proper responses with IDs and timestamps
4. Implements these endpoints:
   - `toggleLike(postId)` → returns new like count
   - `addComment(postId, text)` → returns comment with server ID

### Part 4: UI Feedback

1. Show visual states:
   - Normal state
   - Pending/optimistic state (dimmed, spinner, etc.)
   - Success state (brief confirmation)
   - Error state (red, retry button)
2. Add toast/banner notifications for errors
3. Keep interactions fast and responsive

## Edge Cases to Consider

- What happens if the user likes/unlikes rapidly (multiple requests)?
- How do you handle comments while previous comments are pending?
- What if the user navigates away during a pending request?
- How do you prevent duplicate submissions?
- What if the server returns an unexpected error format?
- How do you handle race conditions (e.g., like, unlike, like quickly)?
- Should you disable buttons during pending requests?

## Validation

Your solution should:

1. ✅ Like button updates instantly (no waiting for server)
2. ✅ Comments appear immediately with pending indicator
3. ✅ Failed likes rollback to previous state
4. ✅ Failed comments are removed with error message
5. ✅ No duplicate requests for same action
6. ✅ Proper TypeScript types throughout
7. ✅ Accessible (keyboard navigation, screen reader friendly)

### Testing Scenarios

Test these manually:

1. **Happy Path**: Like post → see immediate update → succeeds
2. **Failed Like**: Modify mock API to fail → like post → see rollback
3. **Comment Success**: Add comment → see pending state → see confirmed
4. **Comment Failure**: Set mock API to fail → add comment → see error & removal
5. **Rapid Clicking**: Click like 5 times quickly → should debounce/handle correctly
6. **Long Comments**: Try 281 characters → should prevent submission
7. **Multiple Posts**: Add comments to different posts simultaneously

## Bonus Challenges

- Add optimistic delete for comments
- Implement edit comment with optimistic update
- Add retry logic with exponential backoff
- Show network status indicator (online/offline)
- Queue failed requests for retry when back online
- Add animations for state transitions
- Implement "Undo like" with 5-second window
- Add optimistic sorting (e.g., "most recent first")
- Show "Saving..." indicator in the UI

## TypeScript Tips

```typescript
// Strong typing for optimistic state
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

// API response types
interface LikeResponse {
  success: boolean;
  likes: number;
  error?: string;
}

interface CommentResponse {
  success: boolean;
  comment?: Comment;
  error?: string;
}

// Consider using discriminated unions for request state
type RequestState<T> =
  | { status: "idle" }
  | { status: "pending"; optimisticData: T }
  | { status: "success"; data: T }
  | { status: "error"; error: string; previousData: T };
```

## Key Concepts

**Optimistic Updates**: Update the UI immediately before the server confirms the change. This creates a snappier experience but requires careful error handling.

**Benefits**:

- Instant feedback (perceived performance)
- Better user experience
- Reduced perceived latency

**Challenges**:

- Must handle rollbacks
- Need to track pending state
- Race condition management
- Error recovery UX

**When to Use**:

- High-frequency actions (likes, votes)
- Actions with high success rate
- Actions that are easily reversible
- Real-time collaborative features

**When NOT to Use**:

- Financial transactions
- Security-sensitive operations
- Actions with low success rate
- Irreversible operations

## Implementation Hints

1. Use separate state for optimistic vs. confirmed data
2. Keep track of pending requests (Set or Map)
3. Generate temporary IDs with `crypto.randomUUID()` or `Date.now()`
4. Use `useEffect` cleanup to cancel pending requests
5. Consider using `useTransition` for non-blocking updates
6. Add a timestamp to track order of operations
7. Implement request deduplication for rapid clicks


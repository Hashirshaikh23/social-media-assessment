# Comments Feature - Requirements Specification

**Document Version:** 1.0  
**Date:** 2024  
**Feature:** Single-Level Comments System

---

## Table of Contents
1. [Business Requirements](#1-business-requirements)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [Technical Implementation](#4-technical-implementation)

---

## 1. Business Requirements

### 1.1 Business Goal
Enable users to engage with posts by adding comments, fostering discussion and community interaction. This feature enhances user engagement, increases time spent on the platform, and creates a more interactive social media experience.

### 1.2 Success Metrics
- **Engagement Rate:** Percentage of posts with at least one comment
- **Comment-to-Post Ratio:** Average number of comments per post
- **User Participation:** Percentage of authenticated users who have commented
- **Response Time:** Average time for comments to appear after submission
- **Error Rate:** Percentage of failed comment submissions

---

## 2. Functional Requirements

### 2.1 Comment Information Captured

Each comment must store the following information:
- **Comment ID:** Unique MongoDB ObjectId
- **Post ID:** Reference to the post (string ID from static posts)
- **User ID:** Reference to the user who created the comment
- **Username:** Display name of the commenter (denormalized for quick display)
- **Text:** The comment content (1-500 characters)
- **Created At:** Timestamp when comment was created
- **Updated At:** Timestamp when comment was last updated

### 2.2 Comment Display

**Ordering:**
- Comments displayed in **newest-first** order (Instagram-style)
- Most recent comment appears at the top of the list

**Pagination:**
- Initial load: Display first 20 comments
- Load more: "Load More Comments" button to fetch additional batches of 20
- Infinite scroll can be implemented as a future enhancement

**Display Format:**
- Each comment shows:
  - Commenter's username (prefixed with "@")
  - Comment text
  - Relative timestamp (e.g., "2 hours ago", "3 days ago")
  - Delete button (only visible to comment owner)

**Visibility:**
- Comments section is **collapsible/expandable** under each post
- Default state: Collapsed (user clicks "Comment" button to expand)
- Comment count badge visible on Comment button even when collapsed

### 2.3 Comment Edit/Delete Functionality

**Edit:**
- **Not implemented in initial version** (can be added later)
- Reason: Simplifies MVP and reduces complexity

**Delete:**
- Users can **delete their own comments only**
- Delete button appears only on comments owned by the current user
- Deletion is permanent (soft delete can be added later)
- Comment count updates immediately after deletion
- Confirmation dialog recommended before deletion

### 2.4 Comment Text Validation

**Minimum Length:** 1 character (at least one non-whitespace character)

**Maximum Length:** 500 characters

**Content Validation:**
- Trim leading/trailing whitespace
- Reject empty comments or comments with only whitespace
- Sanitize HTML/XSS attacks (escape special characters)
- Prevent SQL injection (using parameterized queries with MongoDB)

**Validation Rules:**
- Text must be a string
- Text cannot be null or undefined
- No embedded scripts or malicious content allowed

### 2.5 Comment Count Display

**Display Location:**
- Comment button badge showing total comment count
- Text display: "{count} comments" in post footer
- Both update in real-time

**Count Calculation:**
- Total count of all comments for a post
- Excludes deleted comments (if soft delete implemented later)
- Updates immediately when:
  - New comment is added
  - Comment is deleted
  - Real-time polling updates the count

**Format:**
- Show actual number (e.g., "5 comments")
- Show "0 comments" when no comments exist
- Badge on Comment button (if count > 0)

---

## 3. Non-Functional Requirements

### 3.1 Performance

**Response Times:**
- **Comment Submission:** < 500ms (95th percentile)
- **Comment Fetching:** < 200ms for first 20 comments
- **Load More:** < 300ms for next batch
- **Comment Count Update:** < 100ms

**Real-Time Update Latency:**
- Polling interval: **5 seconds** for comment updates
- Optimistic UI updates: Immediate visual feedback before server confirmation
- Server confirmation: Within 500ms

**Database Optimization:**
- Index on `postId` for fast comment queries
- Index on `createdAt` for sorting
- Index on `userId` for ownership checks

### 3.2 Scalability

**1000+ Concurrent Users:**
- **Database Connection Pooling:** MongoDB connection pooling enabled
- **Caching Strategy:** Consider Redis caching for frequently accessed post comment counts (future enhancement)
- **API Rate Limiting:** Implement per-user rate limits (e.g., 10 comments/minute per user)
- **Load Balancing:** Stateless API design allows horizontal scaling
- **Database Sharding:** Consider sharding by `postId` if comment volume grows (future)

**Current Architecture Support:**
- Stateless API routes (Next.js API routes)
- MongoDB native driver with connection pooling
- Client-side polling reduces server load compared to WebSockets

### 3.3 Security

**Authentication Checks:**
- All comment operations require valid JWT token in httpOnly cookie
- Token verification on every API request
- Unauthenticated users cannot:
  - Add comments
  - Delete comments
  - View comment counts (if desired for privacy)

**Data Validation:**
- Server-side validation using Zod schema
- Input sanitization to prevent XSS
- Parameterized queries (MongoDB prevents injection)
- User ID extraction from JWT (not from client input)

**XSS Prevention:**
- HTML entities escaping (e.g., `<` becomes `&lt;`)
- No raw HTML rendering in comments
- Content Security Policy (CSP) headers
- DOMPurify library can be added for advanced sanitization

**Authorization:**
- Users can only delete their own comments
- Server-side ownership verification before deletion
- Post ID validation (ensure post exists)

**Error Handling:**
- Do not expose internal errors to clients
- Generic error messages for unauthorized actions
- Log errors server-side for debugging

### 3.4 Reliability

**Error Handling:**
- **Network Failures:** Retry logic for failed requests (up to 3 retries)
- **Database Errors:** Graceful error messages, log errors server-side
- **Validation Errors:** Clear user-friendly error messages
- **Authentication Errors:** Redirect to login or show "Please log in" message

**Data Consistency:**
- Atomic operations for comment creation/deletion
- Transaction support for related operations (if needed)
- Comment count calculated from actual database count (not cached, initially)

**Offline Scenarios:**
- Optimistic UI updates stored in local state
- Queue failed requests for retry when online
- Show offline indicator when network unavailable
- Sync pending comments when connection restored

**Database Failures:**
- Connection retry logic
- Graceful degradation (show cached data if available)
- Health check endpoints

### 3.5 Usability

**Loading States:**
- Skeleton loaders while fetching comments
- Spinner on "Load More" button during fetch
- Disable submit button while comment is being posted
- Show "Posting..." feedback

**User Feedback:**
- Success toast notification after comment submission
- Error toast for failed submissions
- Immediate visual update (optimistic UI)
- Clear error messages (not technical jargon)

**Accessibility Considerations:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management when comments section opens
- Screen reader announcements for new comments
- Color contrast compliance (WCAG AA)
- Button states clearly indicated

**User Experience:**
- Smooth expand/collapse animation for comments section
- Auto-focus on comment input when section expands
- Auto-scroll to newly added comment
- Clear visual distinction between user's comments and others

---

## 4. Technical Implementation

### 4.1 Database Schema

**Comments Collection:**
```javascript
{
  _id: ObjectId,
  postId: String,        // Reference to post.id (from static posts)
  userId: ObjectId,       // Reference to users._id
  username: String,       // Denormalized from users.username
  text: String,           // 1-500 characters, sanitized
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ postId: 1, createdAt: -1 }` - Compound index for querying comments by post, sorted by date
- `{ userId: 1 }` - For ownership verification
- `{ createdAt: -1 }` - For sorting

### 4.2 API Endpoints

**GET /api/comment?postId={postId}&page={page}&limit={limit}**
- Fetches comments for a specific post
- Supports pagination
- Returns: Array of comments with user info
- Requires: Authentication (optional, but recommended)

**POST /api/comment**
- Creates a new comment
- Body: `{ postId: string, text: string }`
- Returns: Created comment object
- Requires: Authentication

**DELETE /api/comment/{commentId}**
- Deletes a comment
- Returns: Success message
- Requires: Authentication + Ownership verification

**GET /api/comment/count?postId={postId}**
- Fetches comment count for a post
- Returns: `{ count: number }`
- Requires: Authentication (optional)

### 4.3 Frontend Components

**Components:**
- `CommentSection` - Container for comments and input
- `CommentList` - Displays list of comments with pagination
- `CommentItem` - Individual comment card
- `CommentForm` - Input form for adding comments
- `CommentCountBadge` - Badge showing comment count

**State Management:**
- Local state for comments list
- Optimistic updates for new comments
- Polling interval for real-time updates

### 4.4 Real-Time Updates

**Polling Strategy:**
- Poll every 5 seconds when comments section is open
- Poll only for visible posts (performance optimization)
- Stop polling when section is collapsed or user navigates away
- Exponential backoff on errors

**Optimistic Updates:**
- Immediately add comment to UI upon submission
- Revert if server request fails
- Show loading state during submission

### 4.5 Error Handling

**Client-Side:**
- Try-catch blocks around API calls
- User-friendly error messages
- Retry logic for failed requests
- Offline detection

**Server-Side:**
- Validation using Zod schemas
- Authentication middleware
- Error logging (console.log for now, can upgrade to proper logger)
- Standardized error response format

---

## 5. Future Enhancements

1. **Comment Editing:** Allow users to edit their comments
2. **Nested Replies:** Multi-level comment threading
3. **Comment Reactions:** Like comments, emoji reactions
4. **Mention Notifications:** @mention users in comments
5. **WebSocket Updates:** Real-time updates via WebSockets instead of polling
6. **Comment Moderation:** Admin tools for comment moderation
7. **Rich Text Comments:** Support for markdown or rich text
8. **Comment Search:** Search within comments
9. **Comment Sorting Options:** Oldest first, most liked, etc.
10. **Soft Delete:** Recoverable comment deletion

---

## 6. Acceptance Criteria

✅ Users can add comments to any post  
✅ Comments are displayed under posts in newest-first order  
✅ Commenter's username and timestamp are shown  
✅ Comment count badge appears on Comment button  
✅ Users can delete their own comments only  
✅ Text validation enforces 1-500 character limit  
✅ XSS prevention through sanitization  
✅ Real-time updates via polling (5-second interval)  
✅ Pagination supports loading 20 comments at a time  
✅ Loading states and error handling implemented  
✅ Accessible and responsive UI
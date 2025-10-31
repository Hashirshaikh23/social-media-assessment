# Improvements & Future Enhancements

## Current Version Summary
Implemented the **Comments Feature** for the assessment:
- Users can add and delete comments
- Real-time comment count updates (polling every 5 seconds)
- Validation, XSS prevention, and optimistic UI

---

## Known Limitations
- No comment editing (to keep MVP simple)
- No nested replies (single-level only)
- Real-time updates use polling, not WebSockets
- No caching layer (MongoDB direct queries)

---

## Future Enhancements
1. **Edit Comments** – Allow users to edit their own comments.
2. **Nested Replies** – Add threaded discussions for better engagement.
3. **WebSocket Updates** – Switch from polling to socket-based real-time updates.
4. **Comment Reactions** – Add emoji/like reactions to comments.
5. **Soft Delete** – Option to restore deleted comments.
6. **Mention Notifications** – Notify users when mentioned with “@username”.
7. **Admin Moderation** – Allow admin to hide or report comments.
8. **Performance** – Add caching or indexing for high-volume posts.

---

## Testing Notes
- Validated CRUD operations manually on `/feed`
- Tested authentication-protected API routes
- Verified XSS-safe rendering using escaped text
- Verified count badge and delete feature behavior
# Social Media Assessment
_~ By Vanixqbit LLP_

**Time Estimation: 8-10 hours**

## Project Requirement

Build three social media features on existing codebase: real-time Likes with live count updates, single-level Comments system, and Bookmarks with localStorage-database sync. Authenticated users interact with 6 posts. Document business/functional/non-functional requirements before implementation.

## Overview

You will be building three core social media features on top of an existing codebase:

1. Likes (with real-time updates)
2. Comments (single-level hierarchy)
3. Bookmarks (with localStorage + database sync)

## Base Code Provided

You will receive a starter repository containing:

### Frontend

- 6 sample posts (each with text content and an image)
- UI structure with like, comment, and bookmark icons for each post
Authentication flow (Register/Login) already implemented
- Basic routing and state management setup

### Backend

- Database configuration (MongoDB setup using mongoose)
- User authentication system (JWT/Session-based)
- Basic API structure and middleware
- User model with authentication endpoints

### Access Control

- Only registered and logged-in users can perform likes, comments, and bookmarks
- Users can interact with all 6 posts once authenticated

## Part 1: Requirements Documentation

Before writing any code, document the following:

### 1.1 Business Requirements

For each feature (Likes, Comments, Bookmarks), define:

- **Business Goal:** What value does this feature provide to users and the platform?
- **Success Metrics:** How would you measure if this feature is successful?

### 1.2 Functional Requirements

Document each functional requirements for each feature in brief:

#### Likes Feature

- What happens when a user clicks the like button?
- How should the like count be displayed?
- Can users unlike a post?
- How should real-time updates work across different users?
- What should happen if a user is not authenticated?

#### Comments Feature

- What information should be captured in a comment?
- How should comments be displayed (ordering, pagination)?
- Can users edit/delete their own comments?
- What validations are needed for comment text?
- How should comment counts be displayed?

#### Bookmarks Feature

- How should bookmarks be stored locally and in the database?
- When should sync occur between localStorage and database?
- What happens when a user logs in from a different device?
- How should users view their bookmarked posts?
- What happens if sync fails?

### 1.3 Non-Functional Requirements

Document each non-functional requirements for each feature in brief:

- Performance: Expected response times, real-time update latency
- Scalability: How should the system handle 1000+ concurrent users?
- Security: Authentication checks, data validation, XSS prevention
- Reliability: Error handling, data consistency, offline scenarios
- Usability: Loading states, user feedback, accessibility considerations

**Deliverable: A document (PDF/Markdown) with all requirement specifications**

## Part 2: Feature Implementation

### 2.1 Likes Feature (Real-time)

#### Core Requirements

- Users can like/unlike any post
- Like count updates in real-time for all users viewing the post
- Visual indication if current user has liked the post
- Optimistic UI updates (instant feedback)
- Persist likes in database

#### Technical Considerations

- Implement updates using REST APIs
- Handle race conditions (multiple users liking simultaneously)
- Efficient query for checking if user has liked a post
- Consider debouncing rapid clicks

### 2.2 Comments Feature

#### Core Requirements

- Users can add comments to any post
- Display all comments under the post (single-level, like Instagram)
- Show commenter's username and timestamp
- Comment count badge on the comment icon
- Users can delete their own comments

#### Technical Considerations

- Text validation (minimum/maximum length, sanitization)
- Proper database relationships (user-comment-post)
- Sorting (newest first or oldest first)
- Real-time comment updates (optional but bonus)

### 2.3 Bookmarks Feature

#### Core Requirements

- Users can bookmark/unbookmark posts
- Bookmarks stored in localStorage for instant access
- Bookmarks synced with database for persistence
- Visual indicator on bookmarked posts
- Sync on login/logout and periodically
- Conflict resolution (localStorage vs database)

#### Technical Considerations

- localStorage structure and management
- Sync strategy (when to sync: on bookmark action, on page load, periodic intervals)
- Handle sync failures gracefully
- Merge strategy if localStorage and database differ
- Optional: Create a "Bookmarked Posts" view page

## Instructions

Provide clear instructions on:

- Environment setup steps
- How to install dependencies
- How to run the application (frontend and backend)
- Any environment variables needed
- How to test each feature

## Submission Requirements

### What to Submit

1. Requirements Document (Part 1)

    - Format: PDF or Markdown
    - Filename: requirements_[yourname].pdf

2. Complete Codebase (Part 2)

    - Public GitHub repository link
    - Must include all your changes with proper git history

3. Documentation (Part 3)

    - README.md with setup and run instructions
    - IMPROVEMENTS.md with known issues and future enhancements

### Submission Format

Email the document and github URL to: [sales@vanixqbit.com](sales@vanixqbit.com)

Subject: Freelancer Assessment - [Your Name]

### Next Steps

After submission, the team will reach out to you (if selected) and discuss the approaches and what you have made on a 30 minutes _Google Meet._
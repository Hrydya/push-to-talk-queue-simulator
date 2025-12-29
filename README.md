# 🎤 Push-to-Talk Queue Simulator

A real-time web application that simulates push-to-talk (PTT) communication with turn-based queue management. Users join a channel, request to speak, and get queued for their turn while seeing live updates of the current speaker and waiting list.

## ✨ Features

- **Real-time Communication**: Instant updates using Socket.IO WebSockets
- **Turn-Based Queue**: Fair speaker management with visual queue display
- **User Authentication**: Secure login/registration with JWT tokens
- **Live Status Updates**: All users see current speaker and queue in real-time
- **Responsive Design**: Works on desktop and mobile devices
- **Session Management**: Handles user disconnection and queue cleanup

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript

**Backend:**
- Node.js with Express.js
- Socket.IO for real-time communication
- JWT for authentication
- bcrypt for password hashing

**Database:**
- MongoDB with Mongoose ODM

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- Modern web browser

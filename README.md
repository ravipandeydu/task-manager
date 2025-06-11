# Natural Language Task Manager

A full-stack application that allows users to create and manage tasks using natural language input. The application parses natural language commands like "Finish landing page Aman by 11pm 20th June" and extracts structured data (task title, assignee, due date, and priority).

## Features

- **Natural Language Input**: Add tasks using simple English commands
- **AI-Powered Parsing**: Use OpenAI to enhance natural language understanding
- **Automatic Parsing**: Extracts task title, assignee, due date/time, and priority
- **Task Management**: View, edit, and delete tasks
- **Filtering & Sorting**: Sort by due date or priority, filter by assignee or priority
- **Responsive UI**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React (via Vite)
- Tailwind CSS for styling
- Axios for API requests
- date-fns for date formatting

### Backend

- Node.js and Express
- MongoDB with Mongoose
- Natural Language Processing:
  - chrono-node for date parsing
  - Regular expressions for priority and assignee extraction
  - OpenAI integration for enhanced parsing
- Jest and Supertest for testing

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── Dockerfile          # Frontend Docker configuration
│   └── nginx.conf          # Nginx configuration for production
│
├── server/                 # Backend Express application
│   ├── controllers/        # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── tests/              # Test files
│   ├── utils/              # Utility functions (including NLP parser)
│   ├── Dockerfile          # Backend Docker configuration
│   └── .env                # Environment variables
│
└── docker-compose.yml      # Docker Compose configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or remote)
- OpenAI API key (for AI-powered parsing)

### Installation

1. Clone the repository

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   NODE_ENV=development
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

#### Development Mode

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

#### Production Mode with Docker

1. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

2. Open your browser and navigate to `http://localhost`

## API Endpoints

- `POST /api/tasks` - Create a new task using standard parsing
- `POST /api/tasks/ai` - Create a new task using AI-powered parsing
- `GET /api/tasks` - Get all tasks (with optional filtering)
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Testing

Run the tests for the server:

```bash
cd server
npm test
```

## Natural Language Parsing Examples

- "Finish landing page Aman by 11pm 20th June P1"
  - Title: "Finish landing page"
  - Assignee: "Aman"
  - Due Date: June 20th, 11:00 PM
  - Priority: P1

- "Call client Rajeev tomorrow 5pm"
  - Title: "Call client"
  - Assignee: "Rajeev"
  - Due Date: Tomorrow at 5:00 PM
  - Priority: P3 (default)

## AI-Powered Parsing

The application offers two parsing methods:

1. **Standard Parsing**: Uses chrono-node and regex patterns to extract task details
2. **AI-Powered Parsing**: Uses OpenAI to understand natural language more accurately

To use AI-powered parsing:
1. Set your OpenAI API key in the server's `.env` file
2. Check the "Use AI-powered parsing" option in the task form

## License

This project is licensed under the MIT License.
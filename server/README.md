# Natural Language Task Manager - Server

## Project Structure

The server code has been restructured into a `src` directory for better organization:

```
server/
├── src/
│   ├── controllers/
│   │   ├── aiTaskController.js
│   │   └── taskController.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── nlpParser.js
│   │   └── openaiParser.js
│   └── server.js
├── tests/
│   ├── nlpParser.test.js
│   ├── openaiParser.test.js
│   └── taskApi.test.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Server

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

### Testing

```bash
npm test
```

## API Endpoints

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a task by ID
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/ai` - Create a task using AI parsing
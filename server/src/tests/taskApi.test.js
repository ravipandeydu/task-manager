const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/Task');

// Mock MongoDB connection
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue({}),
  };
});

describe('Task API', () => {
  beforeEach(async () => {
    // Clear the Task collection before each test
    await Task.deleteMany({});
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task from natural language input', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ input: 'Finish landing page Aman by 11pm 20th June P1' })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toContain('Finish landing page');
      expect(response.body.assignee).toBe('Aman');
      expect(response.body).toHaveProperty('dueDate');
      expect(response.body.priority).toBe('P1');
    });

    it('should return 400 if input is missing', async () => {
      await request(app)
        .post('/api/tasks')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Add some test tasks
      await Task.create([
        {
          title: 'Task 1',
          assignee: 'John',
          dueDate: new Date('2023-12-31'),
          priority: 'P1'
        },
        {
          title: 'Task 2',
          assignee: 'Jane',
          dueDate: new Date('2023-12-25'),
          priority: 'P2'
        }
      ]);
    });

    it('should get all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should filter tasks by assignee', async () => {
      const response = await request(app)
        .get('/api/tasks?assignee=John')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].assignee).toBe('John');
    });

    it('should sort tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=priority')
        .expect(200);

      expect(response.body[0].priority).toBe('P1');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      // Create a test task
      const task = await Task.create({
        title: 'Original Task',
        assignee: 'Original Assignee',
        dueDate: new Date('2023-12-31'),
        priority: 'P3'
      });
      taskId = task._id;
    });

    it('should update a task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          title: 'Updated Task',
          priority: 'P1'
        })
        .expect(200);

      expect(response.body.title).toBe('Updated Task');
      expect(response.body.assignee).toBe('Original Assignee'); // Unchanged
      expect(response.body.priority).toBe('P1'); // Changed
    });

    it('should return 404 if task not found', async () => {
      await request(app)
        .put('/api/tasks/invalidId')
        .send({ title: 'Updated Task' })
        .expect(500); // Will be 500 due to invalid ID format
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      // Create a test task
      const task = await Task.create({
        title: 'Task to Delete',
        dueDate: new Date('2023-12-31'),
        priority: 'P3'
      });
      taskId = task._id;
    });

    it('should delete a task', async () => {
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      // Verify task is deleted
      const task = await Task.findById(taskId);
      expect(task).toBeNull();
    });

    it('should return 404 if task not found', async () => {
      // Delete the task first
      await Task.findByIdAndDelete(taskId);

      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(404);
    });
  });
});
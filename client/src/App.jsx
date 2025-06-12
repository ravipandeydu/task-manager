import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import TaskForm from "./components/TaskForm";
import ManualTaskForm from "./components/ManualTaskForm";
import TaskList from "./components/TaskList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [activeTab, setActiveTab] = useState("natural");

  const API_URL = "http://localhost:5000/api";

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/tasks`;

      // Add query parameters for filtering and sorting
      const params = new URLSearchParams();
      if (sortBy) params.append("sortBy", sortBy);
      if (filterAssignee) params.append("assignee", filterAssignee);
      if (filterPriority) params.append("priority", filterPriority);
      if (searchTerm) params.append("search", searchTerm); // Add search term to params

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new task using standard parser
  const createTask = async (input) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, { input });
      setTasks([response.data, ...tasks]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating task:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create task",
      };
    }
  };

  // Create a new task using AI parser
  const createTaskWithAI = async (input) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/ai`, { input });
      setTasks([response.data.task, ...tasks]);
      return { success: true, data: response.data.task, aiParsed: true };
    } catch (err) {
      console.error("Error creating task with AI:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create task with AI",
      };
    }
  };

  // Create a new task manually (without parsing)
  const createManualTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/manual`, taskData);
      setTasks([response.data, ...tasks]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating manual task:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create task",
      };
    }
  };

  // Update a task
  const updateTask = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, updatedData);
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating task:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update task",
      };
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting task:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete task",
      };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [sortBy, filterAssignee, filterPriority, searchTerm]); // Add searchTerm to dependency array

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Natural Language Task Manager
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full mx-auto mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 glass rounded-xl p-1">
            <TabsTrigger value="natural" className="rounded-lg text-white font-medium">Natural Language Input</TabsTrigger>
            <TabsTrigger value="manual" className="rounded-lg text-white font-medium">Manual Input</TabsTrigger>
          </TabsList>
          <TabsContent value="natural" className="mt-4">
            <TaskForm onSubmit={createTask} onSubmitWithAI={createTaskWithAI} />
          </TabsContent>
          <TabsContent value="manual" className="mt-4">
            <ManualTaskForm onSubmit={createManualTask} />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card className="mb-6 glass-card border-0">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Filter & Sort</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {/* Search input field */}
                <div className="w-full mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Tasks:
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg glass border-0 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 placeholder-gray-500 text-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort by:
                  </label>
                  <select
                    className="rounded-lg glass border-0 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-800"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Assignee:
                  </label>
                  <input
                    type="text"
                    className="rounded-lg glass border-0 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 placeholder-gray-500 text-gray-800"
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                    placeholder="Enter assignee name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Priority:
                  </label>
                  <select
                    className="rounded-lg glass border-0 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-800"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                    <option value="P3">P3</option>
                    <option value="P4">P4</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="glass-card border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <Card className="glass-card border-0">
              <CardContent className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-700">Loading tasks...</p>
              </CardContent>
            </Card>
          ) : (
            <TaskList
              tasks={tasks}
              formatDate={formatDate}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

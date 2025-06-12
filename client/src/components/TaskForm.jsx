import { useState } from "react";

const TaskForm = ({ onSubmit, onSubmitWithAI }) => {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter a task");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use AI parser if the toggle is on, otherwise use standard parser
      const result =
        useAI && onSubmitWithAI
          ? await onSubmitWithAI(input)
          : await onSubmit(input);

      if (result.success) {
        setInput("");
        setSuccess(true);

        // Show different success message based on parser used
        const successMessage = result.aiParsed
          ? "Task created successfully with AI!"
          : "Task created successfully!";

        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="taskInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter your task in natural language:
          </label>
          <div className="text-xs text-gray-500 mb-2">
            Example: "Finish landing page Aman by 11pm 20th June P1" or "Call
            client Rajeev tomorrow 5pm"
          </div>
          <input
            id="taskInput"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task details..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            id="useAI"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
            disabled={isSubmitting}
          />
          <label htmlFor="useAI" className="ml-2 block text-sm text-gray-900">
            Use AI-powered parsing (OpenAI)
          </label>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
            {useAI
              ? "Task created successfully with AI!"
              : "Task created successfully!"}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Adding Task..."
            : useAI
            ? "Add Task with AI"
            : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

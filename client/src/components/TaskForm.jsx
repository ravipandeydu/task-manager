import { useState } from "react";

const TaskForm = ({ onSubmitWithAI }) => {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      const result = await onSubmitWithAI(input);

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
    <div className="glass-card p-4 sm:p-6 border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="taskInput"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 glass border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-gray-800 text-sm"
            placeholder="Enter task details..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 glass border-red-300 text-red-700 rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 glass border-green-300 text-green-700 rounded-lg text-xs sm:text-sm">
            {"Task created successfully!"}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2 sm:py-3 px-4 rounded-lg text-white font-medium backdrop-blur-sm text-sm sm:text-base ${isSubmitting ? "bg-blue-400/70" : "bg-blue-500/70 hover:bg-blue-600/70 transition-all duration-200 shadow-lg"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

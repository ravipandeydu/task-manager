import { useState } from "react";

const ManualTaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    assignee: "",
    dueDate: "",
    priority: "P3",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create task object
      const taskData = {
        title: formData.title,
        assignee: formData.assignee,
        dueDate: new Date(formData.dueDate),
        priority: formData.priority,
      };

      const result = await onSubmit(taskData);

      if (result.success) {
        // Reset form
        setFormData({
          title: "",
          assignee: "",
          dueDate: "",
          priority: "P3",
        });
        setSuccess(true);
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
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Add Task Manually</h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Task Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 glass border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-gray-800 text-sm"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label
            htmlFor="assignee"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Assignee
          </label>
          <input
            id="assignee"
            name="assignee"
            type="text"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 glass border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-gray-800 text-sm"
            placeholder="Enter assignee name"
            value={formData.assignee}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Due Date/Time *
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 glass border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 glass border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm"
            value={formData.priority}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
        </div>

        {error && (
          <div className="p-2 sm:p-3 glass border-red-300 text-red-700 rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-2 sm:p-3 glass border-green-300 text-green-700 rounded-lg text-xs sm:text-sm">
            Task created successfully!
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

export default ManualTaskForm;
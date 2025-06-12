import { useState } from "react";
import { TableRow, TableCell } from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

const TaskItem = ({
  task,
  formatDate,
  getPriorityColor,
  isEditing,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) => {
  const [editData, setEditData] = useState({
    title: task.title,
    assignee: task.assignee || "",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().slice(0, 16)
      : "",
    priority: task.priority,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!editData.title.trim()) {
        setError("Task title is required");
        setIsSubmitting(false);
        return;
      }

      if (!editData.dueDate) {
        setError("Due date is required");
        setIsSubmitting(false);
        return;
      }

      const result = await onSaveEdit(task._id, {
        title: editData.title,
        assignee: editData.assignee,
        dueDate: new Date(editData.dueDate),
        priority: editData.priority,
      });

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error saving task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await onDelete(task._id);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isEditing) {
    return (
      <TableRow className="glass border-b border-blue-100">
        <TableCell colSpan="5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 glass border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 glass border-0 rounded-lg focus:outline-none focus:ring-blue-400 focus:border-blue-400 text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <input
                type="text"
                name="assignee"
                value={editData.assignee}
                onChange={handleChange}
                className="w-full px-3 py-2 glass border-0 rounded-lg focus:outline-none focus:ring-blue-400 focus:border-blue-400 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date/Time
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={editData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 glass border-0 rounded-lg focus:outline-none focus:ring-blue-400 focus:border-blue-400 text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={editData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 glass border-0 rounded-lg focus:outline-none focus:ring-blue-400 focus:border-blue-400 text-gray-800"
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2 glass bg-gray-200/50 text-gray-700 rounded-lg hover:bg-gray-300/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500/70 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="hover:bg-white/20 transition-colors duration-200">
      <TableCell>
        <div className="text-sm font-medium text-gray-800">{task.title}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {task.assignee ? (
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {getInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
          ) : null}
          <span className="text-sm text-gray-500">{task.assignee || "-"}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-500">{formatDate(task.dueDate)}</div>
      </TableCell>
      <TableCell>
        <Badge className={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <button
          onClick={onEdit}
          className="px-3 py-1 glass bg-blue-100/50 text-blue-600 rounded-lg hover:bg-blue-200/50 transition-all duration-200 mr-3"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 glass bg-red-100/50 text-red-600 rounded-lg hover:bg-red-200/50 transition-all duration-200"
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  );
};

export default TaskItem;

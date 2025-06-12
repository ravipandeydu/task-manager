import { useState } from "react";
import TaskItem from "./TaskItem";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const TaskList = ({ tasks, formatDate, onUpdate, onDelete }) => {
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask(task._id);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveEdit = async (id, updatedData) => {
    const result = await onUpdate(id, updatedData);
    if (result.success) {
      setEditingTask(null);
    }
    return result;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "P1":
        return "bg-red-100 text-red-800";
      case "P2":
        return "bg-orange-100 text-orange-800";
      case "P3":
        return "bg-blue-100 text-blue-800";
      case "P4":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="glass-card border-0 shadow-glass">
        <CardContent className="p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-gray-700">
            No tasks found. Add a new task to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-0 shadow-glass">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg text-gray-800">Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%] sm:w-[40%]">Task</TableHead>
                  <TableHead className="hidden sm:table-cell">Assigned To</TableHead>
                  <TableHead className="hidden sm:table-cell">Due Date/Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    formatDate={formatDate}
                    getPriorityColor={getPriorityColor}
                    isEditing={editingTask === task._id}
                    onEdit={() => handleEdit(task)}
                    onCancelEdit={handleCancelEdit}
                    onSaveEdit={handleSaveEdit}
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;

"use client";

import { Task } from "../lib/types";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

export default function TaskList({ tasks, onTaskUpdated }: TaskListProps) {
  const handleToggle = async (task: Task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      onTaskUpdated();
    } catch (err) {
      console.error("Toggle task error:", err);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskUpdated();
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li key={task._id} className={styles.item}>
          <div>
            <h3 className={task.completed ? styles.completed : ""}>
              {task.title}
            </h3>
            {task.description && <p>{task.description}</p>}
            <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
          <div className={styles.actions}>
            <button
              onClick={() => handleToggle(task)}
              className={styles.toggleButton}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              onClick={() => handleDelete(task._id!)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

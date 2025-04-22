"use client";

import { useState } from "react";
import { Task } from "../lib/types";
import styles from "./TaskForm.module.css";

interface TaskFormProps {
  onTaskAdded: () => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, completed: false }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        onTaskAdded();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add task");
      }
    } catch (err) {
      console.error("Add task error:", err);
      setError("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
        className={styles.input}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        className={styles.textarea}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Add Task
      </button>
    </form>
  );
}

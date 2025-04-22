"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import { Task } from "../../lib/types";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch tasks");
        if (errorData.error === "Unauthorized") {
          localStorage.removeItem("token");
          document.cookie = "token=; Max-Age=0; path=/";
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError("An error occurred while fetching tasks");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>TODO Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
      <TaskForm onTaskAdded={fetchTasks} />
      {error && <p className={styles.error}>{error}</p>}
      <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
    </div>
  );
}

import './App.css'

import { useState, useEffect } from "react";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        if (!token) return;
        // run only once on initial load
        fetchTasks();
    }, [token]);

    async function login() {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            fetchTasks(data.token);
        } else {
            alert("Login failed");
        }
    }

    async function fetchTasks(authToken = token) {
        try {
            console.log("Fetching tasks with token:", authToken);
            const res = await fetch("/api/tasks", {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (!res.ok) {
                console.error("Failed to fetch tasks:", res.status);
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    setToken("");
                }
                return;
            }

            const data = await res.json();
            console.log("Tasks fetched:", data);
            setTasks(data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    }

    async function addTask() {
        if (!newTask) return;
        await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: newTask }),
        });
        setNewTask("");
        fetchTasks();
    }

    async function toggleComplete(id, completed) {
        await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ completed }),
        });
        fetchTasks();
    }

    async function deleteTask(id) {
        await fetch(`/api/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTasks();
    }

    if (!token) {
        return (
            <div className="login">
                <h2>Login</h2>
                <div className="login__form">
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={login}>Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="task-app">
            <h1>Task Manager</h1>
            <input
                placeholder="New task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTask}>Add</button>

            <ul>
                {tasks.length === 0 && <li>No tasks yet</li>}
                {tasks.map((t) => (
                    <li key={t._id}>
                        {t.title} {t.completed ? "✅" : ""}
                        <div className="buttons">
                        <button onClick={() => toggleComplete(t._id, !t.completed)}>
                            {t.completed ? "Undo" : "Complete"}
                        </button>
                        <button onClick={() => deleteTask(t._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;



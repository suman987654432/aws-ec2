import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://16.16.91.9:5000"
).replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/api/todos`;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title,
      });

      setTodos([response.data, ...todos]);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo._id}`, {
        completed: !todo.completed,
      });

      setTodos(
        todos.map((item) =>
          item._id === todo._id ? response.data : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>Todo App</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Enter todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      <div>
        {todos.map((todo) => (
          <div
            key={todo._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />

            <span
              style={{
                textDecoration: todo.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {todo.title}
            </span>

            <button onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
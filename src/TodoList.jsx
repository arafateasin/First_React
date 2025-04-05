import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("My Day");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track the task being edited
  const [editedTask, setEditedTask] = useState({}); // Store the edited task details

  const handleAddTask = () => {
    if (newTodo.trim() === "" || !dueDate || !time) {
      alert("Please fill in all fields (task, date, and time).");
      return;
    }

    const taskId = uuidv4();
    setTodos((prevTodos) => [
      ...prevTodos,
      {
        task: newTodo,
        id: taskId,
        dueDate,
        time,
        category,
        priority,
        done: false,
        important: activeTab === "Important",
        assignedToMe: activeTab === "Assigned to Me",
      },
    ]);

    setNewTodo("");
    setDueDate(null);
    setTime("");
    setCategory("Work");
    setPriority("Medium");
  };

  const handleDeleteTask = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleMarkAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleEditTask = (todo) => {
    setEditingTaskId(todo.id); // Set the task being edited
    setEditedTask({ ...todo }); // Pre-fill the input with the current task details
  };

  const handleSaveTask = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, ...editedTask } : todo
      )
    );
    setEditingTaskId(null); // Exit edit mode
    setEditedTask({}); // Clear the edited task input
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (activeTab === "My Day") return true;
      if (activeTab === "Important") return todo.important;
      if (activeTab === "Planned") return todo.dueDate;
      if (activeTab === "Assigned to Me") return todo.assignedToMe;
      return true;
    })
    .filter((todo) =>
      todo.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const completedTasks = todos.filter((todo) => todo.done).length;
  const totalTasks = todos.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="todo-app">
      <aside className="sidebar">
        <h2 className="sidebar-header">Todo</h2>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeTab === "My Day" ? "active" : ""}`}
            onClick={() => setActiveTab("My Day")}
          >
            My Day
          </li>
          <li
            className={`sidebar-item ${
              activeTab === "Important" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Important")}
          >
            Important
          </li>
          <li
            className={`sidebar-item ${
              activeTab === "Planned" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Planned")}
          >
            Planned
          </li>
          <li
            className={`sidebar-item ${
              activeTab === "Assigned to Me" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Assigned to Me")}
          >
            Assigned to Me
          </li>
          <li
            className={`sidebar-item ${activeTab === "Tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("Tasks")}
          >
            Tasks
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <h2 className="main-header">{activeTab}</h2>
        <div className="todo-input-container">
          <input
            type="text"
            placeholder="Add a task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input"
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            placeholderText="Select due date"
            className="todo-input"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="todo-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="todo-input"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="todo-input"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button onClick={handleAddTask} className="todo-button">
            Add Task
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="todo-input"
        />

        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progress}%`, backgroundColor: "#28a745" }}
          ></div>
        </div>

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
              {editingTaskId === todo.id ? (
                <div>
                  <input
                    type="text"
                    value={editedTask.task}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, task: e.target.value })
                    }
                    className="todo-input"
                  />
                  <DatePicker
                    selected={new Date(editedTask.dueDate)}
                    onChange={(date) =>
                      setEditedTask({ ...editedTask, dueDate: date })
                    }
                    className="todo-input"
                  />
                  <input
                    type="time"
                    value={editedTask.time}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, time: e.target.value })
                    }
                    className="todo-input"
                  />
                  <select
                    value={editedTask.category}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, category: e.target.value })
                    }
                    className="todo-input"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                  <select
                    value={editedTask.priority}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, priority: e.target.value })
                    }
                    className="todo-input"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button
                    onClick={() => handleSaveTask(todo.id)}
                    className="save-button"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: todo.done ? "line-through" : "none",
                    }}
                  >
                    {todo.task} - {todo.category} - {todo.priority} - Due:{" "}
                    {todo.dueDate.toLocaleDateString()} at {todo.time}
                  </span>
                  <div>
                    <button
                      onClick={() => handleMarkAsDone(todo.id)}
                      className="done-button"
                    >
                      {todo.done ? "Undo" : "Done"}
                    </button>
                    <button
                      onClick={() => handleEditTask(todo)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(todo.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

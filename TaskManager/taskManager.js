const fs = require("fs").promises;

const FILE = "tasks.json";

// Read Tasks
async function loadTasks() {
  try {
    const data = await fs.readFile(FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Save Tasks
async function saveTasks(tasks) {
  await fs.writeFile(FILE, JSON.stringify(tasks, null, 2));
}

// Add Task
async function addTask(title, description) {
  const tasks = await loadTasks();

  const task = {
    id: Date.now(),
    title,
    description,
    status: "pending"
  };

  tasks.push(task);
  await saveTasks(tasks);

  console.log("Task Added Successfully!");
}

// View Tasks
async function viewTasks() {
  const tasks = await loadTasks();

  if (tasks.length === 0) {
    console.log("No Tasks Found");
    return;
  }

  console.table(tasks);
}

// Complete Task
async function completeTask(id) {
  const tasks = await loadTasks();

  const task = tasks.find(t => t.id == id);

  if (!task) {
    console.log("Task Not Found");
    return;
  }

  task.status = "completed";

  await saveTasks(tasks);

  console.log("Task Marked Completed!");
}

// Delete Task
async function deleteTask(id) {
  const tasks = await loadTasks();

  const updatedTasks = tasks.filter(t => t.id != id);

  await saveTasks(updatedTasks);

  console.log("Task Deleted!");
}

// Command Line Arguments
const action = process.argv[2];

(async () => {
  switch (action) {
    case "add":
      await addTask(process.argv[3], process.argv[4]);
      break;

    case "view":
      await viewTasks();
      break;

    case "complete":
      await completeTask(process.argv[3]);
      break;

    case "delete":
      await deleteTask(process.argv[3]);
      break;

    default:
      console.log(`
Usage:
node taskManager.js add "Title" "Description"
node taskManager.js view
node taskManager.js complete ID
node taskManager.js delete ID
      `);
  }
})();
// ---------- Constants ----------
const STORAGE_KEY = "taskPortalTasks";
const STATUSES = ["Pending", "In Progress", "Completed"];

// Mock data (pehli baar page khulne par ye tasks dikhenge)
const defaultTasks = [
  {
    id: 1,
    title: "Set up Git and GitHub",
    description: "Install Git, create a GitHub account and push the first commit.",
    priority: "High",
    deadline: "2026-10-02",
    status: "Completed",
  },
  {
    id: 2,
    title: "Build task portal UI",
    description: "Create the responsive HTML and CSS for the internship task portal.",
    priority: "High",
    deadline: "2026-10-05",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Write README.md",
    description: "Document setup steps, features, usage and known limitations.",
    priority: "Medium",
    deadline: "2026-10-07",
    status: "Pending",
  },
  {
    id: 4,
    title: "Prepare 1-2 page report",
    description: "Explain the approach, key decisions, challenges and improvements.",
    priority: "Low",
    deadline: "2026-10-09",
    status: "Pending",
  },
];

// ---------- DOM elements ----------
const taskListEl = document.getElementById("taskList");
const emptyMessageEl = document.getElementById("emptyMessage");
const summaryEl = document.getElementById("summary");
const filterStatusEl = document.getElementById("filterStatus");
const filterPriorityEl = document.getElementById("filterPriority");
const clearFiltersBtn = document.getElementById("clearFilters");
const formEl = document.getElementById("taskForm");

// ---------- Storage ----------
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [...defaultTasks];
  } catch (error) {
    console.error("Could not read saved tasks:", error);
    return [...defaultTasks];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

let tasks = loadTasks();

// ---------- Helpers ----------
// Chhota helper: element banata hai, class aur text set karta hai
function createEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function getTodayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusToClass(status) {
  return "status-" + status.toLowerCase().replace(" ", "-");
}

// ---------- Rendering ----------
function renderSummary() {
  const counts = [
    { label: "Total", value: tasks.length },
    { label: "Pending", value: tasks.filter((t) => t.status === "Pending").length },
    { label: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length },
    { label: "Completed", value: tasks.filter((t) => t.status === "Completed").length },
  ];

  summaryEl.replaceChildren();
  counts.forEach((item) => {
    const box = createEl("div", "summary-box");
    box.append(createEl("strong", "", item.value), createEl("span", "", item.label));
    summaryEl.append(box);
  });
}

function createTaskCard(task) {
  const card = createEl("article", `task-card ${statusToClass(task.status)}`);

  card.append(createEl("h3", "", task.title));
  card.append(createEl("p", "", task.description));

  // Priority badge + deadline
  const meta = createEl("div", "task-meta");
  meta.append(createEl("span", `badge badge-${task.priority.toLowerCase()}`, task.priority));

  const isOverdue = task.deadline < getTodayString() && task.status !== "Completed";
  const deadlineText = `Deadline: ${formatDate(task.deadline)}${isOverdue ? " (Overdue)" : ""}`;
  meta.append(createEl("span", isOverdue ? "deadline overdue" : "deadline", deadlineText));
  card.append(meta);

  // Status dropdown
  const actions = createEl("div", "task-actions");
  const selectId = `status-${task.id}`;
  const label = createEl("label", "", "Status:");
  label.htmlFor = selectId;

  const select = document.createElement("select");
  select.id = selectId;
  STATUSES.forEach((status) => {
    const option = createEl("option", "", status);
    option.value = status;
    option.selected = status === task.status;
    select.append(option);
  });
  select.addEventListener("change", () => updateStatus(task.id, select.value));

  actions.append(label, select);
  card.append(actions);

  return card;
}

function getFilteredTasks() {
  const status = filterStatusEl.value;
  const priority = filterPriorityEl.value;

  return tasks.filter((task) => {
    const matchesStatus = status === "all" || task.status === status;
    const matchesPriority = priority === "all" || task.priority === priority;
    return matchesStatus && matchesPriority;
  });
}

function renderTasks() {
  const visibleTasks = getFilteredTasks();

  taskListEl.replaceChildren();
  visibleTasks.forEach((task) => taskListEl.append(createTaskCard(task)));

  emptyMessageEl.hidden = visibleTasks.length > 0;
  renderSummary();
}

// ---------- Status update ----------
function updateStatus(taskId, newStatus) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  task.status = newStatus;
  saveTasks();
  renderTasks();
}

// ---------- Validation ----------
function showError(fieldId, message) {
  document.getElementById(fieldId + "Error").textContent = message;
  document.getElementById(fieldId).classList.toggle("input-invalid", message !== "");
}

function validateForm() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  let isValid = true;

  // Title
  let message = "";
  if (title === "") message = "Title is required.";
  else if (title.length < 3) message = "Title must be at least 3 characters.";
  else if (title.length > 60) message = "Title must be 60 characters or less.";
  showError("title", message);
  if (message) isValid = false;

  // Description
  message = "";
  if (description === "") message = "Description is required.";
  else if (description.length < 10) message = "Description must be at least 10 characters.";
  showError("description", message);
  if (message) isValid = false;

  // Priority
  message = priority === "" ? "Please select a priority." : "";
  showError("priority", message);
  if (message) isValid = false;

  // Deadline
  message = "";
  if (deadline === "") message = "Deadline is required.";
  else if (deadline < getTodayString()) message = "Deadline cannot be in the past.";
  showError("deadline", message);
  if (message) isValid = false;

  return isValid ? { title, description, priority, deadline } : null;
}

// ---------- Event handlers ----------
formEl.addEventListener("submit", (event) => {
  event.preventDefault(); // page reload hone se rokta hai

  const data = validateForm();
  if (!data) return;

  tasks.push({ id: Date.now(), ...data, status: "Pending" });
  saveTasks();
  formEl.reset();
  renderTasks();
});

// Jab user type kare to us field ka error hata do
["title", "description", "priority", "deadline"].forEach((fieldId) => {
  document.getElementById(fieldId).addEventListener("input", () => showError(fieldId, ""));
});

filterStatusEl.addEventListener("change", renderTasks);
filterPriorityEl.addEventListener("change", renderTasks);

clearFiltersBtn.addEventListener("click", () => {
  filterStatusEl.value = "all";
  filterPriorityEl.value = "all";
  renderTasks();
});

// ---------- Start ----------
renderTasks();
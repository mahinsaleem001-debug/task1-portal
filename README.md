# Internship Task Portal

A small responsive web page where an intern can view assigned tasks, filter them, and update their status. Built as the first internship task (Web Developer, Task 7).

## Features

- Responsive layout for desktop and mobile screens
- Task cards showing title, description, priority, deadline and status
- Filter tasks by status, priority, or both at once
- Change a task's status between Pending, In Progress and Completed
- Add new tasks with form validation
- Summary counts (Total, Pending, In Progress, Completed)
- Overdue tasks are highlighted
- Data is saved in the browser (localStorage), so changes remain after refresh

## Tech Stack

- HTML5
- CSS3 (CSS variables, Grid, Flexbox, media queries)
- Vanilla JavaScript (no frameworks or libraries)

## Project Structure

```
task-portal/
├── index.html      # Page structure
├── css/
│   └── style.css   # Styling and responsive layout
├── js/
│   └── app.js      # Tasks, filters, status update, validation
└── README.md
```

## Setup and Run

No installation is needed.

1. Clone the repository:
```bash
   git clone https://github.com/mahinsaleem001-debug/task1-portal.git
```
2. Open the project folder.
3. Double-click `index.html` to open it in a browser (Chrome, Edge or Firefox).

Optional: use the VS Code "Live Server" extension for auto-reload while editing.

## How to Use

1. **View tasks:** tasks are listed under "My Tasks".
2. **Filter:** pick a Status and/or Priority. Click "Clear Filters" to reset.
3. **Update status:** use the Status dropdown on a task card.
4. **Add a task:** fill in the form and click "Add Task".

## Validation Rules

| Field | Rule |
|-------|------|
| Title | Required, 3 to 60 characters |
| Description | Required, at least 10 characters |
| Priority | Must be selected |
| Deadline | Required, cannot be in the past |

## Known Limitations

- Data is stored only in the current browser. It is not shared between devices.
- There is no login or backend server.
- Tasks cannot be edited or deleted yet.
- The mock data is reloaded only if browser storage is cleared.

## Future Improvements

- Edit and delete tasks
- Search by task title
- Sort by deadline or priority
- Connect to a backend API and database
- Add user login

## Author
Mahin Saleem

// GET PROJECT
const id = new URLSearchParams(location.search).get("id")
const projects = JSON.parse(localStorage.getItem("projects")) || []
const project = projects.find(p => p.id == id)

if (!project) {
  alert("Project tidak ditemukan")
  location.href = "index.html"
}

// INIT TASK ARRAY
if (!project.tasks) {
  project.tasks = []
}

// DOM ELEMENTS
const taskInput = document.getElementById("taskInput")
const dueDateInput = document.getElementById("dueDate")
const priorityInput = document.getElementById("priority")

const todoList = document.getElementById("todoList")
const overdueList = document.getElementById("overdueList")
const doneList = document.getElementById("doneList")

// HEADER INFO
document.getElementById("projectTitle").textContent = project.title
document.getElementById("projectMeta").textContent =
  `Target ${project.days} hari`

// SAVE PROJECT
function save() {
  localStorage.setItem("projects", JSON.stringify(projects))
}

// ADD TASK
function addTask() {
  const text = taskInput.value.trim()
  const dueDate = dueDateInput.value
  const priority = priorityInput.value

  if (!text) {
    alert("Tugas kosong!")
    return
  }

  if (!dueDate) {
    alert("Pilih due date!")
    return
  }

  const task = {
    id: Date.now(),
    text,
    dueDate,
    priority,
    done: false,
    createdAt: new Date().toISOString()
  }

  project.tasks.push(task)
  save()
  renderTasks()
  resetTaskForm()
}
// RENDER TASKS
function renderTasks() {
  todoList.innerHTML = ""
  overdueList.innerHTML = ""
  doneList.innerHTML = ""

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  project.tasks.forEach(task => {
    const li = document.createElement("li")
    li.className = "task-item"

    // === ROW ===
    const row = document.createElement("div")
    row.className = "task-row"

    // CHECKBOX
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "task-check"
    checkbox.checked = task.done

    checkbox.onchange = () => {
      task.done = checkbox.checked
      save()
      renderTasks()
    }

    // MAIN CONTENT (TEXT + DATE)
    const main = document.createElement("div")
    main.className = "task-main"

    const title = document.createElement("div")
    title.className = "task-title"
    title.textContent = task.text

    const date = document.createElement("div")
    date.className = "task-date"
    date.textContent =
      `Due: ${new Date(task.dueDate).toLocaleDateString("id-ID")}`

    main.append(title, date)

    // PRIORITY (INI FIX WARNA)
    const priority = document.createElement("span")
    priority.className = `priority ${task.priority}` // low | medium | high
    priority.textContent = task.priority.toUpperCase()

    // DELETE
    const del = document.createElement("button")
    del.className = "delete-btn"
    del.textContent = "✕"
    del.onclick = () => {
      project.tasks = project.tasks.filter(t => t.id !== task.id)
      save()
      renderTasks()
    }

    // ASSEMBLE
    row.append(checkbox, main, priority, del)
    li.append(row)

    // OVERDUE CHECK
    const dueTime = new Date(task.dueDate)
    dueTime.setHours(0, 0, 0, 0)

    if (task.done) {
      doneList.append(li)
    } else if (dueTime < today) {
      overdueList.append(li)
    } else {
      todoList.append(li)
    }
  })

  updateCount()
}


// UPDATE COUNT BADGE
function updateCount() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  document.getElementById("todo-count").textContent =
    project.tasks.filter(t => !t.done && new Date(t.dueDate) >= today).length

  document.getElementById("overdue-count").textContent =
    project.tasks.filter(t => !t.done && new Date(t.dueDate) < today).length

  document.getElementById("done-count").textContent =
    project.tasks.filter(t => t.done).length
}

// RESET FORM
function resetTaskForm() {
  taskInput.value = ""
  dueDateInput.value = ""
  priorityInput.value = "low"
}

// EVENTS
document.getElementById("addTask").onclick = () => {
  addTask()
}

document.getElementById("saveTask").onclick = () => {
  save()
  window.location.href = "index.html"
}

document.getElementById("closePage").onclick = () => {
  save()
  window.location.href = "index.html"
}

// INITIAL RENDER
renderTasks()

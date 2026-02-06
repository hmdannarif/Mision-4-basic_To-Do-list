const projectList = document.getElementById("projectList")
const titleInput = document.getElementById("projectTitle")
const daysInput = document.getElementById("projectDays")

let projects = JSON.parse(localStorage.getItem("projects")) || []

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects))
}

function renderProjects() {
  projectList.innerHTML = ""

  if (projects.length === 0) {
    projectList.innerHTML =
      `<div class="empty">Belum ada project. Yuk mulai satu 🚀</div>`
    return
  }

  projects.forEach((p, index) => {
  const card = document.createElement("div")
  card.className = "project-card"

  const title = document.createElement("h3")
  title.textContent = p.title
  title.onclick = () => {
    location.href = `project.html?id=${p.id}`
  }

  const meta1 = document.createElement("small")
  meta1.textContent =
    "Dibuat: " + new Date(p.createdAt).toLocaleDateString("id-ID")

  const meta2 = document.createElement("small")
  meta2.textContent = "Target: " + p.days + " hari"

  const del = document.createElement("button")
  del.textContent = "Hapus"
  del.className = "delete-project"
  del.onclick = (e) => {
    e.stopPropagation()
    if (confirm("Hapus project ini?")) {
      projects.splice(index, 1)
      localStorage.setItem("projects", JSON.stringify(projects))
      renderProjects()
    }
  }

    card.append(title, meta1, meta2, del)
    projectList.append(card)

  })

}


document.getElementById("addProject").onclick = () => {
  if (!titleInput.value.trim()) return alert("Nama project wajib!")

  projects.push({
    id: Date.now(),
    title: titleInput.value,
    days: daysInput.value || 0,
    createdAt: new Date(),
    tasks: []
  })

  saveProjects()
  renderProjects()

  titleInput.value = ""
  daysInput.value = ""
}

renderProjects()

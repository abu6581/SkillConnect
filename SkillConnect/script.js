const API_URL = "https://dummyjson.com/users?limit=24";
const SKILLS = ["Mason","Electrician","Plumber","Carpenter","Painter","Cleaner"];
const skillDescriptions = {
  Mason:"Brickwork, plastering, tiles and small construction projects.",
  Electrician:"Home wiring, switches, lighting and electrical troubleshooting.",
  Plumber:"Pipe fitting, taps, bathroom fixtures and leak repairs.",
  Carpenter:"Furniture repair, shelves, doors and custom woodwork.",
  Painter:"Interior walls, colour refresh and finishing work.",
  Cleaner:"Home cleaning, deep cleaning and organised spaces."
};
const grid = document.querySelector("#workerGrid");
const status = document.querySelector("#workerStatus");
const searchInput = document.querySelector("#workerSearch");
const sortSelect = document.querySelector("#sortWorkers");
let workers = [];
let activeCategory = "All";
let savedOnly = false;
const SAVED_KEY = "skillconnect-saved-workers-v1";

function savedIds() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || []; }
  catch { return []; }
}
function updateSavedCount() { document.querySelector("#savedCount").textContent = savedIds().length; }
function toggleSaved(id) {
  const ids = savedIds();
  const next = ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  updateSavedCount();
  renderWorkers();
}
async function loadWorkers() {
  status.textContent = "Loading professional profiles from API...";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API request failed (${response.status})`);
    const data = await response.json();
    workers = (data.users || []).map((user, index) => ({
      ...user,
      skill: SKILLS[index % SKILLS.length],
      experience: 2 + (index % 9),
      rating: (4.1 + ((index * 7) % 9) / 10).toFixed(1),
      demoPhone: user.phone,
      demoEmail: user.email
    }));
    renderWorkers();
    status.textContent = workers.length ? "Profiles loaded successfully." : "No profiles are available right now.";
  } catch (error) {
    status.textContent = "Could not load profiles. Check your internet connection and refresh.";
    document.querySelector("#resultCount").textContent = "0 professionals";
    console.error(error);
  }
}
function renderWorkers() {
  const term = searchInput.value.trim().toLowerCase();
  const saved = savedIds();
  let filtered = workers.filter(worker => {
    const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
    const matchesTerm = fullName.includes(term) || worker.skill.toLowerCase().includes(term) || skillDescriptions[worker.skill].toLowerCase().includes(term);
    const matchesCategory = activeCategory === "All" || worker.skill === activeCategory;
    const matchesSaved = !savedOnly || saved.includes(worker.id);
    return matchesTerm && matchesCategory && matchesSaved;
  });
  if (sortSelect.value === "rating") filtered.sort((a,b) => b.rating-a.rating);
  else filtered.sort((a,b) => a.firstName.localeCompare(b.firstName));
  document.querySelector("#resultCount").textContent = `${filtered.length} professional${filtered.length === 1 ? "" : "s"} found`;
  grid.innerHTML = "";
  if (!filtered.length) {
    grid.innerHTML = '<p class="status">No matching profiles. Try another skill or search term.</p>';
    return;
  }
  filtered.forEach(worker => {
    const card = document.createElement("article");
    card.className = "worker-card";
    const top = document.createElement("div");
    top.className = "worker-top";
    const avatar = document.createElement("img");
    avatar.src = worker.image;
    avatar.alt = `${worker.firstName} ${worker.lastName}`;
    const identity = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = `${worker.firstName} ${worker.lastName}`;
    const skill = document.createElement("small");
    skill.textContent = worker.skill;
    const verified = document.createElement("div");
    verified.className = "verified";
    verified.textContent = "● Sample API profile";
    identity.append(name, skill, verified);
    top.append(avatar, identity);
    const save = document.createElement("button");
    save.className = `save-btn ${saved.includes(worker.id) ? "saved" : ""}`;
    save.type = "button";
    save.textContent = saved.includes(worker.id) ? "♥" : "♡";
    save.setAttribute("aria-label", "Save profile");
    save.addEventListener("click", () => toggleSaved(worker.id));
    const bio = document.createElement("p");
    bio.className = "worker-bio";
    bio.textContent = skillDescriptions[worker.skill];
    const meta = document.createElement("div");
    meta.className = "worker-meta";
    const exp = document.createElement("span");
    exp.textContent = `${worker.experience} yrs experience (demo)`;
    const rating = document.createElement("b");
    rating.textContent = `★ ${worker.rating} (demo)`;
    meta.append(exp, rating);
    const actions = document.createElement("div");
    actions.className = "worker-actions";
    const details = document.createElement("button");
    details.textContent = "View profile";
    details.addEventListener("click", () => showProfile(worker));
    const contact = document.createElement("button");
    contact.textContent = "Contact";
    contact.addEventListener("click", () => showProfile(worker));
    actions.append(details, contact);
    card.append(top, save, bio, meta, actions);
    grid.append(card);
  });
}
function showProfile(worker) {
  const content = document.querySelector("#profileContent");
  content.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "profile-detail";
  const img = document.createElement("img");
  img.src = worker.image;
  img.alt = `${worker.firstName} ${worker.lastName}`;
  const title = document.createElement("h2");
  title.textContent = `${worker.firstName} ${worker.lastName}`;
  const role = document.createElement("b");
  role.textContent = `${worker.skill} · Sample profile`;
  const bio = document.createElement("p");
  bio.textContent = skillDescriptions[worker.skill] + ` Profile data is provided by DummyJSON for demonstration only; this person is not verified as a service provider.`;
  const email = document.createElement("a");
  email.href = `mailto:${worker.email}`;
  email.textContent = `Email: ${worker.email}`;
  const phone = document.createElement("p");
  phone.textContent = `API sample phone: ${worker.phone}`;
  const note = document.createElement("small");
  note.textContent = "Do not use these sample API contacts to arrange real jobs.";
  note.style.color = "#9a6868";
  wrap.append(img, title, role, bio, email, phone, note);
  content.append(wrap);
  document.querySelector("#profileDialog").showModal();
}
searchInput.addEventListener("input", renderWorkers);
sortSelect.addEventListener("change", renderWorkers);
document.querySelector("#categoryList").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category").forEach(item => item.classList.toggle("active", item === button));
  renderWorkers();
});
document.querySelector("#showSaved").addEventListener("click", () => {
  savedOnly = !savedOnly;
  document.querySelector("#showSaved").style.background = savedOnly ? "#dcece6" : "#fff";
  document.querySelector("#showSaved").firstChild.textContent = savedOnly ? "♥ Saved " : "♡ Saved ";
  renderWorkers();
});
document.querySelector("#closeDialog").addEventListener("click", () => document.querySelector("#profileDialog").close());
document.querySelector("#profileDialog").addEventListener("click", event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.querySelector("#menuToggle").addEventListener("click", () => document.querySelector("#nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(link => link.addEventListener("click", () => document.querySelector("#nav").classList.remove("open")));
document.querySelector("#year").textContent = new Date().getFullYear();
updateSavedCount();
loadWorkers();

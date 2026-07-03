/* ==========================================================================
   Project data
   ========================================================================== */
const PROJECTS = [
  {
    id: "chatsafe",
    name: "ChatSafe",
    role: "Lead",
    roleDetail: "Manuscript · model pipeline · backend · frontend · database",
    thumb: "visuals/projects/chatsafe.png",
    domainPills: ["AI/ML", "NLP"],
    stackPills: ["Python", "Gemini API", "HateBERT", "React", "Node.js", "MySQL"],
    context: "ChatSafe detects cyberbullying in code-mixed Filipino, Bisaya, and English text pulled from real Philippine social media conversations. Rather than training a classifier directly on three tangled languages, it first translates the mixed text into English through an LLM-based pipeline, then classifies it. That translate-then-classify approach handled culturally loaded slang far better than standard machine translation engines did in early testing, and the results were validated by licensed psychologists as expert evaluators.",
    stats: [
      { value: "70.4%", label: "Tier 3 macro-F1" },
      { value: "+16pp", label: "gain via translation" },
      { value: "3", label: "code-mixed languages" }
    ],
    gallery: []
  },
  {
    id: "seglo",
    name: "SeGlo-12",
    role: "Lead",
    roleDetail: "Hardware · vision/ML pipeline · mobile app · manuscript",
    thumb: "visuals/projects/seglo-hardware.jpeg",
    domainPills: ["AI/ML", "Computer Vision", "Embedded Systems"],
    stackPills: ["Arduino", "C++", "MediaPipe", "TensorFlow Lite", "Python"],
    context: "SeGlo-12 is a dual-mode sign language translator. A smart glove built with flex sensors and a gyroscope reads static hand shapes directly, while a companion camera mode uses MediaPipe hand-tracking and a lightweight on-device model to recognize gestures without needing the glove at all. Both paths turn signs into spoken audio and on-screen text in real time, and beta testing included a member of the hard-of-hearing community.",
    stats: [
      { value: "87%", label: "vision accuracy" },
      { value: "0.86", label: "macro F1-score" },
      { value: "4.51/5", label: "beta satisfaction" }
    ],
    gallery: ["visuals/projects/seglo-hardware.jpeg", "visuals/projects/seglo-software.png"]
  },
  {
    id: "jolens",
    name: "Jolen's Bicycle Supply",
    role: "Contributor",
    roleDetail: "Frontend · database",
    thumb: "visuals/projects/jolens.png",
    domainPills: ["Full-Stack", "Web Development"],
    stackPills: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MySQL"],
    context: "A point-of-sale and inventory system built for a real bicycle shop in Digos City that was still running on paper logs and scattered spreadsheets. It handles sales transactions, live stock tracking, and daily reporting through a dashboard, replacing manual processes that were slow and prone to error. My part was the frontend and the database.",
    stats: [],
    gallery: []
  },
  {
    id: "ai-image",
    name: "AI Image Detection",
    role: "Lead",
    roleDetail: "Research · model development · manuscript",
    thumb: "visuals/projects/ai%20image%20detector.png",
    domainPills: ["AI/ML", "Computer Vision", "Digital Forensics"],
    stackPills: ["Python", "PyTorch", "Swin Transformer", "Grad-CAM"],
    context: "A machine learning system that tells real photographs apart from AI-generated ones across multiple generation platforms, from MidJourney to Stable Diffusion. A fine-tuned Swin Transformer looks for the subtle artifacts generative models tend to leave behind, trained on the GenImage dataset plus additional Kaggle sources. Grad-CAM visualizations show which parts of an image actually drove the decision, so the result is a confidence score with a visible reason behind it.",
    stats: [
      { value: "7", label: "AI platforms covered" },
      { value: "85%", label: "example confidence score" }
    ],
    gallery: []
  }
];

/* ==========================================================================
   Nav
   ========================================================================== */
const nav = document.getElementById("nav");
const navTrigger = document.getElementById("navTrigger");
document.getElementById("navTime").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

navTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  nav.classList.toggle("is-open");
  navTrigger.setAttribute("aria-expanded", nav.classList.contains("is-open"));
});
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target)) nav.classList.remove("is-open");
});
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});

/* ==========================================================================
   Theme
   ========================================================================== */
const themeBtns = document.querySelectorAll(".theme-btn");
function applyTheme(choice){
  let resolved = choice;
  if (choice === "system"){
    resolved = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.documentElement.setAttribute("data-theme", resolved);
  localStorage.setItem("portfolio-theme", choice);
  themeBtns.forEach(btn => btn.classList.toggle("is-active", btn.dataset.themeChoice === choice));
}
themeBtns.forEach(btn => btn.addEventListener("click", () => applyTheme(btn.dataset.themeChoice)));
applyTheme(localStorage.getItem("portfolio-theme") || "dark");

/* ==========================================================================
   Cursor-follow skill tag
   ========================================================================== */
const photoZone = document.getElementById("photoFrame");
const cursorTag = document.getElementById("cursorTag");
const cursorLabel = document.getElementById("cursorLabel");
const CURSOR_ZONES = [
  { label: "UI/UX", color: "#a29bfe" },
  { label: "Artificial Intelligence", color: "#81ecec" },
  { label: "Machine Learning", color: "#ffbe76" }
];
photoZone.addEventListener("mousemove", (e) => {
  const rect = photoZone.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  cursorTag.style.transform = `translate(${x - 4}px, ${y - 3}px)`;

  const ratio = x / rect.width;
  const zone = ratio < 0.34 ? CURSOR_ZONES[0] : ratio < 0.67 ? CURSOR_ZONES[1] : CURSOR_ZONES[2];
  if (cursorLabel.textContent !== zone.label) {
    cursorLabel.textContent = zone.label;
    cursorTag.style.setProperty("--tag-color", zone.color);
  }
});
photoZone.addEventListener("mouseleave", () => {
  cursorTag.style.transform = "translate(-999px,-999px)";
});

/* ==========================================================================
   Bento grid render
   ========================================================================== */
const bentoGrid = document.getElementById("bentoGrid");
PROJECTS.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "bento-card";
  card.dataset.index = i;
  card.innerHTML = `
    <img src="${p.thumb}" alt="${p.name}">
    <span class="bento-role">${p.role}</span>
    <div class="bento-info">
      <h3>${p.name}</h3>
      <div class="bento-pills">
        ${p.domainPills.map(d => `<span class="pill pill--domain">${d}</span>`).join("")}
      </div>
    </div>
  `;
  card.addEventListener("click", () => openDrawer(i));
  bentoGrid.appendChild(card);
});

/* ==========================================================================
   Drawer
   ========================================================================== */
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerContent = document.getElementById("drawerContent");
const drawerIndex = document.getElementById("drawerIndex");
let currentProject = 0;

function renderDrawer(i){
  const p = PROJECTS[i];
  currentProject = i;
  drawerIndex.textContent = `${String(i + 1).padStart(2, "0")} / ${String(PROJECTS.length).padStart(2, "0")}`;
  drawerContent.innerHTML = `
    <span class="drawer-role">${p.role} — ${p.roleDetail}</span>
    <h2 class="drawer-title">${p.name}</h2>
    <div class="drawer-pillrow">
      ${p.domainPills.map(d => `<span class="pill--domain-lg">${d}</span>`).join("")}
    </div>
    <div class="drawer-pillrow">
      ${p.stackPills.map(s => `<span class="pill--stack-lg">${s}</span>`).join("")}
    </div>
    <img class="drawer-hero-img" src="${p.thumb}" alt="${p.name}">
    <p class="drawer-context">${p.context}</p>
    ${p.stats.length ? `
      <div class="drawer-stats">
        ${p.stats.map(s => `<div><span class="drawer-stat-num">${s.value}</span><span class="drawer-stat-label">${s.label}</span></div>`).join("")}
      </div>` : ""}
    ${p.gallery.length ? `
      <div class="drawer-gallery">
        ${p.gallery.map(g => `<img src="${g}" alt="">`).join("")}
      </div>` : ""}
  `;
}

function openDrawer(i){
  renderDrawer(i);
  drawer.classList.add("is-open");
  drawerOverlay.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeDrawer(){
  drawer.classList.remove("is-open");
  drawerOverlay.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.getElementById("drawerClose").addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
document.getElementById("drawerPrev").addEventListener("click", () => {
  renderDrawer((currentProject - 1 + PROJECTS.length) % PROJECTS.length);
  drawerContent.scrollTop = 0;
});
document.getElementById("drawerNext").addEventListener("click", () => {
  renderDrawer((currentProject + 1) % PROJECTS.length);
  drawerContent.scrollTop = 0;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

/* ==========================================================================
   Scroll reveal
   ========================================================================== */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

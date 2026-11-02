/* ==========================================================================
   Project data
   ========================================================================== */
const PROJECTS = [
  {
    id: "chatsafe",
    name: "ChatSafe",
    role: "Lead",
    roleDetail: "Manuscript · model pipeline · backend · frontend · database",
    thumb: "visuals/projects/chatsafe.png?v=20261102",
    summary: "Multilingual cyberbullying detection for Philippine digital spaces. ChatSafe's Translate-then-Classify pipeline converts code-mixed Tagalog, Bisaya, and English into English - then applies HateBERT to detect harm where no Filipino training data exists.",
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
    thumb: "visuals/projects/seglo-hardware.jpeg?v=20261102",
    summary: "Dual-mode Philippine sign language translator combining a flex-sensor smart glove and vision-based MediaPipe tracking to translate gestures into spoken audio and text in real time.",
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
    thumb: "visuals/projects/jolens.png?v=20261102",
    summary: "Point-of-sale and live inventory management system built for a local bicycle business in Digos City, modernizing daily transactions, stock tracking, and sales analytics.",
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
    thumb: "visuals/projects/ai%20image%20detector.png?v=20261102",
    summary: "Machine learning forensics system fine-tuning Swin Transformers with Grad-CAM visual explainability to identify synthetic artifacts and detect AI-generated imagery across multiple generative platforms.",
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
photoZone.addEventListener("mouseenter", () => {
  cursorTag.style.transition = "none";
});
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
  cursorTag.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  cursorTag.style.transform = "translate(150px, 270px)";
  cursorLabel.textContent = "Artificial Intelligence";
  cursorTag.style.setProperty("--tag-color", "#81ecec");
});

/* ==========================================================================
   Project grid render
   ========================================================================== */
const bentoGrid = document.getElementById("bentoGrid");
if (bentoGrid) {
  bentoGrid.innerHTML = "";
  PROJECTS.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.index = i;
    card.innerHTML = `
      <div class="project-card-media">
        <img src="${p.thumb}" alt="${p.name}" class="project-card-img" loading="lazy">
        <span class="project-card-role">${p.role.toUpperCase()}</span>
      </div>
      <div class="project-card-body">
        <h3 class="project-card-title">${p.name}</h3>
        <p class="project-card-desc">${p.summary}</p>
        <div class="project-card-footer">
          <div class="project-card-pills">
            ${p.domainPills.map(d => `<span class="project-pill">${d}</span>`).join("")}
          </div>
          <button type="button" class="project-card-arrow-btn" aria-label="View case study for ${p.name}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openDrawer(i));
    bentoGrid.appendChild(card);
  });
}

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

/* ==========================================================================
   Tools category filter
   ========================================================================== */
function setupToolsFilter() {
  const filterBtns = document.querySelectorAll(".tools-filter-btn");
  const catCards = document.querySelectorAll(".tools-cat-card");
  const toolsGrid = document.querySelector(".tools-grid");
  const countEl = document.getElementById("toolsTotalCount");

  if (!filterBtns.length || !catCards.length) return;

  const labels = {
    all: "22 tools & frameworks",
    languages: "8 tools in Languages & Core",
    frameworks: "6 tools in Frameworks & Web",
    design: "4 tools in Design & Prototyping",
    systems: "4 tools in AI, ML & Systems"
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      this.classList.add("is-active");

      const filter = this.getAttribute("data-filter");

      if (countEl && labels[filter]) {
        countEl.textContent = labels[filter];
      }

      if (filter === "all") {
        if (toolsGrid) toolsGrid.style.gridTemplateColumns = "";
        catCards.forEach((card) => {
          card.style.display = "flex";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      } else {
        if (toolsGrid) toolsGrid.style.gridTemplateColumns = "1fr";
        catCards.forEach((card) => {
          if (card.getAttribute("data-cat") === filter) {
            card.style.display = "flex";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          } else {
            card.style.display = "none";
          }
        });
      }
    });
  });
}

/* ==========================================================================
   HCI & UX Certificates Showcase
   ========================================================================== */
const HCI_CERTIFICATES = [
  {
    id: "google-1",
    index: "01",
    title: "Foundations of User Experience (UX) Design",
    issuer: "Google",
    date: "July 2025",
    trackLabel: "Google UX Design Series · Course 1",
    image: "visuals/hci-previews/google-ux-foundations.png",
    pdf: "visuals/HCI%20Certificates/Course_1.pdf",
    skills: ["UX Principles", "Design Thinking", "User-Centered Design", "Accessibility", "Design Frameworks"],
    desc: "Explored foundational concepts in UX design, identifying user needs, design sprints, usability heuristics, and inclusive, accessible design practices."
  },
  {
    id: "google-2",
    index: "02",
    title: "Start the UX Design Process: Empathize, Define, and Ideate",
    issuer: "Google",
    date: "July 2025",
    trackLabel: "Google UX Design Series · Course 2",
    image: "visuals/hci-previews/google-ux-process.png",
    pdf: "visuals/HCI%20Certificates/Course_2.pdf",
    skills: ["Empathy Maps", "Personas", "User Journey Maps", "Problem Framing", "Competitive Audits"],
    desc: "Empathized with users through targeted interviews, crafted actionable personas, mapped user journeys, and framed problem statements to drive ideation."
  },
  {
    id: "google-3",
    index: "03",
    title: "Build Wireframes and Low-Fidelity Prototypes",
    issuer: "Google",
    date: "July 2025",
    trackLabel: "Google UX Design Series · Course 3",
    image: "visuals/hci-previews/google-ux-wireframes.png",
    pdf: "visuals/HCI%20Certificates/Course_3.pdf",
    skills: ["Paper Wireframing", "Digital Wireframing", "Lo-Fi Prototypes", "Information Architecture", "Figma"],
    desc: "Drew rapid paper wireframes, developed digital wireframes, structured information architecture, and built interactive low-fidelity clickable prototypes in Figma."
  },
  {
    id: "google-4",
    index: "04",
    title: "Conduct UX Research and Test Early Concepts",
    issuer: "Google",
    date: "July 2025",
    trackLabel: "Google UX Design Series · Course 4",
    image: "visuals/hci-previews/google-ux-research.png",
    pdf: "visuals/HCI%20Certificates/Course_4.pdf",
    skills: ["Usability Testing", "UX Research", "Affinity Diagrams", "Qualitative Synthesis", "Design Iteration"],
    desc: "Planned and conducted moderated usability studies, gathered observational qualitative data, synthesized insights with affinity maps, and iterated designs based on findings."
  },
  {
    id: "google-5",
    index: "05",
    title: "Create High-Fidelity Designs and Prototypes in Figma",
    issuer: "Google",
    date: "July 2025",
    trackLabel: "Google UX Design Series · Course 5",
    image: "visuals/hci-previews/google-ux-figma.png",
    pdf: "visuals/HCI%20Certificates/Course_5.pdf",
    skills: ["Hi-Fi Mockups", "Figma Design Systems", "Interactive Components", "Typography Scales", "Micro-interactions"],
    desc: "Constructed polished high-fidelity UI mockups and responsive interactive prototypes in Figma using design systems, auto-layout, component variants, and fluid transitions."
  },
  {
    id: "ucsd-1",
    index: "06",
    title: "Input and Interaction",
    issuer: "UC San Diego",
    date: "May 2025",
    trackLabel: "UC San Diego · Human-Computer Interaction",
    image: "visuals/hci-previews/ucsd-input-interaction.png",
    pdf: "visuals/HCI%20Certificates/AMIHAN_Certificate_Input&Interaction.pdf",
    skills: ["Interaction Models", "Fitts's Law", "Direct Manipulation", "Input Semantics", "HCI Architecture"],
    desc: "Studied cognitive and physical mechanics of user input, Fitts's Law, direct manipulation paradigms, and interface architectures under UC San Diego's Design Lab."
  },
  {
    id: "gatech-1",
    index: "07",
    title: "Introduction to User Experience Design",
    issuer: "Georgia Tech",
    date: "May 2025",
    trackLabel: "Georgia Tech · Human-Computer Interaction",
    image: "visuals/hci-previews/gatech-ux-design.png",
    pdf: "visuals/HCI%20Certificates/AMIHAN_Certificate_IntroductionToUserExperienceDesign.pdf",
    skills: ["User Requirements", "Heuristic Evaluation", "Task Analysis", "Cognitive Walkthrough", "Interface Auditing"],
    desc: "Mastered the 4-phase UX design lifecycle at Georgia Tech: user discovery, requirement definition, iterative prototyping, and formal Nielsen-Norman heuristic evaluations."
  }
];

function setupHciShowcase() {
  const stackContainer = document.getElementById("hciStackContainer");
  const certImg = document.getElementById("hciCertImg");
  const trackTag = document.getElementById("hciStageTrackTag");
  const stageTitle = document.getElementById("hciStageTitle");
  const stageDesc = document.getElementById("hciStageDesc");
  const stageSkills = document.getElementById("hciStageSkills");
  const counter = document.getElementById("hciCounter");
  const prevBtn = document.getElementById("hciPrevBtn");
  const nextBtn = document.getElementById("hciNextBtn");
  const pdfBtn = document.getElementById("hciPdfBtn");
  const zoomBtn = document.getElementById("hciZoomBtn");
  const courseItems = document.querySelectorAll(".hci-course-item");

  const lightbox = document.getElementById("hciLightbox");
  const lightboxImg = document.getElementById("hciLightboxImg");
  const lightboxTitle = document.getElementById("hciLightboxTitle");
  const lightboxCounter = document.getElementById("hciLightboxCounter");
  const lightboxClose = document.getElementById("hciLightboxClose");
  const lightboxPrev = document.getElementById("hciLightboxPrev");
  const lightboxNext = document.getElementById("hciLightboxNext");
  const lightboxPdfBtn = document.getElementById("hciLightboxPdfBtn");

  if (!stackContainer || !certImg) return;

  let currentIdx = 0;

  function renderCert(idx, animate = true) {
    currentIdx = idx;
    const cert = HCI_CERTIFICATES[idx];
    if (!cert) return;

    if (animate && certImg) {
      certImg.style.opacity = "0.4";
      certImg.style.filter = "blur(4px)";
      setTimeout(() => {
        certImg.src = cert.image;
        certImg.alt = cert.title;
        certImg.style.opacity = "1";
        certImg.style.filter = "none";
      }, 150);
    } else if (certImg) {
      certImg.src = cert.image;
      certImg.alt = cert.title;
    }

    if (trackTag) trackTag.textContent = cert.trackLabel;
    if (stageTitle) stageTitle.textContent = cert.title;
    if (stageDesc) stageDesc.textContent = cert.desc;

    if (stageSkills) {
      stageSkills.innerHTML = cert.skills
        .map(skill => `<span class="hci-skill-tag">${skill}</span>`)
        .join("");
    }

    if (counter) counter.textContent = `${cert.index} / 07`;
    if (pdfBtn) pdfBtn.href = cert.pdf;

    courseItems.forEach(item => {
      const itemIdx = parseInt(item.getAttribute("data-index"), 10);
      if (itemIdx === idx) {
        item.classList.add("is-active");
      } else {
        item.classList.remove("is-active");
      }
    });

    if (lightbox && lightbox.classList.contains("is-open")) {
      renderLightbox();
    }
  }

  function renderLightbox() {
    const cert = HCI_CERTIFICATES[currentIdx];
    if (!cert) return;
    if (lightboxImg) lightboxImg.src = cert.image;
    if (lightboxTitle) lightboxTitle.textContent = cert.title;
    if (lightboxCounter) lightboxCounter.textContent = `${cert.index} / 07`;
    if (lightboxPdfBtn) lightboxPdfBtn.href = cert.pdf;
  }

  function openLightbox() {
    if (!lightbox) return;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  courseItems.forEach(item => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.getAttribute("data-index"), 10);
      renderCert(idx, true);
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const idx = parseInt(item.getAttribute("data-index"), 10);
        renderCert(idx, true);
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const prevIdx = (currentIdx - 1 + HCI_CERTIFICATES.length) % HCI_CERTIFICATES.length;
      renderCert(prevIdx, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const nextIdx = (currentIdx + 1) % HCI_CERTIFICATES.length;
      renderCert(nextIdx, true);
    });
  }

  if (stackContainer) {
    stackContainer.addEventListener("click", openLightbox);
  }

  if (zoomBtn) {
    zoomBtn.addEventListener("click", openLightbox);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      const prevIdx = (currentIdx - 1 + HCI_CERTIFICATES.length) % HCI_CERTIFICATES.length;
      renderCert(prevIdx, false);
      renderLightbox();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      const nextIdx = (currentIdx + 1) % HCI_CERTIFICATES.length;
      renderCert(nextIdx, false);
      renderLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (lightbox && lightbox.classList.contains("is-open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") {
        const prevIdx = (currentIdx - 1 + HCI_CERTIFICATES.length) % HCI_CERTIFICATES.length;
        renderCert(prevIdx, false);
        renderLightbox();
      }
      if (e.key === "ArrowRight") {
        const nextIdx = (currentIdx + 1) % HCI_CERTIFICATES.length;
        renderCert(nextIdx, false);
        renderLightbox();
      }
    }
  });

  renderCert(0, false);
}

function setupBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupToolsFilter();
    setupHciShowcase();
    setupBackToTop();
  });
} else {
  setupToolsFilter();
  setupHciShowcase();
  setupBackToTop();
}

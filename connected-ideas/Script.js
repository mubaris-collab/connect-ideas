// ==================== QUOTE ROTATION ====================
const quotes = [
  '"Dream big, start small, act now." – Robin Sharma',
  '"Great ideas come from collaboration."',
  '"Creativity is intelligence having fun." – Albert Einstein',
  '"Think. Create. Connect. Inspire." – Connect Ideas',
  '"Innovation is seeing what everyone sees but thinking what no one else does."'
];

document.addEventListener("DOMContentLoaded", () => {
  rotateQuotes();
  initIdeaForm();
  renderIdeas();
  initContactForm();
  initLoginForm();
  renderDashboard();
});

// -------------------- Quote logic ------------------------
function rotateQuotes() {
  const quoteElement = document.getElementById("dynamicQuote");
  if (!quoteElement) return;

  let index = 0;
  setInterval(() => {
    index = (index + 1) % quotes.length;
    quoteElement.style.opacity = 0;
    setTimeout(() => {
      quoteElement.textContent = quotes[index];
      quoteElement.style.opacity = 1;
    }, 300);
  }, 4000);
}

// ==================== LOCALSTORAGE HELPERS ====================
function getIdeas() {
  const raw = localStorage.getItem("ciIdeas");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveIdeas(ideas) {
  localStorage.setItem("ciIdeas", JSON.stringify(ideas));
}

function getCurrentUser() {
  const raw = localStorage.getItem("ciUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ==================== IDEA SUBMISSION ====================
function initIdeaForm() {
  const form = document.getElementById("ideaForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const university = document.getElementById("university").value.trim();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const imageFile = document.getElementById("image").files[0];
    const message = document.getElementById("formMessage");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !university || !title || !description) {
      message.textContent = "⚠️ Please fill in all required fields.";
      message.style.color = "red";
      return;
    }

    if (!emailPattern.test(email)) {
      message.textContent =
        "❌ Please enter a valid email address (e.g., user@example.com).";
      message.style.color = "red";
      return;
    }

    const ideaBase = {
      id: Date.now(),
      ownerName: name,
      ownerEmail: email,
      university,
      title,
      description,
      status: "Pending Review",
      createdAt: new Date().toISOString(),
      imageData: null
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        const idea = { ...ideaBase, imageData: reader.result };
        const ideas = getIdeas();
        ideas.push(idea);
        saveIdeas(ideas);
        form.reset();
        message.textContent = "✅ Idea submitted successfully!";
        message.style.color = "green";
      };
      reader.readAsDataURL(imageFile);
    } else {
      const ideas = getIdeas();
      ideas.push(ideaBase);
      saveIdeas(ideas);
      form.reset();
      message.textContent = "✅ Idea submitted successfully!";
      message.style.color = "green";
    }
  });
}

// ==================== IDEAS LISTING ====================
function renderIdeas() {
  const container = document.getElementById("ideasContainer");
  if (!container) return;

  const ideas = getIdeas();
  if (!ideas.length) {
    container.innerHTML =
      '<p class="muted">No ideas submitted yet. Be the first to pitch!</p>';
    return;
  }

  container.innerHTML = ideas
    .map((idea) => {
      const statusClass =
        idea.status === "Shortlisted"
          ? "status-shortlisted"
          : idea.status === "Funded"
          ? "status-funded"
          : "status-pending";

      return `
        <div class="idea-card" onclick="toggleIdea(${idea.id})">
          <div class="idea-card-header">
            <div>
              <strong>${idea.title}</strong><br/>
              <small>${idea.ownerName} – ${idea.university}</small>
            </div>
            <span class="status-badge ${statusClass}">${idea.status}</span>
          </div>
          <div class="idea-details" id="details-${idea.id}">
            <p>${idea.description}</p>
            <p><small>Contact: ${idea.ownerEmail}</small></p>
            ${
              idea.imageData
                ? `<img src="${idea.imageData}" alt="Idea image" />`
                : ""
            }
          </div>
        </div>
      `;
    })
    .join("");
}

function toggleIdea(id) {
  const el = document.getElementById(`details-${id}`);
  if (!el) return;
  el.style.display = el.style.display === "block" ? "none" : "block";
}

// ==================== CONTACT FORM VALIDATION ====================
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const msg = document.getElementById("contactMessage").value.trim();
    const box = document.getElementById("contactMessageBox");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !msg) {
      box.textContent = "⚠️ Please complete all fields.";
      box.style.color = "red";
      return;
    }

    if (!emailPattern.test(email)) {
      box.textContent =
        "❌ Invalid email format. Example: user@example.com";
      box.style.color = "red";
      return;
    }

    box.textContent = "✅ Thank you! Your message has been received.";
    box.style.color = "green";
    contactForm.reset();
  });
}

// ==================== LOGIN / ROLE HANDLING ====================
function initLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const roleInput = document.querySelector('input[name="role"]:checked');
    const message = document.getElementById("loginMessage");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !roleInput) {
      message.textContent = "⚠️ Please fill all fields and select a role.";
      message.style.color = "red";
      return;
    }

    if (!emailPattern.test(email)) {
      message.textContent =
        "❌ Please enter a valid email address (e.g., user@example.com).";
      message.style.color = "red";
      return;
    }

    const user = {
      name,
      email,
      role: roleInput.value
    };

    localStorage.setItem("ciUser", JSON.stringify(user));

    message.textContent = "✅ Login successful! Redirecting to dashboard...";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  });
}

// ==================== DASHBOARD RENDERING ====================
function updateDashboardStats() {
  const ideas = getIdeas();

  const total = ideas.length;
  const pending = ideas.filter((i) => i.status === "Pending Review").length;
  const shortlisted = ideas.filter((i) => i.status === "Shortlisted").length;
  const funded = ideas.filter((i) => i.status === "Funded").length;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("statTotalIdeas", total);
  setText("statPendingIdeas", pending);
  setText("statShortlistedIdeas", shortlisted);
  setText("statFundedIdeas", funded);
}

function renderDashboard() {
  const dashboard = document.getElementById("dashboardStats");
  if (!dashboard) return;

  const user = getCurrentUser();
  const welcome = document.getElementById("dashboardWelcome");

  if (user && welcome) {
    welcome.textContent = `Welcome, ${user.name} (${user.role})`;
  } else if (welcome) {
    welcome.textContent =
      "Welcome to the Connect Ideas dashboard. Log in to personalize your view.";
  }

  const ideas = getIdeas();
  updateDashboardStats();

  // Recent ideas
  const recentContainer = document.getElementById("recentIdeas");
  if (recentContainer) {
    if (!ideas.length) {
      recentContainer.innerHTML =
        '<p class="muted">No ideas submitted yet.</p>';
    } else {
      const sorted = ideas
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      recentContainer.innerHTML = sorted
        .map(
          (idea) => `
          <div class="idea-card">
            <div class="idea-card-header">
              <div>
                <strong>${idea.title}</strong><br/>
                <small>${idea.ownerName} – ${idea.university}</small>
              </div>
              <span class="status-badge ${
                idea.status === "Shortlisted"
                  ? "status-shortlisted"
                  : idea.status === "Funded"
                  ? "status-funded"
                  : "status-pending"
              }">${idea.status}</span>
            </div>
            <div class="idea-details" style="display:block;">
              <p>${idea.description}</p>
            </div>
          </div>
        `
        )
        .join("");
    }
  }

  // Admin idea status management
  const adminContainer = document.getElementById("adminIdeas");
  if (!adminContainer) return;

  if (!user || user.role !== "Admin") {
    adminContainer.innerHTML =
      '<p class="muted">Login as <strong>Admin</strong> to manage idea statuses.</p>';
    return;
  }

  if (!ideas.length) {
    adminContainer.innerHTML =
      '<p class="muted">No ideas available to manage yet.</p>';
    return;
  }

  adminContainer.innerHTML = ideas
    .map(
      (idea) => `
      <div class="admin-idea-row">
        <div>
          <strong>${idea.title}</strong><br/>
          <small>${idea.ownerName} – ${idea.university}</small>
        </div>
        <div>
          <label>
            Status:
            <select data-id="${idea.id}" class="statusSelect">
              <option value="Pending Review" ${
                idea.status === "Pending Review" ? "selected" : ""
              }>Pending Review</option>
              <option value="Shortlisted" ${
                idea.status === "Shortlisted" ? "selected" : ""
              }>Shortlisted</option>
              <option value="Funded" ${
                idea.status === "Funded" ? "selected" : ""
              }>Funded</option>
            </select>
          </label>
        </div>
      </div>
    `
    )
    .join("");

  adminContainer.addEventListener("change", (e) => {
    if (!e.target.classList.contains("statusSelect")) return;
    const id = Number(e.target.getAttribute("data-id"));
    const newStatus = e.target.value;

    const ideas = getIdeas();
    const idx = ideas.findIndex((i) => i.id === id);
    if (idx !== -1) {
      ideas[idx].status = newStatus;
      saveIdeas(ideas);
      updateDashboardStats();
      renderIdeas(); // refresh list if Ideas page is open
    }
  });
}

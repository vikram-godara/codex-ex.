const user = "vikram-godara";
const nav = document.querySelector("nav");
const menuBtn = document.querySelector(".menu-btn");
const themeToggle = document.getElementById("themeToggle");
const terminalOutput = document.getElementById("terminalOutput");

menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
for (const link of nav.querySelectorAll("a")) {
  link.addEventListener("click", () => nav.classList.remove("open"));
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

function renderTerminal(profile = {}) {
  const statusLines = [
    "$ whoami",
    `> ${profile.name || "Vikram Godara"} | Full Stack Web Developer`,
    "$ status --career",
    "> Currently looking for internships and real-world product opportunities",
    "$ focus --now",
    "> Building scalable web apps, improving system design & frontend UX",
    "$ links --primary",
    "> github.com/vikram-godara",
  ];

  terminalOutput.textContent = "";
  let lineIndex = 0;

  const typeLine = () => {
    if (lineIndex >= statusLines.length) return;
    terminalOutput.textContent += `${statusLines[lineIndex]}\n`;
    lineIndex += 1;
    setTimeout(typeLine, 230);
  };

  typeLine();
}

function renderProfile(profile) {
  document.getElementById("profileImage").src = profile.avatar_url || "https://avatars.githubusercontent.com/vikram-godara";
  document.getElementById("profileName").textContent = profile.name || "Vikram Godara";
  document.getElementById("profileBio").textContent = profile.bio || "Full Stack Web Developer";
  document.getElementById("profileLocation").textContent = profile.location || "Open to remote opportunities";
}

function renderStats(profile, repos) {
  document.getElementById("repoCount").textContent = profile.public_repos ?? "--";
  document.getElementById("followersCount").textContent = profile.followers ?? "--";
  document.getElementById("followingCount").textContent = profile.following ?? "--";

  const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  document.getElementById("starsCount").textContent = stars;
}

function renderProjects(repos) {
  const projectsGrid = document.getElementById("projectsGrid");
  const featured = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  if (!featured.length) {
    projectsGrid.innerHTML = `
      <article class="project-card">
        <h3>Projects are loading...</h3>
        <p class="meta">Add pinned repositories on GitHub for stronger spotlight.</p>
      </article>
    `;
    return;
  }

  projectsGrid.innerHTML = featured
    .map(
      (repo) => `
      <article class="project-card">
        <h3>${repo.name}</h3>
        <p class="meta">${repo.language || "Mixed"} • ⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}</p>
        <p>${repo.description || "A practical full-stack project from Vikram's GitHub profile."}</p>
        <a href="${repo.html_url}" target="_blank" rel="noreferrer">Open repository →</a>
      </article>
    `
    )
    .join("");
}

async function loadGitHubData() {
  const profileRes = await fetch(`https://api.github.com/users/${user}`);
  if (!profileRes.ok) throw new Error("Unable to load GitHub profile");
  const profile = await profileRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`);
  if (!reposRes.ok) throw new Error("Unable to load repositories");
  const repos = await reposRes.json();

  renderProfile(profile);
  renderStats(profile, repos);
  renderProjects(repos);
  renderTerminal(profile);
}

loadGitHubData().catch(() => {
  renderTerminal();
  document.getElementById("projectsGrid").innerHTML = `
    <article class="project-card">
      <h3>Live GitHub data unavailable</h3>
      <p class="meta">This environment blocked API access. Portfolio still works with profile links.</p>
      <a href="https://github.com/${user}" target="_blank" rel="noreferrer">Visit GitHub Profile →</a>
    </article>
  `;
});

document.getElementById("year").textContent = new Date().getFullYear();

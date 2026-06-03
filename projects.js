fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const featuredContainer = document.getElementById("projects-container");
    const olderContainer = document.getElementById("older-projects-container");

    projects.forEach(p => {
      const card = document.createElement("div");
      // Style differently if it's an older project for visual hierarchy
      card.className = p.older ? "older-project-card" : "project-card";
      card.style.cursor = "pointer";

      // Card click handling
      card.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "a" || e.target.closest("a")) return;
        if (p.repos && p.repos.length > 0) {
          window.open(p.repos[0].url, "_blank", "noopener,noreferrer");
        } else if (p.repo) {
          window.open(p.repo, "_blank", "noopener,noreferrer");
        }
      });

      let repoLinks = "";
      if (p.repos) {
        repoLinks = p.repos.map(r =>
          `<a href="${r.url}" class="highlight-link" target="_blank" rel="noopener noreferrer">${r.name} Repo</a>`
        ).join(" | ");
      } else if (p.repo) {
        repoLinks = `<a href="${p.repo}" class="highlight-link" target="_blank" rel="noopener noreferrer">repo</a>`;
      }

      card.innerHTML = `
        <div class="project-content">
          <h3>${p.title}</h3>
          ${p.tag ? `<div class="project-tag">${p.tag}</div>` : ""}
          <p>${p.description}</p>
          <div class="project-links">
            ${repoLinks ? `<p>${repoLinks}</p>` : ""}
            ${p.link ? `<p><a href="${p.link}" class="highlight-link" target="_blank" rel="noopener noreferrer">visit site</a></p>` : ""}
          </div>
        </div>
      `;

      // Route to correct layout section based on its file flag
      if (p.older && olderContainer) {
        olderContainer.appendChild(card);
      } else if (featuredContainer) {
        featuredContainer.appendChild(card);
      }
    });
  })
  .catch(err => {
    console.error("Error loading projects.json", err);
  });
document.documentElement.style.setProperty("--hue-start", Math.random() * 360);

const favicon = document.createElement("link");

favicon.rel = "icon";
favicon.type = "image/svg+xml";

document.head.appendChild(favicon);

const careerTemplate = (entry) => {
  const [start, end] = entry.period;

  return `
    <article>
      <h3 class="article-title">${entry.title}</h3>
      <h4 class="article-subtitle">${entry.company}</h4>
        <p class="article-subtitle article-subtitle--xs">
          <time datetime="${entry.init}">${start}</time>
          —
          <time datetime="${entry.end}">${end}</time>
        </p>
      <p class="article-summary">${entry.summary}</p>
      ${entry.detail}
      <div class="responsibilities">
        <h5 class="list-title">Responsibilities:</h5>
        <ul class="responsibilities-list">
          ${entry.responsibilities?.map((e) => `<li class="responsibility-item"><span>${e}</span></li>`).join("")}
        </ul>
      </div>
      <div class="article-stack">
        <h5 class="list-title">Stack:</h5>
        <ul class="stack-list">
          ${entry.stack?.map((s) => `<li class="stack-item">${s}</li>`).join("")}
        </ul>
      </div>
    </article>
  `;
};

const worksTemplate = (entry) => `
  <article>
    <h3 class="article-title">${entry.title}</h3>
    <h4 class="article-subtitle article-subtitle--xs">${entry.subtitle}</h4>
    <p>${entry.description}</p>
    <a href="${entry.link}" target="_blank" rel="noopener noreferrer">${entry.label}</a>
  </article>
`;

async function initParticles() {
  const response = await fetch("data/particles.json");
  const config = await response.json();

  particlesJS("particles-js", config);
}

async function initCareer() {
  const response = await fetch("data/career.json");
  const career = await response.json();

  renderEntries(career, careerTemplate, "#career-list");
}

async function initWorks() {
  const response = await fetch("data/works.json");
  const works = await response.json();

  renderEntries(works, worksTemplate, "#works-list");
}

const wrapper = document.querySelector("#page-cover");
const header = document.querySelector("#page-header");

let ticking = false;

function updateHeader() {
  const wrapperHeight = wrapper.offsetHeight;
  const headerHeight = header.offsetHeight;
  const threshold = wrapperHeight - headerHeight;

  document.documentElement.style.setProperty(
    "--header-height",
    `${headerHeight}px`,
  );

  const isFixed = window.scrollY >= threshold;

  wrapper.classList.toggle("is-fixed", isFixed);
  header.classList.toggle("is-fixed", isFixed);

  ticking = false;
}

function renderEntries(entries, template, selector) {
  document.querySelector(selector).innerHTML = entries.map(template).join("");
}

function updateFavicon() {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary-color")
    .trim();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" fill="white"/>
      <rect width="32" height="32" fill="${color}" fill-opacity="0.5"/>
    </svg>
  `;

  favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  },
  { passive: true },
);

window.addEventListener("resize", updateHeader);

initParticles();
initCareer();
initWorks();
updateHeader();
updateFavicon();

setInterval(updateFavicon, 500);

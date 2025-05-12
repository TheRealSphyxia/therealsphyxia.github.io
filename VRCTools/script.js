const dataUrl = "/data/VRCTools.json";
const toolList = document.getElementById("tool-list");
const filterContainer = document.getElementById("filter-container");

let toolsData = [];
let selectedTags = new Set();

function createTagElement(tag) {
  const span = document.createElement("span");
  span.classList.add("tag");
  span.classList.add(tag.replace(/\s/g, ""));
  span.textContent = tag;
  return span;
}

function createLinkButton(url, label) {
  if (!url) return null;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.classList.add("link-button");
  a.textContent = label;
  return a;
}

function renderCards(data) {
  toolList.innerHTML = "";

  // Sort: Essential tools to top
  data.sort((a, b) => {
    const aEssential = a.tags.includes("Essential") ? 0 : 1;
    const bEssential = b.tags.includes("Essential") ? 0 : 1;
    return aEssential - bEssential;
  });

  data.forEach((tool) => {
    const card = document.createElement("div");
    card.classList.add("tool-card");

    // Title
    const title = document.createElement("h2");
    title.textContent = tool.tool;
    card.appendChild(title);

    // Tags
    const tagsContainer = document.createElement("div");
    tagsContainer.classList.add("tool-tags");
    tool.tags.forEach((tag) => {
      tagsContainer.appendChild(createTagElement(tag));
    });
    card.appendChild(tagsContainer);

    // Short Desc
    const shortDesc = document.createElement("div");
    shortDesc.classList.add("short-desc");
    shortDesc.textContent = tool.ShortDesc;
    card.appendChild(shortDesc);

    // Long Desc
    const longDesc = document.createElement("div");
    longDesc.classList.add("long-desc");
    longDesc.textContent = tool.LongDesc;
    card.appendChild(longDesc);

    // Links
    const linksContainer = document.createElement("div");
    linksContainer.classList.add("tool-links");
    const mainLink = createLinkButton(tool.Link, "Source");
    const vpmLink = createLinkButton(tool.VPMListing, "VPM");

    if (mainLink) linksContainer.appendChild(mainLink);
    if (vpmLink) linksContainer.appendChild(vpmLink);
    card.appendChild(linksContainer);

    toolList.appendChild(card);
  });
}

function updateFilters() {
  const filtered = toolsData.filter((tool) =>
    [...selectedTags].every((tag) => tool.tags.includes(tag))
  );
  renderCards(filtered);
}

function renderTagFilters(allTags) {
  allTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.classList.add("filter-button");
    btn.textContent = tag;

    btn.addEventListener("click", () => {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.classList.remove("active");
      } else {
        selectedTags.add(tag);
        btn.classList.add("active");
      }
      updateFilters();
    });

    filterContainer.appendChild(btn);
  });
}

async function init() {
  try {
    const response = await fetch(dataUrl);
    const data = await response.json();
    toolsData = data;

    const allTags = new Set();
    data.forEach((tool) => tool.tags.forEach((tag) => allTags.add(tag)));

    renderTagFilters([...allTags].sort());
    renderCards(data);
  } catch (err) {
    console.error("Failed to load tools:", err);
    toolList.innerHTML =
      "<p style='text-align:center;'>Failed to load tools data.</p>";
  }
}

init();

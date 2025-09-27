let articles = [];          
let filteredArticles = [];  
const articlesPerPage = 2;
let currentPage = 1;
let currentCategory = "Home";

async function loadArticles() {
  try {
    const response = await fetch("data/artigos.json");
    articles = await response.json();
    filteredArticles = articles; // começa mostrando todos
    renderArticles(currentPage);
    setupCategoryButtons();
  } catch (error) {
    console.error("Erro ao carregar os artigos:", error);
  }
}

function renderArticles(page) {
  const container = document.getElementById("articles-container");
  container.innerHTML = "";

  const start = (page - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const pageArticles = filteredArticles.slice(start, end);

  pageArticles.forEach((article) => {
    const articleElement = document.createElement("article");
    articleElement.classList.add("artigo-noticia");

    articleElement.innerHTML = `
      <img src="${article.image}" style="width:300px;height:300px;" alt="Imagem do Artigo" class="imagem-artigo"/>
      <div class="conteudo-artigo">
        <h2>${article.title}</h2>
        <p class="preview">${article.preview}</p>
        <p class="full-text" style="display:none;">${article.content.replace(/\n/g, "<br>")}</p>
        <button class="toggle-btn">Ver o Artigo</button>
      </div>
    `;
    // Expandir/recolher texto
    articleElement.querySelector(".toggle-btn").addEventListener("click", function () {
      const fullText = articleElement.querySelector(".full-text");
      if (fullText.style.display === "none") {
        fullText.style.display = "block";
        this.textContent = "Recolher";
      } else {
        fullText.style.display = "none";
        this.textContent = "Ver o Artigo";
      }
    });

    container.appendChild(articleElement);
  });

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");

    btn.addEventListener("click", () => {
      currentPage = i;
      renderArticles(currentPage);
    });

    pagination.appendChild(btn);
  }
}

function setupCategoryButtons() {
  const nav = document.getElementById("nav-categorias");
  const buttons = nav.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      currentPage = 1;

      if (currentCategory === "all") {
        filteredArticles = articles;
      } else {
        filteredArticles = articles.filter(a => a.category === currentCategory);
      }

      renderArticles(currentPage);
    });
  });
}

// Inicializa
loadArticles();

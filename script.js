const MAX_POKEMONS = 1025; //CAMBIAR Nº MÁXIMO DE POKEMONS - 1025 PARA LOS POKEMONS BASE
const wrapperLista = document.querySelector(".wrapper-lista");
const inputBusqueda = document.querySelector("#input-busqueda");
const numberFilter = document.querySelector("#numero");
const nameFilter = document.querySelector("#nombre");
const notFoundMessage = document.querySelector("#mensaje-no-encontrado");
const pageSelector = document.querySelector("#cant-pagina");
let currentPage = 1;
let resultsPerPage = parseInt(pageSelector.value);
const maxVisiblePages = 3;

let allPokemons = [];
let filteredPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMONS}`)
  .then((Response) => Response.json())
  .then((data) => {
    allPokemons = data.results;
    filteredPokemons = allPokemons;
    displayPokemons(filteredPokemons);
  });

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("No se ha podido recuperar los pokemons", error);
  }
}

function displayPokemons(pokemon) {
  wrapperLista.innerHTML = "";
  resultsPerPage = parseInt(pageSelector.value);

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;

  const paginatedPokemons = pokemon.slice(startIndex, endIndex);

  paginatedPokemons.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
      <div class="number-wrap">
        <p class="caption-fonts">#${pokemonID}</p>
      </div>
      <div class="image-wrap">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}"></img>
      </div>
      <div class="name-wrap">
        <p class="body3-fonts">${pokemon.name}</p>
      </div>
    `;

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detalle.html?id=${pokemonID}`;
      }
    });

    wrapperLista.appendChild(listItem);
  });

  updatePaginationControls(pokemon.length);
}

function updatePaginationControls(totalResults) {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  const createButton = (text, page, disabled = false, isActive = false) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("pagination-button");
    if (isActive) button.classList.add("active");
    if (disabled) button.setAttribute("disabled", "disabled");
    button.addEventListener("click", () => {
      if (!disabled) {
        currentPage = page;
        displayPokemons(filteredPokemons);
      }
    });
    return button;
  };

  paginationContainer.appendChild(
    createButton("««", 1, currentPage === 1, false)
  );
  paginationContainer.appendChild(
    createButton("«", currentPage - 1, currentPage === 1, false)
  );

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.appendChild(
      createButton(i, i, false, i === currentPage)
    );
  }

  paginationContainer.appendChild(
    createButton("»", currentPage + 1, currentPage === totalPages, false)
  );
  paginationContainer.appendChild(
    createButton("»»", totalPages, currentPage === totalPages, false)
  );
}

inputBusqueda.addEventListener("keyup", handleSearch);
pageSelector.addEventListener("change", handleSearch);

function handleSearch() {
  resultsPerPage = pageSelector.value;
  const searchTerm = inputBusqueda.value.toLowerCase();

  filteredPokemons = allPokemons.filter((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    return (
      pokemon.name.toLowerCase().startsWith(searchTerm) ||
      pokemonID.startsWith(searchTerm)
    );
  });
  console.log(filteredPokemons.lenght);
  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }

  currentPage = 1;

  displayPokemons(filteredPokemons);
}

const closeButton = document.querySelector(".icono-cerrar-busqueda");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  inputBusqueda.value = "";
  filteredPokemons = allPokemons;
  notFoundMessage.style.display = "none";
  displayPokemons(filteredPokemons);
}

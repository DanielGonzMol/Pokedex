const MAX_POKEMONS = 10000; //CAMBIAR Nº MÁXIMO DE POKEMONS - 151 PARA LA PRIMERA GENERACIÓN
const wrapperLista = document.querySelector(".wrapper-lista");
const inputBusqueda = document.querySelector("#input-busqueda");
const numberFilter = document.querySelector("#numero");
const nameFilter = document.querySelector("#nombre");
const notFoundMessage = document.querySelector("#mensaje-no-encontrado");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMONS}`)
  .then((Response) => Response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  });

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => {
        res.json();
      }),
      fetch(`https://pokeapi.co/api/v2/pokemon/pokemon-species/${id}`).then(
        (res) => {
          res.json();
        }
      ),
    ]);
    return true;
  } catch (error) {
    console.error("No se ha podido recuperar los pokemons");
  }
}

function displayPokemons(pokemon) {
  wrapperLista.innerHTML = "";

  pokemon.forEach((pokemon) => {
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
        <p class="body3-fonts">#${pokemon.name}</p>
      </div>
    `;

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=#${pokemonID}`;
      }
    });

    wrapperLista.appendChild(listItem);
  });
}

inputBusqueda.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = inputBusqueda.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.querySelector(".icono-cerrar-busqueda");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  inputBusqueda.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}

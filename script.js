const MAX_POKEMONS = 10000; //CAMBIAR Nº MÁXIMO DE POKEMONS - 151 PARA LA PRIMERA GENERACIÓN
const wrapperLista = document.querySelector(".wrapper-lista");
const inputBusqueda = document.querySelector("input-busqueda");
const numberFilter = document.querySelector("#numero");
const nameFilter = document.querySelector("#nombre");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMONS}`)
  .then((Response) => Response.json())
  .then((data) => {
    allPokemons = data.results;
    console.log(data.results);
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
    console.error("No se ha podido miguelear la wave");
  }
}

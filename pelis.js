function suggerirPelis(expressioRegular) {

	// espai on van les linies amb cada peli
	let suggeriments = document.getElementById("suggestions");
	suggeriments.innerHTML = ""; // netejar de text residual d'intents anteirors
  
	// tenim mínim de tres lletres, que comenci a operar
	if (expressioRegular.length > 2) {
	  const options = {
		method: 'GET',
		headers: {
		  accept: 'application/json',
		  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGYzYjMzZTVmOTFiYjE4MmEzMWVhOWNjM2Q3ZDcxNCIsIm5iZiI6MTc0NjExMzMzMy4xMDQsInN1YiI6IjY4MTM5MzM1N2VhYjE3Mzk2ZWIxZmQ2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cWGNkn5uWCH-R9Tj4ZcE9QDhR1rmYf-jSgcRjlHAzPE'
		}
	  };
  
	  let imdbIdPeticio = "";
	  let pelicula = "";
	  
	  fetch(`https://api.themoviedb.org/3/search/movie?query=${expressioRegular}&include_adult=true&language=en-US&page=1`, options)
		.then(res => res.json())
		.then(data => {
		  let pelicules = data.results;  
		// arribat aqui, hem fet la petició, l'hem passat a json ens quedem amb la segona propietat, que és un array amb cada peli

		// anirem creant cada línia amb la pel·licula, creant l'element i afegint com id l'id de la peli, i com a text el nom de la peli
		  pelicules.forEach(pelicula => {
			let liniaSuggeriment = document.createElement("div");
			liniaSuggeriment.setAttribute("class", "suggest-element");
			liniaSuggeriment.setAttribute("id", pelicula.id);
			liniaSuggeriment.innerHTML = pelicula.original_title;
			
			// per fer que cada punt de llista sigui un enllaç clicable, creem un element <a> que porti a la peli a IMDB.
			// per fer-ho, hem una altra petició amb el id actual, que ens donarà el id de IMDB i amb això podrem crear la url
			let enllaç = document.createElement("a");

			fetch(`https://api.themoviedb.org/3/movie/${pelicula.id}/external_ids`, options)
			.then(res2 => res2.json())
			.then(peliExacta => {
			  if (peliExacta.imdb_id) {
				enllaç.setAttribute("href", `https://www.imdb.com/title/${peliExacta.imdb_id}`);
				enllaç.appendChild(liniaSuggeriment);
				suggeriments.appendChild(enllaç);
			  }
			})

			enllaç.appendChild(liniaSuggeriment);

			suggeriments.appendChild(enllaç);
		  });
  
		  suggeriments.style.display = "block";
		});
	} else {
	  suggeriments.style.display = "none";
	}
  }
  
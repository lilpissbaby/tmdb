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
		
			fetch(`https://api.themoviedb.org/3/movie/${pelicula.id}/external_ids`, options)
			.then(res2 => res2.json())
			.then(peliExacta => {
			  if (peliExacta.imdb_id) {
					
				// per fer que cada punt de llista sigui un enllaç clicable, creem un element <a> que porti a la peli a IMDB.
				// per fer-ho, hem una altra petició amb el id actual, que ens donarà el id de IMDB i amb això podrem crear la url
				let enllaç = document.createElement("a");

				enllaç.setAttribute("href", `https://www.imdb.com/title/${peliExacta.imdb_id}`);
				enllaç.appendChild(liniaSuggeriment);
				suggeriments.appendChild(enllaç);
			  }
			})
		  });
  
		  suggeriments.style.display = "block";
		});
	} else {
	  suggeriments.style.display = "none";
	}
  }
  
  function carregarTarjetes(){
	// extreure el que posa a la barra de cerca 
	expressioRegular = document.getElementById("filmSearch").value;

	espaiCartes = document.getElementById("movies");
	totesLesCartes = "";

	// treure suggeriments
	let suggeriments = document.getElementById("suggestions");
	suggeriments.setAttribute("style", "display: none");

	const options = {
		method: 'GET',
		headers: {
		  accept: 'application/json',
		  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGYzYjMzZTVmOTFiYjE4MmEzMWVhOWNjM2Q3ZDcxNCIsIm5iZiI6MTc0NjExMzMzMy4xMDQsInN1YiI6IjY4MTM5MzM1N2VhYjE3Mzk2ZWIxZmQ2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cWGNkn5uWCH-R9Tj4ZcE9QDhR1rmYf-jSgcRjlHAzPE'
	}};

	fetch(`https://api.themoviedb.org/3/search/movie?query=${expressioRegular}&include_adult=true&language=es-ES&page=2`, options)
		.then(res3 => res3.json())
		.then(data => {
			let pelicules = data.results;

			// recorrent peli per peli
			pelicules.forEach(pelicula => {

				peli = pelicula.poster_path == null ? "null.jpg" : "https://image.tmdb.org/t/p/original/" + pelicula.poster_path; 

				// un cop hem fet una peticio d'una peli concreta, fem les peticions particulars per exrteure cada genere
				nomsGeneres = "";

				fetch(`https://api.themoviedb.org/3/movie/${pelicula.id}`,options)
					.then(res4 => res4.json())
					.then(peliGenere => {
						if(peliGenere.genres){
							arrayGeneres = peliGenere.genres;

							for(i = 0; i < arrayGeneres.length; i++){
								nomsGeneres += arrayGeneres.name;
							}
						}
					});

				// inserir l'element de la carta 
				cartaPeli = `<div class="col-md-4"><div class="card mb-4 box-shadow">
				<img
				class="card-img-top"
				data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
				alt="Thumbnail [100%x225]"
				style="width: 100%; display: block"
				src="${peli}"
				data-holder-rendered="true"
				/>
				<div class="card-body text-center">
				<h5 class="card-title text-center">${pelicula.original_title}</h5>
				<div>
					<small class="text-muted"
					><i class="bi bi-film mx-2"> </i>${nomsGeneres}
					</small>
				</div>
				<div>
					<small class="text-muted"
					><i class="bi bi-calendar3 mx-2"> </i>${pelicula.release_date}</small
					>
				</div>
				<small class="text-muted"
					><i class="bi bi-people mx-2"></i>${" Keanu Reeves, Carrie-Anne Moss, Yahya Abdul-Mateen II"}</small
				>
				</div>
				<div class="card-footer bg-primary text-white text-center">
				<a
					href="https://www.imdb.com/title/${"tt10838180"}/"
					class="text-white"
					><i class="bi bi-eye"></i> Veure fitxa a IMDB</a
				>
				</div>
			</div></div>`;

			// anar afegint totes les cartes en una variable
			totesLesCartes += cartaPeli;

			})

			// inserir tot el html ocntneint les cartes anteriors al seu espai
			espaiCartes.innerHTML = totesLesCartes

  	});


	
  }
import { useState, useEffect } from "react";
import { useParams, useNavigate, json } from "react-router-dom";

import api from "../../services/api";
import './filme-info.css';



function Filme() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [filme, setFilme] = useState({});
  const [ loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadFilme() {
      await api.get(`/movie/${id}`, {
        params: {
          api_key: "28fc232cc001c31e8a031f419d0a14ca",
          language: "pt-BR",
        }
      })
      .then((response)=>{
        console.log(response.data)
        setLoading(false);
        setFilme(response.data);
      })
      .catch(() =>{
        console.log('página não encontrada')
        navigate("/", {replace: true})
        return;
      })
    }

    loadFilme();
    

    return() =>{
      console.log("COMPONENTE FOI DESMONTADO")
    }
  }, [navigate, id]);

  function saveFilm(){
    const minhaLista = localStorage.getItem('@primeflix');

     let filmeSalvos = JSON.parse(minhaLista) || [];

     const hasFilme = filmeSalvos.some( (filmesSalvos) => filmesSalvos.id === filme.id);

    if(hasFilme){
      alert('esse filme já foi salvo');
      return;
    }

    filmeSalvos.push(filme);
    localStorage.setItem('@primeflix', JSON.stringify(filmeSalvos));
    alert('filme salvo com sucesso')
    
  };

  function handleGenre(){
  return  filme.genres.map((genre) => genre.name).join(", ")
  };
  

  if(loading){
    return(
      <div className='loading'>
        <h1>Carregando detalhes...</h1>
      </div>
    )
  }

  return (
    <div className='filme-info'>
      
      <h1>{filme.title}</h1>
      <img src={`https://image.tmdb.org/t/p/original${filme.backdrop_path}`} alt={filme.title} />

      <h3>Sinopse</h3>
      <span>{filme.overview}</span>
      
      <strong>Avaliação: {filme.vote_average} /10</strong>
      <h3>Genero: {handleGenre()}</h3>
    
    <div className='area-buttons'>
      <button onClick={saveFilm}>Salvar</button>
      <button>
        <a target='blank' rel='external' href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>Trailer</a>
      </button>
    </div>
    
    </div>
  );
}

export default Filme;

import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import stockImg from '../assets/stock_img.png';

function Details() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const imdbID = searchParams.get('id');
  const previousState = location.state;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!imdbID) {
        setError("No movie ID provided");
        setLoading(false);
        return;
      }

      
      const url = `https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections`;

      try {
        setLoading(true);
        const response = await axios.get(url);
        
        if (response.data.Response === "True") {
          setMovieDetails(response.data);
          setError(null);
        } else {
          setError(response.data.Error || "Movie not found");
          setMovieDetails(null);
        }
      } catch (err) {
        setError("Failed to fetch movie details. Please try again.");
        setMovieDetails(null);
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  if (loading) {
    return (
      <div id="app__container">
        <div className="loading-reel"></div>
      </div>
    );
  }

  const handleBackClick = () => {
    if (previousState?.from === '/search') {
      navigate('/search', { 
        state: { 
          searchQuery: previousState.searchQuery,
          yearMin: previousState.yearMin,
          yearMax: previousState.yearMax,
          shouldSearch: true
        } 
      });
    } else {
      navigate(-1);
    }
  };

  if (error) {
    return (
      <div id="app__container">
        <button onClick={handleBackClick} className="back-button">← Back to Results</button>
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div id="app__container">
        <button onClick={handleBackClick} className="back-button">← Back to Results</button>
        <p>No movie details available</p>
      </div>
    );
  }

  return (
    <div id="app__container">
      <button onClick={handleBackClick} className="back-button">← Back to Results</button>
      <div className="movie-details">
        <div className="movie-details__header">
          <img 
            src={movieDetails.Poster !== "N/A" ? movieDetails.Poster : stockImg} 
            alt={movieDetails.Title}
            className="movie-details__poster"
          />
          <div className="movie-details__info">
            <h1>{movieDetails.Title} ({movieDetails.Year})</h1>
            <p><strong>Rated:</strong> {movieDetails.Rated}</p>
            <p><strong>Released:</strong> {movieDetails.Released}</p>
            <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
            <p><strong>Genre:</strong> {movieDetails.Genre}</p>
            <p><strong>Director:</strong> {movieDetails.Director}</p>
            <p><strong>Writer:</strong> {movieDetails.Writer}</p>
            <p><strong>Actors:</strong> {movieDetails.Actors}</p>
            <p><strong>Language:</strong> {movieDetails.Language}</p>
            <p><strong>Country:</strong> {movieDetails.Country}</p>
            {movieDetails.imdbRating !== "N/A" && (
              <p><strong>IMDb Rating:</strong> {movieDetails.imdbRating}/10</p>
            )}
          </div>
        </div>
        <div className="movie-details__plot">
          <h2>Plot</h2>
          <p>{movieDetails.Plot}</p>
        </div>
        {movieDetails.Awards !== "N/A" && (
          <div className="movie-details__awards">
            <h3>Awards</h3>
            <p>{movieDetails.Awards}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Details
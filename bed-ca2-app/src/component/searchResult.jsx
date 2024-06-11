import React from 'react';
import HeaderDiv from './header';
import NavBar from './navBar';

function Results() {

    // when the user click on a film, it will redirect to the film page with the film id 
    const handleClicked = film_id => {
        window.location.assign(`http://localhost:3000/film/:${film_id}`);
    }

    // retrieve the films from local storage
    const arrayOfFilms = JSON.parse(localStorage.getItem('films'));

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className='display-1'>Results</h1>
            <div style={{ width: 1080 }}>
                {arrayOfFilms.length === 0 ?
                    <p className='text-center'>No results found</p>
                    : arrayOfFilms.map(film => {
                        return <button onClick={() => handleClicked(film['film_id'])} key={film['film_id']} value={film['film_id']} style={{ borderRadius: '10px', border: '2px solid black', backgroundColor: 'lightblue', display: "flex", flexDirection: "column", width: '100%', margin: 20 }}>
                            <h3 style={{ padding: 10, textAlign: 'left' }}>{film['title']}</h3>
                            <p style={{ textAlign: 'left', fontSize: 18, paddingLeft: 10 }}>Rating: {film['rating']}</p>
                            <p style={{ textAlign: 'left', fontSize: 18, paddingLeft: 10 }}>Release year: {film['release_year']}</p>
                        </button>
                    })}
            </div>
        </div>
    );
}

function SearchPage() {
    return (
        <div style={{ background: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )' }}>
            <HeaderDiv />
            <NavBar />
            <Results />
        </div>
    )
}
export default SearchPage;
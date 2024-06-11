import React, { useState, useEffect } from 'react';
import HeaderDiv from './header';
import axios from 'axios';
import NavBar from './navBar';
import { useParams } from 'react-router-dom';

function Film() {

    const [element, setElement] = useState('')
    const film_id = useParams().film_id.slice(1);

    useEffect(() => {
        // if film_id contains nothing, render a page saying "please choose a film to view in details"
        if (!film_id) {
            setElement(
                <div className='mx-auto text-center'>
                    <p style={{ fontSize: 18, margin: 20 }}>Please choose a film to view in details.</p>
                </div>
            )
        } else {
            axios.get(`http://localhost:3001/film/${film_id}`)
                .then((res => {
                    // check filmDetails. If undefined, means the film id is out of range.
                    if (!res.data.filmDetails) {
                        setElement(
                            <div className='mx-auto text-center'>
                                <p style={{ fontSize: 18, margin: 20 }}>Film does not exists.</p>
                            </div>
                        )
                    } else {
                        setElement(
                            <div className='rounded border border-dark' style={{ width: '100%', margin: 20, alignItems: 'center', backgroundColor: 'lightskyblue' }}>
                                <h3 style={{ padding: 10, textAlign: 'left', color: 'crimson', fontWeight: 700 }}>Title: {res.data.filmDetails.title}</h3>
                                <h5 style={{ padding: 10 }}>Category: {res.data.filmDetails.category}</h5>
                                <h5 style={{ padding: 10 }}>Release year: {res.data.filmDetails.release_year}</h5>
                                <h5 style={{ padding: 10, paddingBottom: 0 }}>Description:</h5>
                                <h5 style={{ padding: 10, paddingTop: 0 }}>{res.data.filmDetails.description}</h5>
                                <h5 style={{ padding: 10 }}>Rating: {res.data.filmDetails.rating}</h5>
                                <h5 style={{ padding: 10, paddingBottom: 0 }}>Actor(s):</h5>
                                <h5 style={{ padding: 10, paddingTop: 0 }}>
                                    {res.data.filmActors.map(actor => {
                                        return `${actor.first_name} ${actor.last_name}`;
                                    }).join(', ')}</h5>
                            </div>
                        )
                    }
                }))
                .catch(err => {
                    console.log(err);
                    setElement(
                        <div className='mx-auto text-center'>
                            <p style={{ fontSize: 18, margin: 20 }}>Error getting film details.</p>
                        </div>
                    )
                })
        }
    }, [])

    function returnToSeach() {
        window.location.assign('/search');
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{width: '90%'}} className='d-flex flex-row justify-content-evenly'>
                <button style={{height: 50, marginTop: 35}} onClick={returnToSeach}>{'< Go back'}</button>
                <h1 className='display-1'>Results</h1>
                <div></div>
            </div>
            <div style={{ width: 960 }}>
                {element}
            </div>
        </div>
    );
}

function FilmPage() {
    return (
        <div style={{ background: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )' }}>
            <HeaderDiv />
            <NavBar />
            <Film />
        </div>
    )
}
export default FilmPage;
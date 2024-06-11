import React, { useState } from 'react';
import HeaderDiv from './header';
import axios from 'axios';
import NavBar from './navBar';

function ActorSection() {
    const [subString, setSubString] = useState("");
    const [actorElements, setActorElements] = useState(<div></div>);

    const options = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const handleSubStringChange = (e) => {
        setSubString(e.target.value);
    };

    const handleDelete = e => {
        axios.delete(`http://localhost:3001/actors/${e.target.value}`, options)
            .then(res => {
                alert('Actor deleted successfully');
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                alert('Error deleting actor.');
            })
    }

    const handleRedirectToEdit = (actor_id) => {
        window.location.assign(`/edit_actor/${actor_id}`);
    }

    const handleRedirectToAdd = () => {
        window.location.assign('/add_actor');
    }

    // in this function, make a query to get the actors based on substring
    const handleSubmit = e => {
        e.preventDefault();

        axios.get(`http://localhost:3001/actors?substring=${subString}`, options)
            .then(res => {
                // proceed to show the list of actors
                // if the array is empty, then display "no results found"
                if (res.data.length === 0) {
                    return setActorElements(
                        <div>
                            <p className='text-center'>No results found</p>
                        </div>
                    )
                }
                setActorElements(
                    res.data.map((actor) => {
                        // if no actor, display a text saying no results found, or else show the list of actors
                        return (
                            res.data.length === 0 ?
                                <p>No results found</p>
                                :
                                <div key={actor.actor_id} value={actor.actor_id} style={{ borderRadius: '10px', border: '2px solid black', backgroundColor: 'white', display: "flex", width: '100%', margin: 10, padding: 10 }}>
                                    <h3 style={{ padding: 10, textAlign: 'left' }}>{actor.first_name} {actor.last_name}</h3>
                                    <button onClick={() => { handleRedirectToEdit(actor.actor_id) }} style={{ alignSelf: 'right', marginLeft: 'auto', borderRadius: '10px', padding: 5 }}>Edit actor</button>
                                    <button onClick={handleDelete} value={actor.actor_id} style={{ borderRadius: '10px', padding: 5, marginLeft: 10 }}>Delete actor</button>
                                </div>
                        )
                    })
                )
            })
            .catch(err => {
                if (err.response && err.response.status === 403) {
                    return alert('You do not have the authority to make this action.');
                }
                console.log(err)
                alert('Error fetching actors');
            })
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <form onSubmit={handleSubmit}>
                <h1 style={{ margin: "30px" }} className='display-2 justify-content-center text-center'>Manage actor database</h1>
                <div style={{ width: 720 }}>
                    <div className='text-center'>
                        <button type='button' onClick={handleRedirectToAdd} style={{ margin: "20px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#3f51b5", color: "white" }}>Add new actor</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", margin: "20px", alignItems: 'center', padding: 20 }}>
                        <label htmlFor="text-input-1">Search actor by name:</label>
                        <input
                            type="text"
                            id="text-input-1"
                            value={subString}
                            onChange={handleSubStringChange}
                            style={{ margin: "10px 0", padding: "10px", fontSize: "16px", borderRadius: 10, width: 420 }}
                        />
                        <button type='submit' style={{ margin: "20px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#3f51b5", color: "white" }}>Search</button>
                    </div>
                    <div style={{ width: 720 }}>
                        {actorElements}
                    </div>
                </div>
            </form>
        </div>
    );
}

function ActorPage() {
    return (
        <div style={{ background: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )', paddingBottom: '6%' }}>
            <HeaderDiv />
            <NavBar />
            <ActorSection />
        </div>
    )
}
export default ActorPage;
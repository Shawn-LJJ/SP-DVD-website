import React, { useState } from 'react';
import HeaderDiv from './header';
import axios from 'axios';
import NavBar from './navBar';

function AddActor() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // the authorisation header which will consists of the token
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }

        // the data that is to be used to create a new actor
        const body = {
            first_name: firstName,
            last_name: lastName
        }
        axios.post(`http://localhost:3001/actors`, body, options)
            .then((res) => {
                alert('Actor created successfully.');
                window.location.assign('/manage_actor');
            })
            .catch(err => {
                console.log(err);
                // check error response status code. If status is 400, it's invalid input. 403 will then be unauthorised action. Alert the client appropriately
                if (err.response) {
                    if (err.response.status === 400) {alert('Please provide both the first and last name to create the new actor.');}
                    else if (err.response.status === 403) {alert('You do not have the authority to make this action.');}
                    else {alert('Error adding actor');};
                } else {
                    alert('Error adding actor');
                }
            })
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className='display-1'>Add actor</h1>
            <div style={{ width: 960 }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: "column", margin: "20px", alignItems: 'center', padding: 20 }}>
                        <label htmlFor="text-input-1">Enter first name:</label>
                        <input
                            type="text"
                            id="text-input-1"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            style={{ margin: "10px 0", padding: "10px", fontSize: "16px", borderRadius: 10, width: 420 }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", margin: "20px", alignItems: 'center', padding: 20 }}>
                        <label htmlFor="text-input-1">Enter last name:</label>
                        <input
                            type="text"
                            id="text-input-1"
                            value={lastName}
                            onChange={handleLastNameChange}
                            style={{ margin: "10px 0", padding: "10px", fontSize: "16px", borderRadius: 10, width: 420 }}
                        />
                    </div>
                    <p className='text-center'>Please provide both the first and last name of the actor before proceeding to create a new actor.</p>
                    <div className={'text-center'}>
                        <button type='submit' style={{ margin: "20px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#3f51b5", color: "white" }}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddActorPage() {
    return (
        <div style={{ background: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )' }}>
            <HeaderDiv />
            <NavBar />
            <AddActor />
        </div>
    )
}
export default AddActorPage;
import React, { useState } from 'react';
import HeaderDiv from './header';
import axios from 'axios';
import NavBar from './navBar';
import { useParams } from 'react-router-dom';

function Edit() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const actor_id = useParams().actor_id;

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

        // the data that is to be edited
        const body = {
            first_name: firstName,
            last_name: lastName
        }
        axios.put(`http://localhost:3001/actors/${actor_id}`, body, options)
            .then((res) => {
                // if client somehow requested an edit on an actor that does not exists, alert
                if (res.status === 204) {return alert('The actor that you are trying to edit does not exists')};
                alert('Actor edited successfully.');
                window.location.assign('/manage_actor');
            })
            .catch(err => {
                console.log(err);
                
                // check error response status code. If status is 400, it's invalid input. 403 will then be unauthorised action. Alert the client appropriately
                if (err.response) {
                    if (err.response.status === 400) {alert('Please enter at least one field to make the changes.');}
                    else if (err.response.status === 403) {alert('You do not have the authority to make this action.');}
                    else {alert('Error editing actor');};
                } else {
                    alert('Error editing actor');
                }
            })
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className='display-1'>Edit actor</h1>
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
                    <p className='text-center'>Edit either the first or last or both name of the actor. At least one of the field must be entered before submitting.</p>
                    <div className={'text-center'}>
                        <button type='submit' style={{ margin: "20px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#3f51b5", color: "white" }}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditPage() {
    return (
        <div style={{ background: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )' }}>
            <HeaderDiv />
            <NavBar />
            <Edit />
        </div>
    )
}
export default EditPage;
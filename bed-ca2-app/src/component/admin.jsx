import React, { useState } from 'react';
import HeaderDiv from './header';
import axios from 'axios';

// component for the admin login
function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // change email state after user key in the email
    const handleEmailChange = e => {
        setEmail(e.target.value);
    }

    // change password state after user key in the password
    const handlePasswordChange = e => {
        setPassword(e.target.value);
    }

    // make an axios post request after user click the log in button
    const handleSubmit = e => {
        e.preventDefault();

        // create the payload to be sent to the back end
        const body = {
            email: email,
            password: password
        }

        // make an axios post request
        axios.post('http://localhost:3001/admin', body)
        .then(response => {
            localStorage.setItem('token', response.data.token);
            window.location.assign('http://localhost:3000');
        })
        .catch(error => {alert('Invalid credentials')});
    }

    // styling object for the whole admin login component
    const styling = {
        background: 'linear-gradient(90deg, #7cd8df, #ffffff, #7cd8df)',
        borderRadius: '50px',
        border: '2px solid black',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: '540px'
    }

    return (
        <div style={styling} className='mx-auto'>
            <h1 style={{backgroundColor: "lightblue", padding: '10px', margin: '30px'}}>Welcome back!</h1>
            <form onSubmit={handleSubmit}>
                <div style={{display: "flex", flexDirection: "column", margin: "20px"}}>
                    <label htmlFor="Email">Email:</label>
                    <input 
                        type="text" 
                        id="Email" 
                        value={email} 
                        onChange={handleEmailChange} 
                        style={{margin: "10px 0", padding: "10px", fontSize: "16px", borderRadius: 10, width: 420}}
                    />
                </div>
                <div style={{display: "flex", flexDirection: "column", margin: "20px"}}>
                    <label htmlFor="Password">Password:</label>
                    <input 
                        type="password" 
                        id="Password" 
                        value={password} 
                        onChange={handlePasswordChange} 
                        style={{margin: "10px 0", padding: "10px", fontSize: "16px", borderRadius: 10, width: 420}}
                    />
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: "20px"}}>
                    <button type='submit' style={{padding: "10px 20px", fontSize: "16px", backgroundColor: "#3f51b5", color: "white", borderRadius: 10}} className='mx-auto'>Log in</button>
                </div>
            </form>
        </div>
    )

}

function AdminPage() {
    return (
        <div>
            <HeaderDiv />
            <AdminLogin />
        </div>
    )
}

export default AdminPage;
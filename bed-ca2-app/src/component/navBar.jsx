import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const Navigation = () => {
    // set the links provided to be empty
    const [links, setLinks] = useState([]);
    // boolean state to check if the client is logged in
    const [isLoggedIn, setLogin] = useState(false);

    // after the component has been loaded, attempt to query the back end to verify whether or not the client is an admin
    useEffect(() => {

        // get the token and then query
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.get('http://localhost:3001/verify_for_links', options)
            .then((res) => {
                // if the backend return with a success, then it means it's an admin, thus setting the links state to hold the admin links
                setLinks(res.data);

                // and since it is a success, it implies the client has been logged in. So it should display the log out link if the client wants to log out
                setLogin(true);
            })
            .catch(err => {
                // if the error is because of status code 403, then don't log the error since it's just a typical general user and no other issue on the server and client
                if (err.response && err.response.status === 403) {return}
                console.log(err);
            })
    }, [])

    const logOut = () => {
        window.localStorage.removeItem('token');
        window.location.reload();
    }

    function DisplayLogInOrOut() {
        return (
            <div style={{padding: 10, alignSelf: 'right', marginLeft: 'auto'}}>
                {isLoggedIn ? <Link to='#' onClick={logOut} style={styles.endLink}>Log out</Link> : <a href="/admin" style={styles.endLink}>Log in</a>}
            </div>
        )
    }

    // map the links object key (which contains the name of the link) and the value (which contains the actual URL) to the "a" element
    return (
        <div style={styles.container}>
            <a href="/" style={styles.homeLink}>Home</a>
            {links.map((link) => {
                return <a href={Object.values(link)[0]} style={styles.middleLink}>{Object.keys(link)[0]}</a>
            })}
            <DisplayLogInOrOut />
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        padding: 20,
        backgroundColor: "#333",
        color: "white"
    },
    homeLink: {
        color: "white",
        textDecoration: "none",
        padding: 10,
        alignSelf: 'left'
    },
    middleLink: {
        color: "white",
        textDecoration: "none",
        padding: 10,
        alignSelf: 'left'
    },
    endLink: {
        color: "white",
        textDecoration: "none"
    }
};

export default Navigation;

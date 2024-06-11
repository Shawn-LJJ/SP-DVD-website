import React, { useState, useEffect } from 'react';
import HeaderDiv from './header';
import axios from 'axios';
import NavBar from './navBar';

function SearchArea() {
    const [subString, setSubString] = useState("");
    const [rentalRate, setRentalRate] = useState("");
    const [selectedOption, setSelectedOption] = useState("Select category");
    const [categoryList, setCategoryList] = useState([]);

    // get all the list of categories once the component is loaded
    useEffect(() => {
        axios.get('http://localhost:3001/categories')
            .then(response => {
                console.log(response.data);
                setCategoryList(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);

        // if the user chose the default "Choose category" option, don't proceed since it's not a category but a prompt
        if (e.target.value === 'None') {return};

        // if rental rate is provided, append the max rental rate query
        let s = rentalRate ? `?maxRental=${rentalRate}` : '';

        // makes a query based on the category chosen as well as the max rental rate if provided
        axios.get(`http://localhost:3001/film_categories/${e.target.selectedIndex}/films${s}`)
            .then(res => {
                // store the array of films in the local storage then redirect to the search result page
                localStorage.setItem('films', JSON.stringify(res.data));
                window.location.assign('http://localhost:3000/search');
            })
            .catch(err => {
                alert('Error: Invalid input');
                setSelectedOption('Select Category');
            })
    };

    const handleSubStringChange = (e) => {
        setSubString(e.target.value);
    };

    const handleRentalRateChange = (e) => {
        setRentalRate(e.target.value);
    };

    // in this function, make a query to get the film based on substring and the max rental rate
    const handleSubmit = e => {
        e.preventDefault();

        // if rental rate is provided, append the max rental rate query
        let s = rentalRate ? `&maxRental=${rentalRate}` : '';

        axios.get(`http://localhost:3001/films?substring=${subString}${s}`)
            .then(res => {
                // store the array of films in the local storage then redirect to the search result page
                localStorage.setItem('films', JSON.stringify(res.data));
                window.location.assign('http://localhost:3000/search');
            })
            .catch(err => {
                console.log(err)
                alert('Error searching.');
            })
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <form onSubmit={handleSubmit}>
                <h1 style={{ margin: "30px" }} className='display-2 justify-content-center text-center'>Home</h1>
                <div className='rounded border border-dark' style={{ width: 720 }}>
                    <h3 className='text-decoration-underline text-center p-4'>Search film either by name or category</h3>
                    <div style={{ display: "flex", flexDirection: "column", margin: "20px", alignItems: 'center', padding: 20 }}>
                        <label htmlFor="text-input-1">Enter film name:</label>
                        <input
                            type="text"
                            id="text-input-1"
                            value={subString}
                            onChange={handleSubStringChange}
                            style={{ margin: "10px 0", padding: "10px", fontSize: "16px", borderRadius: 10, width: 420 }}
                        />
                        <button type='submit' style={{ margin: "20px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#3f51b5", color: "white" }}>Search</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
                        <label htmlFor="text-input-2">Max price*:</label>
                        <input
                            type="text"
                            id="text-input-2"
                            value={rentalRate}
                            onChange={handleRentalRateChange}
                            style={{ margin: "10px 0", padding: "10px", fontSize: "16px", borderRadius: 10, width: 240 }}
                        />
                        <p>*filters out film exceeding the rental price specified</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
                        <label htmlFor="dropdown">Category:</label>
                        <select
                            id="dropdown"
                            value={selectedOption}
                            onChange={handleOptionChange}
                            style={{ margin: "10px 0", padding: "10px", fontSize: "16px" }}
                        >
                            <option key={'Select Category'} value={'None'}>Select Category</option>
                            {categoryList.map((category) => {
                                return <option key={category['category_id']} value={category['name']}>{category['name']}</option>
                            })}
                        </select>
                        <p>Set the max price to filter out</p>
                    </div>
                </div>
            </form>
        </div>
    );
}

function HomePage() {
    return (
        <div style={{ background: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )', paddingBottom: '6%' }}>
            <HeaderDiv />
            <NavBar />
            <SearchArea />
        </div>
    )
}
export default HomePage;
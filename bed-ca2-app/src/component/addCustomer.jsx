import React, { useState } from 'react';
import HeaderDiv from './header';
import axios from 'axios';
import NavBar from './navBar';

function AddCustomer() {

    const [store_id, setStore_id] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [district, setDistrict] = useState('');
    const [cityName, setCityName] = useState('');
    const [postal, setPostal] = useState('');
    const [phone, setPhone] = useState('');

    const handleStore_idChange = (e) => {
        setStore_id(e.target.value);
    }

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    }

    const handleAddress2Change = (e) => {
        setAddress2(e.target.value);
    }

    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
    }

    const handleCityNameChange = (e) => {
        setCityName(e.target.value);
    }

    const handlePostalChange = (e) => {
        setPostal(e.target.value);
    }

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // the authorisation header which will consists of the token
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }

        // the data that is to be used to create a new customer
        const body = {
            first_name: firstName,
            last_name: lastName,
            store_id: store_id,
            email: email,
            addressObj: {
                address: address,
                address2: address2,
                district: district,
                city_id: cityName,
                postal_code: postal,
                phone: phone
            }
        }

        axios.post(`http://localhost:3001/customers`, body, options)
            .then((res) => {
                alert('Customer created successfully.');
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                // check error response status code. Alert the client appropriately
                if (err.response) {
                    if (err.response.data && err.response.data.error_msg === 'missing data') {
                        return alert('Please fill up all the required information.');
                    }

                    if (err.response.data && err.response.data.error_msg === 'The city inputted does not exists') {
                        return alert('The city inputted does not exists.');
                    }

                    if (err.response.data && err.response.data.error_msg === 'inappropriate value') {
                        return alert('Please ensure the data you inputted are of the correct type.');
                    }

                    if (err.response.data && err.response.data.error_msg === 'store id out of range') {
                        return alert('Store ID does not exists. Please enter another one.');
                    }

                    if (err.response.status === 409) {
                        return alert('The email you inputted has already exists. Please enter a new one.');
                    }

                    if (err.response.status === 403) {
                        return alert('You do not have the authority to make this action.');
                    }
                } 
                alert('Error adding customer.');
            })
    }

    // the input template that is going to be used for all the input fields
    function inputTemplate(labelName, variable, setChangeFunction) {
        return (
            <div style={{ display: "flex", margin: "10px", alignItems: 'center', padding: 10 }}>
                <label htmlFor="text-input-1" className='text-center' style={{ fontSize: 21 }}>Enter {labelName}:</label>
                <input
                    type="text"
                    id="text-input-1"
                    value={variable}
                    onChange={setChangeFunction}
                    style={{ padding: "10px", fontSize: "16px", borderRadius: 10, width: '75%', marginLeft: 'auto' }}
                />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className='display-1 m-5'>Add customer</h1>
            <div className='rounded border border-dark' style={{ width: 920, padding: 15, marginBottom: 50 }}>
                <form onSubmit={handleSubmit}>
                    {inputTemplate('first name', firstName, handleFirstNameChange)}
                    {inputTemplate('last name', lastName, handleLastNameChange)}
                    {inputTemplate('email', email, handleEmailChange)}
                    {inputTemplate('store ID', store_id, handleStore_idChange)}
                    {inputTemplate('address', address, handleAddressChange)}
                    {inputTemplate('address 2*', address2, handleAddress2Change)}
                    {inputTemplate('district', district, handleDistrictChange)}
                    {inputTemplate('city name', cityName, handleCityNameChange)}
                    {inputTemplate('postal code*', postal, handlePostalChange)}
                    {inputTemplate('phone no.', phone, handlePhoneChange)}
                    <p className='text-center'>Fields denoted with * are optional.</p>
                    <div className={'text-center'}>
                        <button type='submit' style={{ margin: "20px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#3f51b5", color: "white" }}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddCustomerPage() {
    return (
        <div style={{ background: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )' }}>
            <HeaderDiv />
            <NavBar />
            <AddCustomer />
        </div>
    )
}
export default AddCustomerPage;
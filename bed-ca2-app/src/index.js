import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./component/home";
import Admin from "./component/admin";
import Search from "./component/searchResult";
import FilmPage from './component/filmPage';
import ManageActor from './component/manageActor';
import EditActor from './component/editActor';
import AddActorPage from './component/addActor';
import AddCustomerPage from './component/addCustomer';
import Error from "./component/error";
// import Login from "../component/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';


function App() {

  const [userRole, setUserRole] = useState(null);

  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }

  useEffect(() => {
    axios.get('http://localhost:3001/verify_to_access', options)
      .then(res => {
        setUserRole(res.data.role);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossorigin="anonymous"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path='/search' element={<Search />} />
            <Route path='/film/:film_id' element={<FilmPage />} />
            {userRole === 'admin' ? (
              <>
                <Route path='/manage_actor' element={<ManageActor />} />
                <Route path='/edit_actor/:actor_id' element={<EditActor />} />
                <Route path='/add_actor' element={<AddActorPage />} />
                <Route path='/add_customer' element={<AddCustomerPage />} />
              </>
            ) : null}
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
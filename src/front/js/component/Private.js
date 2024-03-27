import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom'
import { Context } from "../store/appContext";
 

const Private = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.privateZone()
  }, []);


  if (!store.autentificacion) {
    return <Navigate to = "/"/>;
  }

  const user = localStorage.getItem("email")

  return (
    < >
       <div className="jumbotron jumbotron-fluid background-private">
        <div className= "container-private">
            <h1 className='display-1'>¡HOLA!</h1>
            <p className='display-4'> USUARIO</p>
            <p className='display-5'>{user}</p>
            <p className="display-6"><strong>Espero que tengas un buen día</strong></p>
        
        <Link to={"/"}>
          <button type="btn" className='btn btn-secondary'>Back home</button>
        </Link>
        </div>
      </div>
    
    </ >
  )
}
 
export default Private

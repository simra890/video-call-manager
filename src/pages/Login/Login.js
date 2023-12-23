import React from 'react';
import './Login.css';

export default function Login({ setLogin }) {

  return (
    <>
      <div className="login-form">
        <form className='in-form'>
          <label className='l-label' htmlFor="username">Username/Usn:</label>
          <input className='l-input' type="text" id="username" name="username" required />

          <label className='l-label' htmlFor="password">Password:</label>
          <input className='l-input' type="password" id="password" name="password" required />

          <button onClick={() => setLogin(false)} className='l-button'>Login</button>
        </form>
      </div>
    </>
  );
}

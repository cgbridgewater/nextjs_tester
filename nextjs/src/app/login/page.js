"use client";

import { useContext, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Login = () => {
    const { login, loginError, setLoginError  } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');


    const modalRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalTitle("LOGIN ERROR")
        setErrorMessage(''); // Reset the error messages
        setLoginError(''); // Reset the error messages

        try {
            await login(username, password);
        } catch (error) {
            // console.log('Login Failed:', error);
            // setErrorMessage( error.response.data.detail);
            // Open the modal
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setModalTitle("REGISTRATION ERROR")
        setErrorMessage(''); // Reset the error messages
        setLoginError(''); // Reset the error messages
        try {
            const response = await axios.post('http://localhost:8000/auth', {
                username: registerUsername,
                password: registerPassword,
            });
            await login(registerUsername, registerPassword);
        } catch (error) {
            console.error('Something went wrong, try again:', error);
            setErrorMessage( error.response.data.detail);
            // Open the modal
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();
        }
    };


    return (
        <div className="container mt-4 p-2 border border-dark">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>

            <h2 className='mt-5'>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="registerUsername" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="registerUsername"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="registerPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="registerPassword"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">Register</button>
                </div>
            </form>



            {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal
            </button> */}
            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title text-danger" id="exampleModalLabel">{modalTitle}!</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-dark">
                        {errorMessage} {loginError? "Bad Username or Password": ""}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
            </div>







        </div>
    );
};

export default Login;

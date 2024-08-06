"use client";

import { useContext, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const { login,  register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const modalRef = useRef(null);


    // LOGIN FUNCTION - PASSES TO AUTH CONTEXT
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);  // Call login from auth context
        } catch (error) {
            setErrorMessage(error.message);  // Error message comes from login function
            setModalTitle("LOGIN ERROR");  //Set Error Title for Error Modal
            // Construct and Open the modal
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();
        }
    };


    // REGISTRATION FUNCTION MOVED TO AUTH CONTEXT
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(registerUsername, registerPassword);  // Call register from auth context
        } catch (error) {
            setErrorMessage(error.message);  // Error message comes from register function
            setModalTitle("REGISTRATION ERROR");  //Set Error Title for Error Modal
            // Construct and Open the modal
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();
        }
    };


    return (
        <div className="container mt-4 p-2 border border-dark">
            {/* LOGIN FORM */}
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
            {/* END LOGIN FORM */}
            {/* REGISTER FORM */}
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
            {/* END REGISTER FORM */}
            {/* ERRORS MODAL */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title text-danger" id="exampleModalLabel">{modalTitle}!</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-dark">
                            {/* ERROR MESSAGES - REG ARE SPECIFIC TO ERROR, LOGIN IS GENERIC */}
                            {errorMessage}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* END ERRORS MODAL */}
        </div>
    );
};

export default Login;
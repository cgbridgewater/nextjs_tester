// components/EmailForm.js

import { useState } from 'react';

const EmailForm = () => {
    // State for the form fields
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Make POST request to the API route
        const res = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, text }),
        });

        const data = await res.json();
        
        if (data.success) {
            setSuccess('Email sent successfully!');
            setError(null);
        } else {
            setError(data.message);
            setSuccess(null);
        }
    };

    return (
        <div>
            <h2>Send an Email</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Recipient's email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Email body"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Email</button>
            </form>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default EmailForm;

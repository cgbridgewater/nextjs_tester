"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [userName, setUserName] = useState('');
    const [success, setSuccess] = useState('');
    const [mailError, setMailError] = useState('');
    const [errorCount, setErrorCount] = useState(0);
    const [mailFail, setMailFail] = useState(false);


    const sendMail = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                subject,
                message,
                contact,
                userName,
            }),
        });

        // check response for error and set message accordingly
        await response.json();
        // use this if you want/need to dive deeper into the json response --> ////const data = await response.json();////
        if (response.ok) {
            // If successful, set success message
            setSuccess('Your message was successfully sent!');
            // Clear any existing error messages to prevent double messages
            setMailError('');
            // Reset The Error Counting
            setErrorCount(0);
            setMailFail(false);
            // Clear the form fields
            setSubject('');
            setMessage('');
            setContact('');
            setUserName('');

            // Set timeout to redirect after 10 seconds
            setTimeout(() => {
                window.location.href = '/'; // Redirect to Home page after timer completes
            }, 4000);
        } else {
            // Set error message
            setMailError('An error has occurred, please try again.');
            // Increment and handle counter on total failure
            const newErrorCount = errorCount + 1; // Increment errorCount
            setErrorCount(newErrorCount); // Update state to new count
            // set failure message on 3 error counts
            if (newErrorCount >= 3) {
                setMailFail(true);
            }
            // Clear any existing success messages to prevent double messages
            setSuccess('');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {/* FORM SECTION*/}
            <form onSubmit={sendMail} className="h-full w-1/2 space-y-6 border border-black m-4 p-6">
                {/* TITLE SECTION */}
                <div className="flex flex-row items-start w-full justify-between">
                    <h1 className="text-xl font-semibold">Test McTestersons Test Email</h1>
                    <Link href="/" className="text-xl font-semibold no-underline">Go Home</Link>
                </div>
                {/* CLIENT NAME */}
                <div className="relative flex flex-col space-y-1">
                    <label htmlFor="contact" className="text-sm font-light text-gray-500">
                        Name:
                    </label>
                    <input
                        name="userName"
                        type="text"
                        id="userName"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Contact Name"
                        className="rounded-xl border-2 border-gray-400 p-2"
                    />
                </div>
                {/* CLIENT CONTACT EMAIL */}
                <div className="relative flex flex-col space-y-1">
                    <label htmlFor="contact" className="text-sm font-light text-gray-500">
                        Contact Email:
                    </label>
                    <input
                        name="contact"
                        type="text"
                        id="contact"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Contact Email"
                        className="rounded-xl border-2 border-gray-400 p-2"
                    />
                </div>
                {/* CLIENT SUBJECT */}
                <div className="relative flex flex-col space-y-1">
                    <label htmlFor="title" className="text-sm font-light text-gray-500">
                        Subject
                    </label>
                    <input
                        name="title"
                        type="text"
                        id="title"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Type Subject Here..."
                        className="rounded-xl border-2 border-gray-400 p-2"
                    />
                </div>
                {/* CLIENT MESSAGE */}
                <div className="relative flex flex-col space-y-1">
                    <label htmlFor="description" className="text-sm font-light text-gray-500">
                        What would you need help with?
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        required
                        cols={10}
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What can we help you with?"
                        className="rounded-xl border-2 border-gray-400 p-2"
                    />
                </div>
                {/* SUBMIT BUTTON */}
                <div className='flex flex-row items-start w-full justify-center'>
                    <button type='submit' className="w-1/2 space-x-3 rounded-lg bg-blue-600 p-2 text-white shadow-blue-500 hover:bg-blue-800 hover:shadow-xl">
                        <span>Send Test Message</span>
                    </button>
                </div>
            {/* ERROR / SUCCESS MESSAGES */}
            <div className='flex flex-column items-center w-full justify-center'>
                {mailError && <h1 className="text-xl font-bold text-red-500 mt-0">{mailError}</h1>}
                {mailFail && (
                    <>
                        <h5 className="text-base text-red-500 mt-2 mb-0">We are experiencing technical problems</h5>
                        <h5 className="text-base text-red-500 m-0">Please contact us directly at - </h5>
                        <h5 className="text-base font-bold text-black mb-2">{process.env.NEXT_PUBLIC_EMAIL_USER}</h5>
                    </>
                )}
                {success && (
                    <>
                        <h1 className="text-xl font-semibold text-green-500 mt-4">{success}</h1>
                        <p className="text-l font-semibold text-black-100 m-0">Redirecting you home...</p>
                        <Link href="/" className="mt-2 text-lg text-blue-600">Click here if you are not redirected</Link>
                    </>
                )}
            </div>
            </form>
        </main>
    );
};
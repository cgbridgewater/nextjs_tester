// pages/index.js
'use client'
import Head from 'next/head';
import EmailForm from './EmailForm';

const MailUs = () => {
    return (
        <div>
            <Head>
                <title>MailJet Email Example</title>
            </Head>
            <main>
                <h1>Welcome to the MailJet Email Example</h1>
                <EmailForm />
            </main>
        </div>
    );
};

export default MailUs;
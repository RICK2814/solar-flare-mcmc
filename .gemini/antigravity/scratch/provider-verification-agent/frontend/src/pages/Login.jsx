import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            // Send token to backend
            const res = await axios.post('http://localhost:8000/auth/google', {
                token: credential
            });

            console.log('Login Success:', res.data);
            localStorage.setItem('token', res.data.access_token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Failed:', error);
        }
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                <p className="text-slate-600 mb-8">Sign in to access the Provider Verification Agent</p>

                <div className="flex flex-col gap-4 justify-center items-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap
                    />

                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">Or for Demo</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSuccess({ credential: "mock_token_for_demo@example.com" })}
                        className="w-full py-2 px-4 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors font-medium"
                    >
                        Demo Login (Bypass Google)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;

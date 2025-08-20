import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Intentando iniciar sesión con:', { username });

            // Usar el método login del contexto de autenticación
            await login(username, password);

            console.log('Login exitoso, redirigiendo...');

            // Redirigir después de un pequeño delay para asegurar que el estado se actualice
            setTimeout(() => {
                navigate('/recaudacion');
            }, 100);
        } catch (err) {
            console.error('Error completo:', err);
            console.error('Response data:', err.response?.data);
            console.error('Status code:', err.response?.status);
            console.error('Headers:', err.response?.headers);

            let errorMessage = 'Error al iniciar sesión';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = `Error: ${err.message}`;
            } else if (!err.response) {
                errorMessage = 'Error de conexión con el servidor';
            }

            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white" >
            <div className="absolute inset-0 z-0 flex items-start justify-center overflow-hidden">
                <img 
                    src="/fondo-login.png" 
                    className="w-auto h-[600px] max-w-none opacity-90 mix-blend-soft-light" 
                    style={{
                        objectFit: 'contain',
                        objectPosition: 'center top'
                    }}
                    alt="Fondo Archivo Regional" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/30"></div>
            </div>
            <div className="max-w-md w-full space-y-8 p-8 bg-[#615d5da9]/35 backdrop-blur-md rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 z-20">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-700">
                        Iniciar Sesión
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-600">
                            Usuario
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-md shadow-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-600">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-md shadow-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-gray-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-gray-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

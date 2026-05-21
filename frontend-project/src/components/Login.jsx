import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess, onShowRegister }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    axios
      .post('http://localhost:5000/api/login', { username, password }, { withCredentials: true })
      .then((res) => onLoginSuccess(res.data.user))
      .catch((err) => setError(err.response?.data?.message || 'Invalid credentials'));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">SIMS</h2>
        <p className="text-slate-500 text-sm text-center mb-6">NYAGATARE District, eastern Province</p>

        {error && (
          <p className="text-red-500 mb-4 text-sm text-center font-semibold bg-red-50 py-1.5 rounded">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-slate-700 font-medium mb-1.5 text-sm">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-700 font-medium mb-1.5 text-sm">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md transition duration-200 shadow-sm"
        >
          Log In
        </button>

        <div className="mt-4 text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={onShowRegister}
            className="text-blue-700 font-bold hover:underline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;

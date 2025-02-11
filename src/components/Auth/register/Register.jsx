import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ fullname: '', username: '', email: '', password: '', birthday: '' });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    setIsRegistering(true);
    e.preventDefault();
    axios
      .post(`${URL}auth/register`, form)
      .then(() => {
        navigate('/login');
        setIsRegistering(false);
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.error('Registration error:', err.response);
      });
  };

  return (
    <div className="h-screen flex justify-center items-center bg-pink-100">
      <div className="max-w-md w-full mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          {/* Header */}
          <div className="welcome mb-2 text-center">
            <h2 className="text-3xl font-bold text-pink-700">Create an Account</h2>
            <p className="text-pink-500">Register to get started</p>
          </div>

          {/* Fullname */}
          <div className="mb-4">
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Fullname"
              className="w-full focus:outline-none p-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              required
              autoFocus
            />
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full focus:outline-none p-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full focus:outline-none p-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full focus:outline-none p-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Birthday */}
          <div className="mb-4">
            <label htmlFor="birthday" className="block text-pink-600 font-medium mb-2">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="w-full focus:outline-none p-2 border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-3 mb-4 text-red-600 bg-red-100 border border-red-400 rounded">
              <div className="text-xl font-bold">!</div>
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-2 ${isRegistering ? 'bg-pink-400' : 'bg-pink-500 hover:bg-pink-600'} focus:outline-pink-400 text-white font-semibold rounded transition`}
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </button>

          {/* Footer Notes */}
          <div className="mt-4 text-xs text-pink-600 italic">
            <span className="text-red-600">*</span> Your fullname, email, and birthday {"aren't"} visible to the public.
          </div>

          {/* Redirect to Login */}
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-pink-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
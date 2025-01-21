import { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedinCtx } from '../../../App';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(LoggedinCtx);
  const URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${URL}auth/login`, form)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        setIsLoggedIn(true);
        navigate('/');
        location.reload();
      })
      .catch(err => {
        setError(err.response.data.message || "Failed to logging in");
        console.error('Login error: ', err.response);
      });
  };

  return (
      <div className="h-screen flex justify-center items-center bg-pink-100">
        <div className="max-w-sm mx-auto justify-center items-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
            <div className='welcome mb-6'>
              <h2 className='text-2xl font-bold text-pink-600 text-center mb-5'>Welcome</h2>
              <p className='text-center text-pink-600'>Login to your account</p>
            </div>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Email"
              className="w-full p-2 mb-4 border focus:outline-none border-pink-300 rounded focus:ring-2 focus:ring-pink-500"
              autoFocus
            />
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="Password" 
              className="w-full p-2 mb-4 border focus:outline-none border-pink-300 rounded focus:ring-2 focus:ring-pink-500"
            />
            {error &&
              <div className="text-red-500 p-2 rounded-md w-full bg-pink-200 items-center gap-4 flex mb-2">
                <div className='sign px-[10px] rounded-full border-2 border-pink-500'>!</div>
                <p className=''>{error}</p>
              </div>
            }
            <button 
              type="submit" 
              className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition-all"
            >
              Login
            </button>
            <p className='mt-5 text-pink-600'>Not a member yet?
              <span className='font-bold text-pink-700'>
                <Link to='/register'> Sign up</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
  );
};

export default Login;
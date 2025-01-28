import { useState } from 'react';

const CreateMenfes = () => {
  const [message, setMessage] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [targetUsername, setTargetUsername] = useState('');
  const [alert, setAlert] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const URL = `${import.meta.env.VITE_BACKEND_URL}menfes/`;

  const handleSubmit = async () => {
    setIsSending(true);

    try {
      const response = await fetch(`${URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message,
          visibility,
          targetUsername: visibility === 'private' ? targetUsername : null,
        }),
      });

      const result = await response.json();
      if (!message) {
        setAlert("Please write your menfes first!");
        setSuccess(false);
        return;
      }

      if (response.ok) {
        setAlert(result.message);
        setMessage('');
        setVisibility('public');
        setTargetUsername('');
        setSuccess(true);
      } else {
        setAlert(result.error || 'Failed to send menfes!');
        setSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setAlert('An error occurred');
      setSuccess(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-pink-50 shadow-md rounded-lg mt-10 border border-pink-200">
      <h2 className="text-3xl font-semibold text-pink-600 mb-4 text-center">Create Menfes</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-pink-700 mb-2">Message</label>
        <textarea
          placeholder="Write your menfes here..."
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-pink-700 mb-2">Visibility</label>
        <select
          value={visibility}
          name="visibility"
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      {visibility === 'private' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-pink-700 mb-2">Target Username</label>
          <input
            type="text"
            name="subject"
            placeholder="Enter username"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            className="w-full p-3 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      )}
      {alert && (
        <p
          className={`${
            success ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'
          } mb-4 p-2 rounded-md text-center`}
        >
          {alert}
        </p>
      )}
      <button
        onClick={handleSubmit}
        className="w-full bg-pink-500 text-white py-3 rounded-md font-semibold hover:bg-pink-600 transition"
      >
        {isSending ? 'Sending...' : 'Send menfess'}
      </button>
    </div>
  );
};

export default CreateMenfes;

import { useState } from 'react';

export default function RegistrationPage() {
  const [Cname, setCname] = useState('');
  const [Cpass, setCpass] = useState('');
  const [Caddress, setCaddress] = useState('');
  const [Cphone, setCphone] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Cname, Cpass, Caddress, Cphone }),
      });
      const result = await response.json();

      if (response.ok) {
        alert('Registration Successful!');
        window.location.href = '/';
      } else {
        alert(result.message || 'Something went wrong');
      }
      
    } catch (err) {
      console.error('Error registering:', err);
      alert('Error registering!');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={Cname}
            onChange={(e) => setCname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={Cpass}
            onChange={(e) => setCpass(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={Caddress}
            onChange={(e) => setCaddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="number"
            value={Cphone}
            onChange={(e) => setCphone(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

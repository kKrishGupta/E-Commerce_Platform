import React,{useState,useContext} from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () =>{
  const [name, setName] = useState('');
  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const{login} = useContext(AuthContext);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration Failed");
      return;
    }

    alert(data.message || "Registration Successful");

    // Clear Form
    setName("");
    setEmail("");
    setPassword("");

    // Navigate to OTP Verification
    navigate("/verify-otp", {
      state: { email },
    });

  } catch (error) {
    console.error(error);

    alert("Something went wrong. Please try again.");
  }
};

 return (
  <div className="auth-container">
    <form action="" onSubmit={handleSubmit} className="auth-form">
      <h1>Register</h1>
      <input type="text" placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit"
      className='btn'>Register</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  </div>
 )
}
export default Register;
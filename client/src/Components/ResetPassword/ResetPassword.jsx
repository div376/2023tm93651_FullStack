import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading/Loading';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset link');
    }
  }, [token]);

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/user/reset_password/${token}`, // Include token in URL
        { password: newPassword } // Use 'password' for consistency with backend
      );
      setLoading(false);
      if (response.data.message === 'Password reset successful') {
        setSuccess('Password reset successful');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to reset password');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="shadow-lg p-5">
            <h2 className="text-center">Reset Your Password</h2>
            {error && <div className="text-danger">{error}</div>}
            {success && <div className="text-success">{success}</div>}
            <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
              <input
                type="password"
                className="form-control my-2"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control my-2"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="btn btn-primary w-100 mt-2" type="submit">
                Reset Password
              </button>
            </form>
            {loading && <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
}

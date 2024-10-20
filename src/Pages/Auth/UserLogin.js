import React, { useState } from 'react';
import { Box, Button, Alert, TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useUserLoginMutation } from '../../services/authApi';
import { storeAuthId, getAuthId, storeTempUserDetails, storeToken, getToken } from '../../services/LocalStorage';

const UserLogin = () => {
  const [authid, setAuthId] = useState(getAuthId());
  const [error, setError] = useState({
    status: false,
    msg: '',
    type: '',
  });

  const handleErrorTimeout = (message, type) => {
    setError({ status: true, msg: message, type: type });
    setTimeout(() => {
      setError({ status: false, msg: '', type: '' });
    }, 5000);
  };

  const [userLogin, { isLoading }] = useUserLoginMutation();
  const navigate = useNavigate();

  const emailRegex = /^\S+@(?!invalid\.com)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{6,}$/;

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    };

    if (actualData.email && actualData.password !== null) {
      if (!emailRegex.test(actualData.email)) {
        handleErrorTimeout("Please enter a valid email address", 'error');
        return;
      }
      if (!passwordRegex.test(actualData.password)) {
        handleErrorTimeout("Password must be at least 6 characters long and contain at least one special character.", 'error');
        return;
      }

      try {
        const res = await userLogin(actualData).unwrap();
        console.log(res);

        if (res && res.status === 'success') {
          if (res.authid) {
            setAuthId(authid);
            storeAuthId(actualData.email);
            storeTempUserDetails(actualData);
            setTimeout(() => {
              navigate('/verifylogin');
              window.location.reload();
            },);
          } else {
            console.error('authid is not defined in the response:', res);
            handleErrorTimeout('Error during registration: authid is missing', 'error');
          }
        } else if (res && res.status === 'failed') {
          handleErrorTimeout(res.message, 'error');
        } else {
          console.error('Unexpected response format:', res);
          handleErrorTimeout('Unexpected response format', 'error');
        }
      } catch (err) {
        console.error('Error during login:', err);
        handleErrorTimeout('You are not registered', 'error');
      }
    } else {
      handleErrorTimeout('All fields are required', 'error');
    }
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', color: 'navy' }}>Welcome!!!</h2>
      <Box
        component="form"
        noValidate
        sx={{
          mt: 1,
          p: 1,
          maxWidth: '400px',
          margin: 'auto',
        }}
        id="login-form"
        onSubmit={handleSubmit}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="Email Address"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handlePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ textAlign: 'center', mt: 1, color: 'white' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, px: 5, backgroundColor: 'white', color: 'navy', fontWeight: '550' }}
            >
              Sign-in
            </Button>
          )}
          {error.status && <Alert severity={error.type}>{error.msg}</Alert>}
        </Box>
      </Box>
    </>
  );
};

export default UserLogin;

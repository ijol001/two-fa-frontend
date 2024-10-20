import React from 'react';
import { Box, Grid,  Button, Alert, TextField, InputAdornment, IconButton, CircularProgress} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserRegMutation} from '../../services/authApi';
import {  storeAuthId, getAuthId,storeTempUserDetails } from '../../services/LocalStorage';


const UserReg = () => {
  const Refresh = () => {
    window.location.reload();
  };

  const [authid, setAuthId] = useState(getAuthId())
  const [error, setError] = useState({
    status: false,
    msg: '',
    type: '',
  });

  useEffect(() => {
    if (error.status) {
      const timer = setTimeout(() => {
        setError(prevError => ({ ...prevError, status: false }));
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [error.status]);
  
  const navigate = useNavigate();
  const [userReg, { isLoading }] = useUserRegMutation();

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const emailRegex = /^\S+@(?!invalid\.com)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;

  const handleErrorTimeout = (message, type) => {
    setError({ status: true, msg: message, type: type });
    setTimeout(() => {
      setError({ status: false, msg: '', type: '' });
    }, 5000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      email: data.get('email'),
      password: data.get('password'),
      password_confirmation: data.get('password_confirmation'),
    };
  
    if (actualData.first_name && actualData.last_name && actualData.email && actualData.password && actualData.password_confirmation) {
      if (!emailRegex.test(actualData.email)) {
        handleErrorTimeout('Please enter a valid email address', 'error' );
        return;
      }
      if (!passwordRegex.test(actualData.password)) {
        handleErrorTimeout( "Password must be at least 8 characters long and contain at least one special character and one alphanumeric character.", 'error' );
        return;
      }
      if (actualData.password === actualData.password_confirmation) {
        try {
          const res = await userReg(actualData).unwrap();
          console.log('Response:', res);
  
          if (res && res.status === 'success') {
            if (res.authid) {
              setAuthId(authid);
              storeAuthId(actualData.email);
              storeTempUserDetails(actualData);
              setTimeout(() => {
                navigate('/verifyreg');
                window.location.reload();
              },);
            } else {
              console.error('authid is not defined in the response:', res);
              handleErrorTimeout('Error during registration: authid is missing','error' );
            }
          } else if (res && res.status === 'failed') {
            console.error('Error during registration:', res.message);
            handleErrorTimeout( res.message, 'error' );
          } else {
            console.error('Unexpected response structure:', res);
            handleErrorTimeout('Unexpected response structure',  'error' );
          }
        } catch (error) {
          console.error('Error during registration:', error);
          handleErrorTimeout('Error during registration', 'error' );
        }
      } else {
        handleErrorTimeout("Password and Confirm Password don't match!",'error' );
      }
    } else {
      handleErrorTimeout('All fields are required', 'error' );
    }
  };

  useEffect(() => {
    console.log('Auth ID:', authid);
  }, [authid]);

  return (
    <>
      <h2 style={{ textAlign: 'center', color: 'navy' }}>Welcome!!!</h2>
        
          <Box component="form" noValidate sx={{ mt: 0, p: 1, maxWidth: '400px', margin: 'auto' }} id="reg-form" onSubmit={handleSendOTP}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField margin="normal" required fullWidth id="first_name" name="first_name" label="First Name" />
              </Grid>
              <Grid item xs={6}>
                <TextField margin="normal" required fullWidth id="last_name" name="last_name" label="Last Name" />
              </Grid>
            </Grid>
            <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />
            <TextField
              margin='normal' required fullWidth id='password' name='password' type={showPassword ? 'text' : 'password'} label='Password' InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handlePasswordVisibility} edge='end'>
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin='normal' required fullWidth id='password_confirmation' name='password_confirmation' type='password' label='Confirm Password' />

<Box sx={{ textAlign: 'center', mt: 1, color: 'white' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, px: 5, backgroundColor: 'white', color: 'navy', fontWeight: '550' }}
            >
              Sign-up
            </Button>
          )}
        </Box>
            {error.status && <Alert severity={error.type} sx={{ textAlign: 'center' }}>{error.msg}</Alert>}
          </Box>    
    </>
  )
}

export default UserReg;



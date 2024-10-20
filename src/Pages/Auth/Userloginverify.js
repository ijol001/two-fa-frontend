import React, { useState } from 'react';
import { Box, Button, Tabs, Tab, TextField, Alert, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { storeToken, getAuthId, getTempUserDetails, removeAuthId, removeTempUserDetails } from '../../services/LocalStorage';
import { useVerifyloginOTPMutation } from '../../services/authApi';

const Userloginverify = () => {
  const [otp, setOtp] = useState('');
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [authid, setAuthId] = useState(getAuthId());
  const [error, setError] = useState({ status: false, msg: '', type: '' });
  const [verifyLoginOTP, { isLoading }] = useVerifyloginOTPMutation();
  const navigate = useNavigate();
  const actualData = getTempUserDetails();

  const handleErrorTimeout = (message, type) => {
    setError({ status: true, msg: message, type: type });
    setTimeout(() => {
      setError({ status: false, msg: '', type: '' });
    }, 5000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const GetactualData = { email: authid, actualData, otp };

    try {
      const res = await verifyLoginOTP(GetactualData).unwrap();
      if (res.status === 'success') {
        handleErrorTimeout(res.message, 'success');
        storeToken(res.token);
        removeAuthId();
        removeTempUserDetails();
        setTimeout(() => {
          navigate('/Dashboard');
          window.location.reload();
        }, 4000);
      } else {
        handleErrorTimeout(res.message, 'error');
      }
    } catch (err) {
      handleErrorTimeout("OTP verification failed", 'error');
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textshadow="3px 2px 2px white"
        display="flex"
        flexDirection="column"
        sx={{
          background: 'linear-gradient(to right, black, purple, navy, black)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          padding: 2,
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          sx={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
            borderRadius: 8,
            backdropFilter: 'blur(20px)',
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              centered
              TabIndicatorProps={{ style: { backgroundColor: 'navy' } }}
              sx={{ marginBottom: 2 }}
            >
              <Tab label="Verify OTP" sx={{ textTransform: 'none', fontWeight: 'bold', color: 'navy' }} />
            </Tabs>
            <Box component="form" sx={{ p: 3, display: 'flex', justifyContent: 'center' }} noValidate id="verify-otp-regform" onSubmit={handleVerifyOTP}>
              <TextField required fullWidth id="otp" label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} margin="normal" />
              <br />
              <Box sx={{ m: 2, display: 'flex', justifyContent: 'center' }}>
                {isLoading ? <CircularProgress /> : <Button type="submit" variant="contained" color="info">Verify</Button>}
                {error.status && <Alert severity={error.type} sx={{ textAlign: 'center' }}>{error.msg}</Alert>}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Userloginverify;

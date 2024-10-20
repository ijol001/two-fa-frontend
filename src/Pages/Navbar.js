import React from 'react'
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { getToken } from '../services/LocalStorage'

const Navbar = () => {
    const token = getToken('token')
    return (
        <Box sx={{ flexGrow: 3 }}>
            <AppBar position='static' sx={{ color: 'white', backgroundColor: 'navy' }}>
                <Toolbar>
                    <Typography fontSize='22px' fontFamily='forte' component="div" sx={{ flexGrow: 2 }}>
                        Authentication 
                    </Typography>

                    <Button component={NavLink} to='/' style={({ isActive }) => { return { backgroundColor: isActive ? 'white' : '', color: isActive ? 'black' : '' } }} sx={{ color: 'white', fontFamily: 'serif', fontSize: '20px', textTransform: 'none' }}>Sign-in </Button>
                    {token && <Button component={NavLink} to='/dashboard' style={({ isActive }) => { return { backgroundColor: isActive ? 'white' : '', color: isActive ? 'black' : '' } }} sx={{ color: 'white', fontFamily: 'serif', fontSize: '20px', textTransform: 'none' }}>Dashboard</Button> 
                    }

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;

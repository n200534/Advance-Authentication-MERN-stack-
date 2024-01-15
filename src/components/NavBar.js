import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


function Header() {


    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Link to='/login'>
                    <Button size="small" >Login</Button>
                </Link>

                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                >
                    AUTHENTICATION
                </Typography>



                <Link to='/signup'>
                    <Button variant="outlined" size="small">
                        Sign up
                    </Button>
                </Link>

            </Toolbar>

        </React.Fragment>
    );
}



export default Header;
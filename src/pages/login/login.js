import React, { useEffect, useRef, useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, Redirect} from "react-router-dom";
import { useAuth } from "../../context/auth";
import Alert from '@material-ui/lab/Alert';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));




const Login = () => {
    const [option, setOption] = React.useState('');
    const [user, setUser] = React.useState('patients');
    const [value, setValue] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [password, setPassword] =  React.useState("");
    const [isError, setIsError] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);

    const { setAuthTokens } = useAuth();
    const _isMounted = useRef(true); // Initial value _isMounted = true

    const classes = useStyles();


      
    const handleChange = (event) => {
        setOption(event.target.value);
    };

        
    const handleUser = (event) => {
      setUser(event.target.value);
    };
    
    const handleValue = (event) => {
      setValue(event.target.value);
    };
    
    const handlePassword = (event) => {
      setPassword(event.target.value);
    };


    useEffect(() => {
      return () => {
        // ComponentWillUnmount in Class Component
        _isMounted.current = false;
      };
    }, []);
  
    
    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);
        
        let data = {user_type:user, password:password}
        if(option === "email"){
            data['email'] = value
        }
        else if(option === "phone"){
            data['phone_number'] = value
        }
        else
        {
            data['aadhar_number'] = value
        }


        fetch("https://api.ashacares.com/v1/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then((response) => { 
              console.log(response.message);
              console.log(_isMounted.current);
              if ( response.message === "Success"){
                console.log("wohoooo");
                localStorage.setItem("username", response.data[0].user_name);
                localStorage.setItem("userid", response.data[0].user_id);
                localStorage.setItem("usertype", response.data[0].user_type);
                setAuthTokens(response.data[0].token);
                setLoggedIn(true);
                setLoading(false);
              
              }
              else{
                setIsError(true);
                setLoading(false);
                <Alert severity="error">Incorrect Details</Alert>
              }
        })
            .catch((error) => {
              setIsError(true);
              setLoading(false);
              console.error("Error:", error)});
        };
   
        if (isLoggedIn && user === "patients") {
          return <Redirect to="/patient" />;
        }
        else if (isLoggedIn && user === "providers") {
          return <Redirect to="/doctor" />;
        }

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
          
                <TextField
                    variant="outlined"
                    id="select-option"
                    select
                    fullWidth
                    name="option"
                    label="Login Using"
                    value={option}
                    onChange={handleChange}

                    >
                    <MenuItem value={`email`}>Email</MenuItem>
                    <MenuItem value={`phone`}>Phone Number</MenuItem>
                    <MenuItem value={`aadhar`}>Aadhar Number</MenuItem>
                </TextField>

                <TextField
                    variant="outlined"
                    margin="normal"
                    id="standard-select-user"
                    select
                    fullWidth
                    label="User Type"
                    name ="User"
                    value={user}
                    onChange={handleUser}
                    helperText="Please select your user type"
                    >
                    <MenuItem value={`providers`}>Doctor</MenuItem>
                    <MenuItem value={`patients`}>Patient</MenuItem>
                </TextField>
            
            { option === "email" && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={value}
              onChange={handleValue}
              autoComplete="email"
              autoFocus
            />
            )}
            { option === "phone" && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              value={value}
              onChange={handleValue}
              autoComplete="phone"
              autoFocus
            />
            )}
            { option === "aadhar" && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="aadhar"
              label="Aadhar Number"
              name="aadhar"
              value={value}
              onChange={handleValue}
              autoComplete="aadhar"
              autoFocus
            />
            )}
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              onChange={handlePassword}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
                 {loading && <CircularProgress color="secondary" />}
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="#" >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          {isError && (
                  <div style={{ backgroundColor: "red"}} >
                    The username or password provided were incorrect!
                  </div>
                )}
        </div>

      </Container>
      );
    
}

export default Login






import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, Redirect} from "react-router-dom";
import moment from 'moment';
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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



function Register() {
    const classes = useStyles();
    const [user, setUser] = React.useState('');
    const [isUserCreated, setUserCreated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [state, setState] = React.useState({
        aadhar_number: "",
        phone_number: "",
        password: "",
        name: "",
        email: "",
        gender: "",
        date_of_birth: moment(new Date()).format("YYYY-MM-DD"),
        registration_number: "",
        whatsapp_number: "",
      })
    
    
    const handleUser = (event) => {
        console.log(event);
      setUser(event.target.value);
    };
   
    
    const handleChange = (evt) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
          });
        
          
        };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);
        
        state["user_type"] = user;
        let data =  state ;
        if(user === "patients"){
            const {whatsapp_number, registration_number, ...partialObject} = state ;
            console.log(partialObject);
            data = partialObject
        }

        fetch("https://api.ashacares.com/v1/signup", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then((response) => { 
              if (response.type === "Success"){
                setLoading(false);
                <Alert severity="success">User Created Successfully — Login!</Alert>
                setUserCreated(true);
                console.log("Success:");
              }
        })
            .catch((error) =>{ console.error("Error:", error)
            setLoading(false);
          });
        };
        if (isUserCreated) {
        return <Redirect to="/login" />;
        }

    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={1}>
            <Grid item xs={12} >
                <TextField
                    variant="outlined"
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
            </Grid>

            
                <Grid item xs={12} >
                  <TextField
                    autoComplete="name"
                    name="name"
                    variant="outlined"
                    required
                    fullWidth
                    id="Name"
                    label="Name"
                    value={state.name}
                    onChange={handleChange}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="aadhar"
                    label="Aadhar Number"
                    name="aadhar_number"
                    value={state.aadhar_number}
                    onChange={handleChange}
                    autoComplete="aadhar"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    name="phone_number"
                    value={state.phone_number}
                    onChange={handleChange}
                    autoComplete="Phone"
                    helperText="Please inlcude your country code as well(ex: +91)"
                  />
                </Grid>
               
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={state.password}
                    onChange={handleChange}
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </Grid>

                <Grid item xs={12} >
                <TextField
                    variant="outlined"
                    id="select-gender"
                    select
                    fullWidth
                    name="gender"
                    label="Gender"
                    value={state.gender}
                    onChange={handleChange}

                    >
                    <MenuItem value={`Male`}>Male</MenuItem>
                    <MenuItem value={`Female`}>Female</MenuItem>
                    <MenuItem value={`Others`}>Others</MenuItem>
                </TextField>
            </Grid>

                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    id="date"
                    label="Birthday"
                    name="date_of_birth"
                    fullWidth
                    type="date"
                    value={state.date_of_birth}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                        }}
                    />
   
                </Grid>
               
               { user === "providers" && 
               (<>
  
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="register-number"
                    label="Registration Number"
                    name="registration_number"
                    value={state.registration_number}
                    onChange={handleChange}
                    autoComplete="registration"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="whatapp_number"
                    label="Whats App Number"
                    name="whatsapp_number"
                    value={state.whatsapp_number}
                    onChange={handleChange}
                    autoComplete="whatsapp"
                  />
                </Grid>
                </>
                )
                
                }
                

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                  {loading && <CircularProgress color="secondary" />}
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>

        </Container>
      );
 
}

export default Register








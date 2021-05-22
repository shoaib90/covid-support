import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import {  Redirect} from "react-router-dom";
import { useAuth } from "../../context/auth";



const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  },
}));

const tiers = [
  // {
  //   title: 'Free',
  //   price: '0',
  //   description: ['10 users included', '2 GB of storage', 'Help center access', 'Email support'],
  //   buttonText: 'Sign up for free',
  //   buttonVariant: 'outlined',
  // },
  {
    title: 'Pro',
    subheader: 'Most popular',
    price: '15',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },

];
const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
  },
  {
    title: 'Resources',
    description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

export default function PatientDashboard() {

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isConsultationBooked, setConsultationBooked] = React.useState(false);
  const [illness, setIllness] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [selectedIllness, setselectedIllness] = React.useState('');

  const classes = useStyles();

  const { setAuthTokens } = useAuth();

  function logOut() {
    setAuthTokens("");
    localStorage.setItem("username", "");
    // <Redirect to="/login" />;
  }

  const handleSelected = (evt) => {
    setselectedIllness(evt.target.value);
};

const handleIllnessSubmit = (evt) => {
  evt.preventDefault();
  setLoading(true);

  fetch(`https://api.ashacares.com/v1/get-doctors/teleconsultation/${selectedIllness}`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      "x-api-key": `Bearer ${localStorage.getItem("tokens")}`,
      }
  })
      .then(response => response.json())
      .then((response) => { 
        if (response.type === "Success"){
          setData(response.data);
          setLoading(false);
          setSuccess(true);
          // setShow(false);
          setConsultationBooked(true)
          console.log("Success:");
        }
        else{
          console.error("Something wrong with the request")
          setLoading(false);
      setError(true);      
        }
  })
      .catch((error) =>{     
      console.error("Error:", error)
      setLoading(false);
      setError(true);
    });

}
const fetchDynamicData = () => {
  const url = `https://api.ashacares.com/v1/dynamic-data`;

  fetch(url, {
    headers: {
      "x-api-key": `Bearer ${localStorage.getItem("tokens")}`,
    },
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.type === "Success") {
        setIllness(result.data.illness);
      } 
    });
};

React.useEffect(() => {
  fetchDynamicData();
}, []);

if (isConsultationBooked) {
  return <Redirect to={{
    pathname: "/patient/show",
    state: { value: data }
  }} />;
  }


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            Covid App
          </Typography>
   
          <Button  color="primary" variant="outlined" onClick={logOut} className={classes.link}>
            LogOut
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Book Consultation
        </Typography>
        {/* <Typography variant="h5" align="center" color="textSecondary" component="p">
          Quickly build an effective pricing table for your potential customers with this layout.
          It&apos;s built with default Material-UI components with little customization.
        </Typography> */}
        {success && <Alert severity="success" onClose={() => {setSuccess(false)}}>Response Updated!</Alert>}
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end" style={{justifyContent:"center"}}>
        {error && <Alert severity="error" onClose={() => {setError(false)}}>Request Denied!</Alert> }
          <form className={classes.form} onSubmit={handleIllnessSubmit} noValidate>
          <TextField
                    variant="outlined"
                    id="select-illness"
                    margin="normal"
                    select
                    fullWidth
                    name="illness"
                    label="Select Illness"
                    value={selectedIllness}
                    onChange={handleSelected}

                    >
                    {illness.map((val) => {
                       return (
                            <MenuItem key={val} value={val}>{val}</MenuItem>
                        )
                    })}
                    
                    
                </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              // className={classes.submit}
            >
                {loading && <CircularProgress color="secondary" />}
              Book
            </Button>
          </form>
  

                  {/* <Button fullWidth variant="contained" color="primary">
                    Get Started
                  </Button> */}
      
        
        </Grid>
      </Container>
      {/* Footer */}
      {/* <Container maxWidth="md" component="footer" className={classes.footer}>
        <Grid container spacing={4} justify="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="textSecondary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>

      </Container> */}
      {/* End footer */}
    </React.Fragment>
  );
}
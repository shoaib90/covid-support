import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import MenuItem from '@material-ui/core/MenuItem';
import { useAuth } from "../../context/auth";
import "./doctor.css"




  
  function getModalStyle() {
    const top = 50 
    const left = 50 
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }


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
    alignItems:"flex-start",
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '5px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  pos: {
    marginBottom: 12,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

}));



export default function DoctorDashboard() {
 
    const [show, setShow] = React.useState(false);
    const [start_time, setStartTime] = React.useState(moment(new Date()).format("HH:mm"));
    const [end_time, setEndTime] = React.useState(moment(new Date()).format("Hh:Mm"));
    const [loading, setLoading] = React.useState(false);
    const [loadingDelete, setloadingDelete] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [availability, setAvailability] = React.useState("Available");
    const [field, setField] = React.useState("");
    const [consultations, setConsultations] = React.useState([]);
    const [illness, setIllness] = React.useState([]);
    const [methods, setMethod] = React.useState("POST");
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(true);
  
    const handleOpen = () => {
      setOpen(true);
    };
    const handleModal = () => {
      setShow(true);
    };
    
    const handleTime = (evt) => {
      setStartTime(evt.target.value);
    };
    
    const handleAvailability = (evt) => {
      setAvailability(evt.target.value);
    };
    const handleField = (evt) => {
        setField(evt.target.value);
    };
    

    const fetchData = () => {
        const id = localStorage.getItem("userid")
        const url = `https://api.ashacares.com/v1/get-provider-consultation-topics/${id}`;
    
        fetch(url, {
          headers: {
            "x-api-key": `Bearer ${localStorage.getItem("tokens")}`,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.type === "Success") {
              setConsultations(result.data);
              setloadingDelete(false);
            } 
          });
      };
    
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
        fetchData();
        fetchDynamicData();
      }, []);

    const handleDelete = (value,id) => {
        
        setloadingDelete(true);

        let data =  {
            provider_id:parseInt(localStorage.getItem("userid")),
            topic:value,
            pct_mapping_id:id 
        };

        fetch("https://api.ashacares.com/v1/doctor-category", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json",
            "x-api-key": `Bearer ${localStorage.getItem("tokens")}`,
            }
        })
            .then(response => response.json())
            .then((response) => { 
              if (response.type === "Success"){
                fetchData();
                // setloadingDelete(false);
                console.log("Success:");
              }
              else{
                console.error("Something wrong with the request")
            setError(true);      
              }
        })
            .catch((error) =>{     
            console.error("Error:", error)
            setloadingDelete(false);
            setError(true);
          });

    }

    const handleConsultationSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);
        console.log(field);

        let data =  {
            provider_id:parseInt(localStorage.getItem("userid")),
            topic:field
        };

        fetch("https://api.ashacares.com/v1/doctor-category", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json",
            "x-api-key": `Bearer ${localStorage.getItem("tokens")}`,
            }
        })
            .then(response => response.json())
            .then((response) => { 
              if (response.type === "Success"){
                fetchData();
                setLoading(false);
                setSuccess(true);
                // setShow(false);
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
    
    
    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);
    
        let data =  {
            provider_id:parseInt(localStorage.getItem("userid")),
            duty_date:moment(new Date()).format("YYYY/MM/DD"),
            start_time:start_time,
            end_time:end_time,
            current_status:availability
        };


        fetch("https://api.ashacares.com/v1/set-status-availability", {
            method: methods,
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json",
            "x-api-key": `Bearer ${localStorage.getItem("tokens")}`,
            }
        })
            .then(response => response.json())
            .then((response) => { 
              if (response.type === "Success"){
                setLoading(false);
                setSuccess(true);
                setMethod("PUT");
                setOpen(false);
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
        };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleModalClose = () => {
      setShow(false);
    };
  const classes = useStyles();

  const { setAuthTokens } = useAuth();

  function logOut() {
    setAuthTokens("");
    localStorage.setItem("username", "");
    // <Redirect to="/login" />;
  }

  const handleChange = (evt) => {
    const value = evt.target.value;
    setEndTime(value);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Select your Availability</h2>
         <CloseIcon color="primary" className="close_modal" variant="contained"  onClick = {handleClose}>Close</CloseIcon>
         {error && <Alert severity="error" onClose={() => {setError(false)}}>Can't Be Updated!</Alert> }
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
                    variant="outlined"
                    id="date"
                    margin="normal"
                    label="Start Time"
                    name="start_time"
                    fullWidth
                    type="time"
                    value={start_time}
                    onChange={handleTime}
                    InputLabelProps={{
                        shrink: true,
                        }}
                    />
               <TextField
                    variant="outlined"
                    id="date"
                    margin="normal"
                    label="End Time"
                    name="end_time"
                    fullWidth
                    type="time"
                    value={end_time}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                        }}
                    />
                
                <TextField
                    variant="outlined"
                    id="select-option"
                    margin="normal"
                    select
                    fullWidth
                    name="option"
                    label="Set Availability"
                    value={availability}
                    onChange={handleAvailability}

                    >
                    <MenuItem value={`Available`}>Available</MenuItem>
                    <MenuItem value={`Not Available`}>Not Available</MenuItem>
                </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
                {loading && <CircularProgress color="secondary" />}
              Submit
            </Button>
          </form>
        </div>
      );

      const body2 = (
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Select Consultation Topic</h2>
          <CloseIcon color="primary" className="close_modal" variant="contained"  onClick = {handleModalClose}>Close</CloseIcon>
          {error && <Alert severity="error" onClose={() => {setError(false)}}>Request Denied!</Alert> }
          <form className={classes.form} onSubmit={handleConsultationSubmit} noValidate>
          <TextField
                    variant="outlined"
                    id="select-consultation"
                    margin="normal"
                    select
                    fullWidth
                    name="consulting"
                    label="Set Consultation"
                    value={field}
                    onChange={handleField}

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
              className={classes.submit}
            >
                {loading && <CircularProgress color="secondary" />}
              Submit
            </Button>
          </form>

          <Divider />
          <List component="nav" aria-label="main mailbox folders">
          {loadingDelete && <CircularProgress style={{position:"absolute",top:"0%",left:"50%"}} color="secondary" />}
          {consultations.map((value)=> {
              return (
                <ListItem button key={value.topic}> 
                <ListItemIcon>
                <IconButton aria-label="delete" onClick={() => handleDelete(value.topic,value.pct_mapping_id)}>
                    <DeleteIcon />

                </IconButton>
                </ListItemIcon>
                <ListItemText primary={value.topic} />
                
              </ListItem>
              )
              
          })}
          </List>
        </div>
      );

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            Covid App
          </Typography>
          <Button href="#" color="primary" variant="outlined" onClick={logOut} className={classes.link}>
            LogOut
          </Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.heroContent} fluid="true" >
      <Button  color="primary" variant="outlined" onClick={handleModal} className={classes.link}>
            Consultation Topics
        </Button>
      <Button  color="primary" variant="outlined" onClick={handleOpen} className={classes.link}>
            Update Availability
        </Button>
      {success && <Alert severity="success" onClose={() => {setSuccess(false)}}>Response Updated!</Alert>}
       
</Container>

<Container fluid="true">
<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
</Modal>

<Modal
        open={show}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body2}
</Modal>
      

</Container>

        
   
   

    </React.Fragment>
  );
}
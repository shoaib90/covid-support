import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import {  Redirect} from "react-router-dom";
import { useAuth } from "../../context/auth";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import PhoneEnabledIcon from '@material-ui/icons/PhoneEnabled';
import { IconButton } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
 
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

  table: {
    minWidth: 450,
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

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

function createData(name, whatsapp, phone, status) {
    return { name, whatsapp, phone, status};
  }



function PatientData(props) {
    const data =  props.location.state.value;
    const rows = [];
    data.map((val)=>{rows.push(createData(val.name, val.whatsapp, val.phone, val.current_status))})
    

    console.log(rows)

    const classes = useStyles();
    const { setAuthTokens } = useAuth();

    function logOut() {
      setAuthTokens("");
      localStorage.setItem("username", "");
      // <Redirect to="/login" />;
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
    
        <Container maxWidth="md" component="main" style={{marginTop:"20px"}}>
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead key="table">
          <TableRow>
          <StyledTableCell>Doctor Name</StyledTableCell>
            <StyledTableCell align="right">WhatsApp</StyledTableCell>
            <StyledTableCell align="right">Phone</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right"><a href={row.whatsapp}><WhatsAppIcon/></a></StyledTableCell>
              <StyledTableCell align="right"><span>{row.phone}</span><IconButton size="small"><PhoneEnabledIcon  /></IconButton></StyledTableCell>
              <StyledTableCell align="right">{row.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
    </React.Fragment>
    )
}

export default PatientData

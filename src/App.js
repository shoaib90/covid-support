import React, { useState } from "react"
import './App.css';
import { Route } from "react-router-dom";
import Login from './pages/login/login';
import Register from './pages/register/register';
import PatientDashboard from './pages/dashboard/patientDashboard';
import DoctorDashboard from './pages/dashboard/doctorDashboard';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";
import PatientData from "./pages/dataDisplay/patientData";

function App() {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
    <div className="App">
       <Route exact path="/login" component={Login}/>
       <Route exact path="/register" component={Register}/>
       <PrivateRoute exact path="/patient" component={PatientDashboard}/>
       <PrivateRoute exact path="/patient/show" component={PatientData}/>
       <PrivateRoute exact path="/doctor" component={DoctorDashboard}/>
      
  
    </div>
    </AuthContext.Provider>
  );
}

export default App;

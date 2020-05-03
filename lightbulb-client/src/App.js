import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import jwtDecode from "jwt-decode"

//Redux
import { Provider } from "react-redux";
import store from "./Redux/store";
import { SET_AUTHENTICATED } from "./Redux/types"
import { logoutUser, getUserData } from "./Redux/actions/userActions"

//pages import
import home from"./Pages/home"
import login from"./Pages/login"
import signup from"./Pages/signup"
import user from "./Pages/user"

//Components import
import Navbar from './Components/Navbar';
import AuthRoute from "./util/AuthRoute"
import axios from 'axios';

axios.defaults.baseURL = 'https://asia-east2-lightbulb-7e6ae.cloudfunctions.net/api'


const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = '/login';
  }
  else{
    store.dispatch({
      type: SET_AUTHENTICATED
    });
    axios.defaults.headers.common['Authorization'] = token
    store.dispatch(getUserData())
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#e0f2f1',
      main: '#26a69a',
      dark: '#00796b',
      contrastText: '#fff'
    },
    secondary: {
      light: '#fafafa',
      main: '#D04B87',
      dark: '#F01B7C',
      contrastText: '#fff'
    }
  },


})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <div className="App">
          <Router>
          <Navbar />
              <div className="container">  
                  <Switch>
                    <Route exact path="/" component={home} />
                    <AuthRoute exact path="/login" component={login} />
                    <AuthRoute exact path="/signup" component={signup} />
                    <Route exact path="/users/:handle" component={user} />
                    <Route exact path="/users/:handle/idea/:ideaId" component={user} />
                  </Switch>          
              </div>  
          </Router>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;

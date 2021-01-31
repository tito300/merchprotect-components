import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/chat';
import ChatAdmin from './components/chatAdmin';
import { options } from './util/configs';
import styled from 'styled-components';
import { 
  BrowserRouter as Router,
  Switch,
  Route
 } from 'react-router-dom';

const AppDiv = styled.div`
  min-height: 100vh;
  position: relative;
`

function App() {
  return (
    <Router>
      <AppDiv className="App">
        <Switch>
          <Route path="/admin">
            <ChatAdmin socketConfigs={options.socket}></ChatAdmin>
          </Route>
          <Route path="/">
            <Chat sentColor="#d2d2f7" backgroundColor="#beb5e9" color="#46444d" socketConfigs={options.socket}></Chat>
          </Route>
        </Switch>
      </AppDiv>
    </Router>
  );
}

export default App;

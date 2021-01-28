import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/chat';
import { socket } from './util/configs';
import styled from 'styled-components';

const AppDiv = styled.div`
  min-height: 100vh;
  position: relative;
`

function App() {
  return (
    <AppDiv className="App">

      <Chat socket={socket}></Chat>
    </AppDiv>
  );
}

export default App;

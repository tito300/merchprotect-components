import React, { useState } from 'react';

import styled, { css } from "styled-components";

const commonCss = css `

    background-color: ${props => props.backgroundColor};

    color: ${props => props.color};

`;

const Container = styled.div `

    overflow: hidden;

    box-sizing: border-box;



    * {

        box-sizing: border-box;

    }

`;

const Icon = styled.div `

    width: 70px;

    height: 70px;

    border-radius: 50%;

    position: fixed;

    bottom: 15px;

    right: 15px;

    z-index: 1000;

    ${commonCss}

    display: flex;

    justify-content: center;

    align-items: center;

    line-height: 0;

    cursor: pointer;

    display: ${props => props.open ? 'none' : 'flex'};

`;

const Wrapper = styled.div `

    ${commonCss}

    position: fixed;

    display: flex;

    flex-direction: column;

    align-items: flex-start;

    padding: 10px 15px;

    width: 320px;

    height: 500px;

    visibility: ${props => props.open ? 'visible' : 'hidden'};

    bottom: ${props => props.open ? '15px' : '-150px'};

    right: ${props => props.open ? '15px' : '-150px'};

    transform: ${props => props.open ? 'scale(1)' : 'scale(0.2)'};

    transition: all 100ms ease-in;

`;

const Header = styled.h4 `

    font-size: 16px;

    color: ${props => props.color};

    /* padding: 10px 15px; */

    margin: 0;

    margin-bottom: 15px;

    font-weight: 400;

`;

const MsgWindow = styled.div `

    padding: 10px 15px;

    background-color: white;

    min-height: 60%;

    width: 100%;

    margin-bottom: 10px;

`;

const MsgInput = styled.textarea `

    padding: 10px 15px;

    background-color: white;

    min-height: 50px;

    width: 100%;

    margin-bottom: 3px;

`;

const Button = styled.button `

    padding: 4px 35px;

    align-self: flex-end;

    border: none;

    background-color: #6dc490;

    color: white;

    cursor: pointer;

    font-weight: bold;

`;

function Chat({ backgroundColor = '#6d92ab', color = 'white', socket }) {

    const [open, setOpen] = useState(false);

    return (React.createElement(Container, { id: "chat__container" },

        React.createElement(Icon, { open: open, onClick: () => setOpen(!open), color: color, backgroundColor: backgroundColor }, "CHAT"),

        React.createElement(Wrapper, { open: open, backgroundColor: backgroundColor },

            React.createElement(Header, { color: color }, "How can we help you?"),

            React.createElement(MsgWindow, null),

            React.createElement(MsgInput, null),

            React.createElement(Button, null, "Send"))));

}

export default Chat;


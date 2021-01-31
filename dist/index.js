import styled, { css, keyframes } from "styled-components";

const SlideAnimation = keyframes `

    0% {

        margin-top: 50px;

        opacity: 0.8;

    }

    100% {

        margin-bottom: 0px;

        opacity: 1;

    }

`;

export const Select = css `

    width: 100%;

    border: 1px solid rgba(0, 0, 0, 0.25);

    background-color: white;

    color: rgba(0, 0, 0, 0.6);

    padding: 5px;

    font-size: 16px;

`;

export const UlList = css `

    list-style: none;

    padding-left: 0;

    text-align: start;

    margin-top: 0;

`;

export const commonCss = css `

    background-color: ${props => props.backgroundColor};

    color: ${props => props.color};

`;

export const Container = styled.div `

    overflow: hidden;

    box-sizing: border-box;



    * {

        box-sizing: border-box;

    }

`;

export const Icon = styled.div `

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

    overflow: hidden;

`;

export const Wrapper = styled.div `

    ${commonCss}

    position: fixed;

    display: flex;

    flex-direction: column;

    align-items: flex-start;

    flex-grow: 1;

    padding: 10px 15px;

    width: ${props => props.width};

    height: 500px;

    visibility: ${props => props.open ? 'visible' : 'hidden'};

    bottom: ${props => props.open ? '15px' : '-150px'};

    right: ${props => props.open ? '15px' : '-150px'};

    transform: ${props => props.open ? 'scale(1)' : 'scale(0.2)'};

    transition: all 100ms ease-in;

    overflow: hidden;

`;

export const Header = styled.h4 `

    font-size: 16px;

    color: ${props => props.color};

    /* padding: 10px 15px; */

    margin: 0;

    margin-bottom: 5px;

    font-weight: 400;

`;

export const MsgWindow = styled.div `

    padding: 10px 7px;

    background-color: white;

    min-height: 60%;

    border-radius: 2%;

    width: 100%;

    margin-bottom: 10px;

    overflow-y: scroll;

    flex-grow: 1;

    max-height: 325px;

    box-shadow: inset 0px -2px 16px -10px #000000;



    ::-webkit-scrollbar {

        width: 0px;  /* Remove scrollbar space */

        background: transparent;  /* Optional: just make scrollbar invisible */

    }

    /* Optional: show position indicator in red */

    ::-webkit-scrollbar-thumb {

        background: #FF0000;

    }

`;

export const MsgInput = styled.textarea `

    padding: 10px 15px;

    background-color: white;

    min-height: 50px;

    width: 100%;

    margin-bottom: 5px;

    border: none;



    :focus {

        outline: 1px solid #7d72b6;

    }

`;

export const Button = styled.button `

    padding: 6px 45px;

    border: none;

    background-color: #268e50;

    color: white;

    cursor: pointer;

    font-weight: bold;

    width: 100%;

`;

export const RoomsList = styled.ul `

    ${UlList}

    padding: 5px;

    height: 100%;

`;

export const Room = styled.li `

    padding: 5px 8px;

    font-size: 14px;

    color: black;

    border-radius: 5%;

    margin-bottom: 7px;

    border: ${props => props.current ? '5px solid #ce9035' : 'none'};

    color: #4d4d4d;

    background-color: ${props => props.current ? '#b6f3b6' : '#ffdfa2'};

    cursor: pointer;

`;

export const MsgList = styled.ul `

    ${UlList}

    display: flex;

    flex-direction: column;

    margin-top: 3px;

    width: 100%;

`;

export const Msg = styled.li `

    padding-left: 0;

    margin-bottom: 5px;

    font-size: 14px;

    text-align: ${props => props.sender === "admin" ? 'left' : 'right'};

    align-self: ${props => props.sender === "admin" ? 'flex-start' : 'flex-end'};

    padding: 5px 10px;

    background-color: ${props => props.sender === "admin" ? props.receiveColor : props.sentColor}; ;

    max-width: 80%;

    line-height: 1.1;

    border-radius: 10px;

    animation: ${SlideAnimation} 1s;

`;

export const CurrentClient = styled.p `

    font-size: 14px;

    color: ${props => props.color};

    font-weight: 200;

    margin-bottom: 5px;

    margin-top: 0px;

`;

export const Row = styled.div `

    display: flex;

    flex-wrap: wrap;

    width: 100%;

`;

export const Column = styled.div `

    width: calc((100% / 12) * ${({ col = 1 }) => col});

`;

export const MsgWrapper = styled.div `

    display: flex;

    flex-direction: column;

    align-items: flex-start;

    height: 100%;

`;

export const RoomsWrapper = styled.div `

    margin-right: 5px;

    height: 100%;

    background-color: white;

    border-radius: 3px;

`;

export const Shape = styled.div `

    background-color: ${props => props.backgroundColor};

    filter: brightness(1.1);

    clip-path: ${({ shape = 'poly' }) => shape === 'poly' ? 'polygon(68% 0, 100% 0, 100% 29%, 75% 100%, 0 100%, 0 34%, 34% 17%)' : 'circle(45.5% at 80% 27%)'};

    top: 0;

    left: 0;

    right: 0;

    bottom: 0;

    position: absolute;

    z-index: -1;

`;


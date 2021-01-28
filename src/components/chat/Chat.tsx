import React, { DOMElement, useState } from 'react'; 
import styled, { css, createGlobalStyle } from "styled-components";
import { socket as socketDefaults } from '../../util/configs'; 

interface Socket {
    host: string,
    port: string,
}

interface ChatProp {
    socket: Socket,
    color?: string,
    backgroundColor?: string
}

interface StyledProps {
    color?: string,
    backgroundColor?: string,
    open?: boolean
}

const commonCss = css<StyledProps>`
    background-color: ${props => props.backgroundColor};
    color: ${props => props.color};
`
const Container = styled.div`
    overflow: hidden;
    box-sizing: border-box;

    * {
        box-sizing: border-box;
    }
`
const Icon = styled.div<StyledProps>`
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
`

const Wrapper = styled.div<StyledProps>`
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
`

const Header = styled.h4<StyledProps>`
    font-size: 16px;
    color: ${props => props.color};
    /* padding: 10px 15px; */
    margin: 0;
    margin-bottom: 15px;
    font-weight: 400;
`
const MsgWindow = styled.div<StyledProps>`
    padding: 10px 15px;
    background-color: white;
    min-height: 60%;
    width: 100%;
    margin-bottom: 10px;
`
const MsgInput = styled.textarea<StyledProps>`
    padding: 10px 15px;
    background-color: white;
    min-height: 50px;
    width: 100%;
    margin-bottom: 3px;
`
const Button = styled.button<StyledProps>`
    padding: 4px 35px;
    align-self: flex-end;
    border: none;
    background-color: #6dc490;
    color: white;
    cursor: pointer;
    font-weight: bold;
`
function Chat({ 
    backgroundColor = '#6d92ab', 
    color = 'white', 
    socket = socketDefaults } : ChatProp) {

    const [open, setOpen] = useState(false);

    return (
        <Container id="chat__container">
            <Icon open={open} onClick={() => setOpen(!open)} color={color} backgroundColor={backgroundColor}>
                CHAT
            </Icon>

            <Wrapper open={open} backgroundColor={backgroundColor}>
                <Header color={color}>How can we help you?</Header>
                <MsgWindow>
                    
                </MsgWindow>
                <MsgInput>
                    
                </MsgInput>
                <Button>
                    Send
                </Button>
            </Wrapper>
        </Container>
    )
}

export default Chat
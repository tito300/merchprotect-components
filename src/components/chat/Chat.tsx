import React, { ChangeEvent, DOMElement, useEffect, useRef, useState } from 'react'; 
import styled, { css, createGlobalStyle } from "styled-components";
import { options as defaultOptions } from '../../util/configs'; 
import { io, Socket as SocketType } from 'socket.io-client';
import { useImmer } from 'use-immer';
import { 
    Button, 
    Container, 
    CurrentClient, 
    Header, 
    Icon, 
    Msg, 
    MsgInput, 
    MsgList, 
    MsgWindow, 
    RoomsList, 
    Shape, 
    Wrapper } from '../elements/chat';

interface Socket {
    url: string,
    rooms: {roomId: string, roomName: string}[]
}

interface ChatProp {
    socketConfigs: Socket,
    color?: string,
    backgroundColor?: string,
    sentColor?: string,
    receiveColor?: string,
}

export interface Message {
    id: number,
    msg: string,
    source: MsgSource,
    timestamp: string
}

type MsgSource = "admin" | "client";

let socket: SocketType | null;

function Chat({ 
    backgroundColor = '#6d92ab', 
    color = 'white', 
    sentColor = '#deffdc',
    receiveColor = '#dcf1ff',
    socketConfigs = defaultOptions.socket } 
    : ChatProp) {

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useImmer<Message[]>([]!)

    useEffect(() => {
        // if (socket) return;
        socket = io(socketConfigs.url);
        let sessionId = getSessionId()

        socket.on('connect', () => {
            socket!.emit('join', sessionId, null, (messages: Message[]) => {
                if (messages) setMessages(() => messages);
            });
            socket!.on('message', (msgObj: Message) => setMessages(initial => { 
                const {msg, source, timestamp, id} = {...msgObj};
                initial.push({
                    source, 
                    msg, 
                    timestamp,
                    id
                }) 
            }))
        })

        return () => { socket?.off('message') };
    }, [])

    const sendMsg = () => {
        if (!msg) return; 

        socket?.emit('message', msg, getSessionId());
        setMsg('');
        inputRef.current?.focus();
    } 

    return (
        <Container id="chat__container">
            <Icon open={open} onClick={() => setOpen(!open)} color={color} backgroundColor={backgroundColor}>
                {/* <Shape backgroundColor={backgroundColor} shape="poly"></Shape> */}
                <Shape backgroundColor={backgroundColor} shape="circle"></Shape>
                CHAT
            </Icon>
            <Wrapper open={open} backgroundColor={backgroundColor} width="320px">
                <Shape backgroundColor={backgroundColor}></Shape>
                <Header color={color}>How can we help you?</Header>
                <MsgWindow>
                    {/* <MsgStatus></MsgStatus> */}
                    <MsgList>
                        {messages && messages.length !== 0 && messages.map(msg => (
                            <Msg key={msg.id} sentColor={sentColor} receiveColor={receiveColor} sender={msg.source}>{msg.msg}</Msg>
                        ))}
                    </MsgList>
                </MsgWindow>
                <MsgInput value={msg} onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setMsg(e.currentTarget.value)} ref={inputRef}>
                    
                </MsgInput>
                <Button onClick={sendMsg}>
                    Send
                </Button>
            </Wrapper>
        </Container>
    )
}

function getSessionId(): string {
    try {
        let sessionId = sessionStorage.getItem('chat_id');
        if (!sessionId) {
            sessionId = Math.ceil(Math.random() * 10000).toString();
            sessionStorage.setItem('chat_id', sessionId);
        }
        return sessionId;
    } catch(err) {
        //cookies disabled
        return Math.ceil(Math.random() * 10000).toString();
    }
}

export default Chat
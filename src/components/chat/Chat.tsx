import React, { useEffect, useRef, useState } from 'react'; 
import { options as defaultOptions } from '../../util/configs'; 
import { getSessionId } from '../../util/helpers'; 
import { io, Socket as SocketType } from 'socket.io-client';
import { useImmer } from 'use-immer';
import { 
    Button, 
    Container, 
    Header, 
    Icon, 
    Msg, 
    MsgInput, 
    MsgList, 
    MsgWindow, 
    Shape, 
    Wrapper } from '../elements/chat';
import { useScrollToBottom } from '../../util/hooks';
import { Message, Socket } from '../../types/chat';

interface ChatProp {
    socketConfigs: Socket,
    color?: string,
    backgroundColor?: string,
    sentColor?: string,
    receiveColor?: string,
}

let socket: SocketType | null;

function Chat({ 
    backgroundColor = '#6d92ab', 
    color = 'white', 
    sentColor = '#deffdc',
    receiveColor = '#dcf1ff',
    socketConfigs = defaultOptions.socket } 
    : ChatProp) {

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const MsgWindowRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useImmer<Message[]>([]!)

    useEffect(() => {
        // if (socket) return;
        debugger;
        socket = io(socketConfigs.url, {
            query: {
                client: 'user'
            }
        });
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
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useScrollToBottom(MsgWindowRef, [messages]);

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
                <MsgWindow ref={MsgWindowRef}>
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


export default Chat
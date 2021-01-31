import React, { ChangeEvent, DOMElement, useEffect, useState } from 'react'; 
import styled, { css, createGlobalStyle } from "styled-components";
import { options as defaultOptions } from '../../util/configs'; 
import { io, Socket as SocketType } from 'socket.io-client';
import { useImmer } from 'use-immer';
import { 
    Button, 
    Column,
    Row, 
    Container, 
    CurrentClient, 
    Header, 
    Icon, 
    Msg, 
    MsgInput, 
    MsgList, 
    MsgWindow, 
    RoomsList, 
    Wrapper, 
    MsgWrapper,
    RoomsWrapper,
    Room} from '../elements/chat';
import { Message } from '../chat/Chat';

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


interface Room {
    id: string,
    name: string,
    active: boolean,
    agent: string,
    messages: Message[],
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

    const [open, setOpen] = useState(false);
    const [disconnected, setDisconnected] = useState(false);
    const [msg, setMsg] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState(0)
    const [messages, setMessages] = useImmer<Message[]>([]!)

    useEffect(() => {
        // if (socket) return;
        socket = io(socketConfigs.url);

        socket.on('connect', () => {
            socket!.emit('join', 'default', 'Tarek');
            socket!.on('message', (msgObj: Message) => setMessages(initial => { 
                const {msg, source, timestamp, id} = {...msgObj};
                initial.push({
                    source, 
                    msg, 
                    timestamp,
                    id
                }) 
            }))

            socket?.on('rooms', (rooms: Room[]) => {
                console.log('rooms: ', rooms);
                const currentRoomIndex = getCurrentRoomIdex(rooms, 'Tarek');
                setCurrentRoom(currentRoomIndex);
                setRooms(rooms);

                setMessages(() =>  rooms[currentRoomIndex].messages);
            })
            socket?.on('client_disconnected', () => {
                setDisconnected(true);
            })
        })

        return () => { socket?.off('message') };
    }, [])

    const sendMsg = () => {
        if (!msg || disconnected) return; 

        socket?.emit('message', msg, rooms[currentRoom].id);
        setMsg('');
    } 

    const changeRoom = (roomIndex: number): void => {
        const roomId = rooms[roomIndex]?.id;
        if (roomId) {
            socket?.emit('join', roomId, 'Tarek');

            setCurrentRoom(roomIndex);
        }
    }

    return (
        <Container id="chat__container">
            <Icon open={open} onClick={() => setOpen(!open)} color={color} backgroundColor={backgroundColor}>
                CHAT
            </Icon>

            <Wrapper open={open} backgroundColor={backgroundColor} width="420px">
                <Header color={color}>Please assist customers</Header>
                <CurrentClient color={color}>Current: {rooms[currentRoom]?.name}</CurrentClient>
                
                <Row>
                    <Column col={4}>
                        {rooms?.length > 0 && 
                            <RoomsWrapper>
                                <RoomsList> 
                                    {rooms.map((room, i) => (
                                        <Room onClick={() => changeRoom(i)} current={i === currentRoom} key={room.id}>{room.name}</Room>
                                    ))}
                                </RoomsList>
                            </RoomsWrapper>
                        }
                    </Column>
                    <Column col={8}>
                        <MsgWrapper>
                            <MsgWindow>
                                {/* <MsgStatus></MsgStatus> */}
                                <MsgList>
                                    {messages && messages.length !== 0 && messages.map(msg => (
                                        <Msg key={msg.id} sentColor={sentColor} receiveColor={receiveColor} sender={msg.source}>{msg.msg}</Msg>
                                    ))}
                                </MsgList>
                            </MsgWindow>
                            <MsgInput value={msg} onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setMsg(e.currentTarget.value)}>
                                
                            </MsgInput>
                            <Button onClick={sendMsg}>
                                Send
                            </Button>
                        </MsgWrapper>
                    </Column>
                </Row>
            </Wrapper>
        </Container>
    )
}

function getCurrentRoomIdex(rooms: Room[], agentName: string) {
    return rooms.findIndex(r => r.agent === agentName);
}

export default Chat
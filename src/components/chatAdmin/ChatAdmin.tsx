import React, { useEffect, useMemo, useRef, useState } from 'react'; 
import { options as defaultOptions } from '../../util/configs'; 
import { io, Socket as SocketType } from 'socket.io-client';
import { useImmer } from 'use-immer';
import { 
    Button, 
    Column,
    Row, 
    Container, 
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
    ErrMsg,
    RoomLi,
    MsgStatus
} from '@bit/merchprotect.merchprotect-components.chat-elements';
import { useScrollToBottom } from '../../util/hooks';
import { Admin, Message, Room, Socket } from '../../types/chat';

interface ChatProp {
    socketConfigs: Socket,
    color?: string,
    backgroundColor?: string,
    sentColor?: string,
    receiveColor?: string,
    admin: Admin,
}

let socket: SocketType | null;

function ChatAdmin({ 
    admin,
    backgroundColor = '#6d92ab', 
    color = 'white', 
    sentColor = '#deffdc',
    receiveColor = '#dcf1ff',
    socketConfigs = defaultOptions.socket } 
    : ChatProp) {

    const MsgWindowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [open, setOpen] = useState(false);
    const [roomMsg, setRoomMsg] = useState<string | null>(null);
    const [msg, setMsg] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<number>(0)
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useImmer<Message[]>([]!);

    useScrollToBottom(MsgWindowRef, [messages]);

    useEffect(() => {
        // if (socket) return;
        socket = io(socketConfigs.url, {
            query: {
                client: 'admin'
            },
            auth: {
                token: admin.token,
            }
        });

        socket.on('connect', () => {
            setError(null);
            socket!.emit('join', 'admins');
        })
        socket!.on('message', (msgObj: Message) => setMessages(initial => { 
            const {msg, source, timestamp, id} = {...msgObj};
            initial.push({
                source, 
                msg, 
                timestamp,
                id
            }) 
        }))

        socket?.on('rooms', (rooms: Room[], admins: Admin[]) => {
            console.log('rooms: ', rooms);
            setRooms(rooms);
            const currentRoom = admins.find(a => a.name === admin.name)?.currentRoom;
            const currentRoomIndex = currentRoom ? rooms.findIndex(r => r.id === currentRoom.id) : 0;

            setCurrentRoom(currentRoomIndex);
            setMessages(() =>  rooms[currentRoomIndex]?.messages ?? []);

            if (isInOwnRoom()) {
                setRoomMsg('Client is being handled by another Admin')
            }

        })
        socket?.on('client_disconnected', () => {
            setRoomMsg('Client is disconnected');
        })
        socket?.on('client_reconnected', () => {
            setRoomMsg('Client connected');
        })
        socket?.on('connect_error', (err: Error) => {
            setError(err.message);
        })

        return () => { socket?.off('message') };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    const sendMsg = () => {
        if (!msg) return; 

        socket?.emit('message', msg, rooms[currentRoom].id);
        setMsg('');
        inputRef.current?.focus();
    } 

    const changeRoom = (roomIndex: number): void => {
        const roomId = rooms[roomIndex]?.id;
        if (roomId) {
            setCurrentRoom(roomIndex);
            setRoomMsg(null);
            socket?.emit('join', roomId);
        }
    }

    const isInOwnRoom = useMemo(() => () => {
        const is = rooms[currentRoom]?.agent === admin.name;
        console.log(rooms[currentRoom]?.agent, ' ', admin.name , ' ', is);
        return is;
    }, [rooms, currentRoom, admin.name])

    return (
        <Container id="chat__container">
            <Icon open={open} onClick={() => setOpen(!open)} color={color} backgroundColor={backgroundColor}>
                CHAT
            </Icon>

            <Wrapper open={open} backgroundColor={backgroundColor} width="420px">
                {error && <ErrMsg>{error}</ErrMsg>}
                <Header color={color}>Please assist customers</Header>                
                <Row style={{flexGrow: 1}}>
                    <Column col={4}>
                        <RoomsWrapper>
                            {rooms?.length > 0 && 

                                <RoomsList> 
                                    {rooms.map((room, i) => (
                                        <RoomLi onClick={() => changeRoom(i)} handled={room.handled} current={i === currentRoom} key={room.id}>{room.name}</RoomLi>
                                    ))}
                                </RoomsList>
                            }
                        </RoomsWrapper>
                    </Column>
                    <Column col={8}>
                        <MsgWrapper>
                            <MsgWindow ref={MsgWindowRef}>
                                <MsgList>
                                    {messages && messages.length !== 0 && messages.map(msg => (
                                        <Msg key={msg.id} sentColor={sentColor} receiveColor={receiveColor} sender={msg.source}>{msg.msg}</Msg>
                                        ))}
                                </MsgList>
                            </MsgWindow>
                            {roomMsg && <MsgStatus>{roomMsg}</MsgStatus>}
                            <MsgInput ref={inputRef} block={!isInOwnRoom()} value={msg} onChange={(e: React.FormEvent<HTMLTextAreaElement>) => setMsg(e.currentTarget.value)}>
                                
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

export default ChatAdmin
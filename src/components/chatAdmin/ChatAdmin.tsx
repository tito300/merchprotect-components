import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'; 
import { options as defaultOptions } from '../../util/configs'; 
import { io, Socket as SocketType } from 'socket.io-client';
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
} from '../elements/chat';
import { useScrollToBottom } from '../../util/hooks';
import { Admin, Message, Room, Socket, Theme } from '../../types/chat';

interface ChatProp {
    socketConfigs: Socket,
    theme?: Theme,
    color?: string,
    backgroundColor?: string,
    sentColor?: string,
    receiveColor?: string,
    admin: Admin,
}
interface State {
    open: boolean,
    roomStatus: string | null,
    msg: string,
    rooms: Room[],
    currentRoom: number,
    error: string | null,
    messages: Message[]
}

let socket: SocketType | null;
const initialState: State = {
    open: false,
    roomStatus: null,
    msg: '',
    rooms: [],
    currentRoom: 0,
    error: null,
    messages: []
}
type Action = {
    type: ActionTypes,
    payload?: any
}

type ActionTypes = 
    | "OPEN_CHAT"
    | "SET_MSG"
    | "SET_ROOMS"
    | "SET_CURRENT_ROOM"
    | "SET_ERROR"
    | "SET_MESSAGES"
    | "SET_ROOM_STATUS";

const defaultTheme: Theme = {
    backgroundColor: '#6d92ab', 
    color: 'white', 
    sentColor: '#deffdc',
    receiveColor: '#dcf1ff',
}

function reducer(state: State, { type, payload }: Action): State {
    switch (type) {
        case "OPEN_CHAT":
            return { ...state, open: true };
        case "SET_MSG": 
            return { ...state, msg: payload };
        case "SET_ROOMS": 
            return { ...state, rooms: payload };
        case "SET_CURRENT_ROOM": 
            return { ...state, currentRoom: payload, roomStatus: null };
        case "SET_ROOM_STATUS": 
            return { ...state, roomStatus: payload };
        case "SET_ERROR": 
            return { ...state, error: payload };
        case "SET_MESSAGES": 
            return { ...state, messages: payload(state) };
        default:
            return state;
    }

}


function ChatAdmin({ 
        admin,
        theme = defaultTheme,
        socketConfigs = defaultOptions.socket 
    } : ChatProp) {

    const MsgWindowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    
    const [state, dispatch] = useReducer(reducer, initialState);
    const { open, msg, rooms, currentRoom, roomStatus, error, messages } = state;

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
            dispatch({ type: "SET_ERROR", payload: null });
            socket!.emit('join', 'admins');
        })
        socket!.on('message', (msgObj: Message) => { 
            dispatch({ type: "SET_MESSAGES", payload: (state: State) => [...state.messages, msgObj]})
        })


        socket?.on('rooms', (rooms: Room[], admins: Admin[]) => {
            console.log('rooms: ', rooms);
            dispatch({ type: "SET_ROOMS", payload: rooms});;
            const currentRoom = admins.find(a => a.name === admin.name)?.currentRoom;
            const currentRoomIndex = currentRoom ? rooms.findIndex(r => r.id === currentRoom.id) : 0;

            dispatch({ type: "SET_CURRENT_ROOM", payload: currentRoomIndex});
            dispatch({ type: "SET_MESSAGES", payload: () => rooms[currentRoomIndex]?.messages ?? []});

            if (isInOwnRoom()) {
                dispatch({ type: "SET_ROOM_STATUS", payload: 'Client is being handled by another Admin'});
            }

        })
        socket?.on('client_disconnected', () => {
            dispatch({ type: "SET_ROOM_STATUS", payload: 'Client is disconnected'});
        })
        socket?.on('client_reconnected', () => {
            dispatch({ type: "SET_ROOM_STATUS", payload: 'Client connected'});
        })
        socket?.on('connect_error', (err: Error) => {
            dispatch({ type: "SET_ERROR", payload: err.message });
        })

        return () => { socket?.off('message') };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    const sendMsg = () => {
        if (!msg) return; 

        socket?.emit('message', msg, rooms[currentRoom].id);
        dispatch({ type: "SET_MSG", payload: ''});
        inputRef.current?.focus();
    } 

    const changeRoom = (roomIndex: number): void => {
        const roomId = rooms[roomIndex]?.id;
        if (roomId) {
            dispatch({ type: "SET_CURRENT_ROOM", payload: roomIndex});            
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
            <Icon open={open} onClick={() => dispatch({type: "OPEN_CHAT"})} color={theme.color} backgroundColor={theme.backgroundColor}>
                CHAT
            </Icon>

            <Wrapper open={open} backgroundColor={theme.backgroundColor} width="420px">
                {error && <ErrMsg>{error}</ErrMsg>}
                <Header color={theme.color}>Please assist customers</Header>                
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
                                        <Msg key={msg.id} sentColor={theme.sentColor!} receiveColor={theme.receiveColor!} sender={msg.source}>{msg.msg}</Msg>
                                        ))}
                                </MsgList>
                            </MsgWindow>
                            {roomStatus && <MsgStatus>{roomStatus}</MsgStatus>}
                            <MsgInput ref={inputRef} block={!isInOwnRoom()} value={msg} onChange={(e: React.FormEvent<HTMLTextAreaElement>) => dispatch({ type: "SET_MSG", payload: e.currentTarget.value})} data-testid="msg-input">
                                
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
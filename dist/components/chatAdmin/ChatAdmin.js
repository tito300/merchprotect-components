import React, { useEffect, useState } from 'react';

import { options as defaultOptions } from '../../util/configs';

import { io } from 'socket.io-client';

import { useImmer } from 'use-immer';

import { Button, Column, Row, Container, CurrentClient, Header, Icon, Msg, MsgInput, MsgList, MsgWindow, RoomsList, Wrapper, MsgWrapper, RoomsWrapper, Room } from '../elements/chat';

let socket;

function Chat({ backgroundColor = '#6d92ab', color = 'white', sentColor = '#deffdc', receiveColor = '#dcf1ff', socketConfigs = defaultOptions.socket }) {

    var _a;

    const [open, setOpen] = useState(false);

    const [disconnected, setDisconnected] = useState(false);

    const [msg, setMsg] = useState('');

    const [rooms, setRooms] = useState([]);

    const [currentRoom, setCurrentRoom] = useState(0);

    const [messages, setMessages] = useImmer([]);

    useEffect(() => {

        socket = io(socketConfigs.url);

        socket.on('connect', () => {

            socket.emit('join', 'default', 'Tarek');

            socket.on('message', (msgObj) => setMessages(initial => {

                const { msg, source, timestamp, id } = Object.assign({}, msgObj);

                initial.push({

                    source,

                    msg,

                    timestamp,

                    id

                });

            }));

            socket === null || socket === void 0 ? void 0 : socket.on('rooms', (rooms) => {

                console.log('rooms: ', rooms);

                const currentRoomIndex = getCurrentRoomIdex(rooms, 'Tarek');

                setCurrentRoom(currentRoomIndex);

                setRooms(rooms);

                setMessages(() => rooms[currentRoomIndex].messages);

            });

            socket === null || socket === void 0 ? void 0 : socket.on('client_disconnected', () => {

                setDisconnected(true);

            });

        });

        return () => { socket === null || socket === void 0 ? void 0 : socket.off('message'); };

    }, []);

    const sendMsg = () => {

        if (!msg || disconnected)

            return;

        socket === null || socket === void 0 ? void 0 : socket.emit('message', msg, rooms[currentRoom].id);

        setMsg('');

    };

    const changeRoom = (roomIndex) => {

        var _a;

        const roomId = (_a = rooms[roomIndex]) === null || _a === void 0 ? void 0 : _a.id;

        if (roomId) {

            socket === null || socket === void 0 ? void 0 : socket.emit('join', roomId, 'Tarek');

            setCurrentRoom(roomIndex);

        }

    };

    return (React.createElement(Container, { id: "chat__container" },

        React.createElement(Icon, { open: open, onClick: () => setOpen(!open), color: color, backgroundColor: backgroundColor }, "CHAT"),

        React.createElement(Wrapper, { open: open, backgroundColor: backgroundColor, width: "420px" },

            React.createElement(Header, { color: color }, "Please assist customers"),

            React.createElement(CurrentClient, { color: color },

                "Current: ", (_a = rooms[currentRoom]) === null || _a === void 0 ? void 0 :

                _a.name),

            React.createElement(Row, null,

                React.createElement(Column, { col: 4 }, (rooms === null || rooms === void 0 ? void 0 : rooms.length) > 0 &&

                    React.createElement(RoomsWrapper, null,

                        React.createElement(RoomsList, null, rooms.map((room, i) => (React.createElement(Room, { onClick: () => changeRoom(i), current: i === currentRoom, key: room.id }, room.name)))))),

                React.createElement(Column, { col: 8 },

                    React.createElement(MsgWrapper, null,

                        React.createElement(MsgWindow, null,

                            React.createElement(MsgList, null, messages && messages.length !== 0 && messages.map(msg => (React.createElement(Msg, { key: msg.id, sentColor: sentColor, receiveColor: receiveColor, sender: msg.source }, msg.msg))))),

                        React.createElement(MsgInput, { value: msg, onChange: (e) => setMsg(e.currentTarget.value) }),

                        React.createElement(Button, { onClick: sendMsg }, "Send")))))));

}

function getCurrentRoomIdex(rooms, agentName) {

    return rooms.findIndex(r => r.agent === agentName);

}

export default Chat;


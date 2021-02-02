import React, { useEffect, useMemo, useRef, useState } from 'react';

import { options as defaultOptions } from '../../util/configs';

import { io } from 'socket.io-client';

import { useImmer } from 'use-immer';

import { Button, Column, Row, Container, Header, Icon, Msg, MsgInput, MsgList, MsgWindow, RoomsList, Wrapper, MsgWrapper, RoomsWrapper, ErrMsg, RoomLi, MsgStatus } from '@bit/merchprotect.merchprotect-components.chat-elements';

import { useScrollToBottom } from '../../util/hooks';

let socket;

function ChatAdmin({ admin, backgroundColor = '#6d92ab', color = 'white', sentColor = '#deffdc', receiveColor = '#dcf1ff', socketConfigs = defaultOptions.socket }) {

    const MsgWindowRef = useRef(null);

    const inputRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [roomMsg, setRoomMsg] = useState(null);

    const [msg, setMsg] = useState('');

    const [rooms, setRooms] = useState([]);

    const [currentRoom, setCurrentRoom] = useState(0);

    const [error, setError] = useState(null);

    const [messages, setMessages] = useImmer([]);

    useScrollToBottom(MsgWindowRef, [messages]);

    useEffect(() => {

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

            socket.emit('join', 'admins');

        });

        socket.on('message', (msgObj) => setMessages(initial => {

            const { msg, source, timestamp, id } = Object.assign({}, msgObj);

            initial.push({

                source,

                msg,

                timestamp,

                id

            });

        }));

        socket === null || socket === void 0 ? void 0 : socket.on('rooms', (rooms, admins) => {

            var _a;

            console.log('rooms: ', rooms);

            setRooms(rooms);

            const currentRoom = (_a = admins.find(a => a.name === admin.name)) === null || _a === void 0 ? void 0 : _a.currentRoom;

            const currentRoomIndex = currentRoom ? rooms.findIndex(r => r.id === currentRoom.id) : 0;

            setCurrentRoom(currentRoomIndex);

            setMessages(() => { var _a, _b; return (_b = (_a = rooms[currentRoomIndex]) === null || _a === void 0 ? void 0 : _a.messages) !== null && _b !== void 0 ? _b : []; });

            if (isInOwnRoom()) {

                setRoomMsg('Client is being handled by another Admin');

            }

        });

        socket === null || socket === void 0 ? void 0 : socket.on('client_disconnected', () => {

            setRoomMsg('Client is disconnected');

        });

        socket === null || socket === void 0 ? void 0 : socket.on('client_reconnected', () => {

            setRoomMsg('Client connected');

        });

        socket === null || socket === void 0 ? void 0 : socket.on('connect_error', (err) => {

            setError(err.message);

        });

        return () => { socket === null || socket === void 0 ? void 0 : socket.off('message'); };

    }, []);

    const sendMsg = () => {

        var _a;

        if (!msg)

            return;

        socket === null || socket === void 0 ? void 0 : socket.emit('message', msg, rooms[currentRoom].id);

        setMsg('');

        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();

    };

    const changeRoom = (roomIndex) => {

        var _a;

        const roomId = (_a = rooms[roomIndex]) === null || _a === void 0 ? void 0 : _a.id;

        if (roomId) {

            setCurrentRoom(roomIndex);

            setRoomMsg(null);

            socket === null || socket === void 0 ? void 0 : socket.emit('join', roomId);

        }

    };

    const isInOwnRoom = useMemo(() => () => {

        var _a, _b;

        const is = ((_a = rooms[currentRoom]) === null || _a === void 0 ? void 0 : _a.agent) === admin.name;

        console.log((_b = rooms[currentRoom]) === null || _b === void 0 ? void 0 : _b.agent, ' ', admin.name, ' ', is);

        return is;

    }, [rooms, currentRoom, admin.name]);

    return (React.createElement(Container, { id: "chat__container" },

        React.createElement(Icon, { open: open, onClick: () => setOpen(!open), color: color, backgroundColor: backgroundColor }, "CHAT"),

        React.createElement(Wrapper, { open: open, backgroundColor: backgroundColor, width: "420px" },

            error && React.createElement(ErrMsg, null, error),

            React.createElement(Header, { color: color }, "Please assist customers"),

            React.createElement(Row, { style: { flexGrow: 1 } },

                React.createElement(Column, { col: 4 },

                    React.createElement(RoomsWrapper, null, (rooms === null || rooms === void 0 ? void 0 : rooms.length) > 0 &&

                        React.createElement(RoomsList, null, rooms.map((room, i) => (React.createElement(RoomLi, { onClick: () => changeRoom(i), handled: room.handled, current: i === currentRoom, key: room.id }, room.name)))))),

                React.createElement(Column, { col: 8 },

                    React.createElement(MsgWrapper, null,

                        React.createElement(MsgWindow, { ref: MsgWindowRef },

                            React.createElement(MsgList, null, messages && messages.length !== 0 && messages.map(msg => (React.createElement(Msg, { key: msg.id, sentColor: sentColor, receiveColor: receiveColor, sender: msg.source }, msg.msg))))),

                        roomMsg && React.createElement(MsgStatus, null, roomMsg),

                        React.createElement(MsgInput, { ref: inputRef, block: !isInOwnRoom(), value: msg, onChange: (e) => setMsg(e.currentTarget.value) }),

                        React.createElement(Button, { onClick: sendMsg }, "Send")))))));

}

export default ChatAdmin;


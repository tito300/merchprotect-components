import React, { useEffect, useRef, useState } from 'react';

import { options as defaultOptions } from '../../util/configs';

import { getSessionId } from '../../util/helpers';

import { io } from 'socket.io-client';

import { useImmer } from 'use-immer';

import { Button, Container, Header, Icon, Msg, MsgInput, MsgList, MsgWindow, Shape, Wrapper } from '../elements/chat';

import { useScrollToBottom } from '../../util/hooks';

let socket;

function Chat({ backgroundColor = '#6d92ab', color = 'white', sentColor = '#deffdc', receiveColor = '#dcf1ff', socketConfigs = defaultOptions.socket }) {

    const inputRef = useRef(null);

    const MsgWindowRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [msg, setMsg] = useState('');

    const [messages, setMessages] = useImmer([]);

    useEffect(() => {

        debugger;

        socket = io(socketConfigs.url, {

            query: {

                client: 'user'

            }

        });

        let sessionId = getSessionId();

        socket.on('connect', () => {

            socket.emit('join', sessionId, null, (messages) => {

                if (messages)

                    setMessages(() => messages);

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

        });

        return () => { socket === null || socket === void 0 ? void 0 : socket.off('message'); };

    }, []);

    useScrollToBottom(MsgWindowRef, [messages]);

    const sendMsg = () => {

        var _a;

        if (!msg)

            return;

        socket === null || socket === void 0 ? void 0 : socket.emit('message', msg, getSessionId());

        setMsg('');

        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();

    };

    return (React.createElement(Container, { id: "chat__container" },

        React.createElement(Icon, { open: open, onClick: () => setOpen(!open), color: color, backgroundColor: backgroundColor },

            React.createElement(Shape, { backgroundColor: backgroundColor, shape: "circle" }),

            "CHAT"),

        React.createElement(Wrapper, { open: open, backgroundColor: backgroundColor, width: "320px" },

            React.createElement(Shape, { backgroundColor: backgroundColor }),

            React.createElement(Header, { color: color }, "How can we help you?"),

            React.createElement(MsgWindow, { ref: MsgWindowRef },

                React.createElement(MsgList, null, messages && messages.length !== 0 && messages.map(msg => (React.createElement(Msg, { key: msg.id, sentColor: sentColor, receiveColor: receiveColor, sender: msg.source }, msg.msg))))),

            React.createElement(MsgInput, { value: msg, onChange: (e) => setMsg(e.currentTarget.value), ref: inputRef }),

            React.createElement(Button, { onClick: sendMsg }, "Send"))));

}

export default Chat;


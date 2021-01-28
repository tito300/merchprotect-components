/// <reference types="react" />

interface Socket {

    host: string;

    port: string;

}

interface ChatProp {

    socket: Socket;

    color?: string;

    backgroundColor?: string;

}

declare function Chat({ backgroundColor, color, socket }: ChatProp): JSX.Element;

export default Chat;


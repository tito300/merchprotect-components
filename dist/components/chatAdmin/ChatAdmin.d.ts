/// <reference types="react" />

interface Socket {

    url: string;

    rooms: {

        roomId: string;

        roomName: string;

    }[];

}

interface ChatProp {

    socketConfigs: Socket;

    color?: string;

    backgroundColor?: string;

    sentColor?: string;

    receiveColor?: string;

}

declare function Chat({ backgroundColor, color, sentColor, receiveColor, socketConfigs }: ChatProp): JSX.Element;

export default Chat;


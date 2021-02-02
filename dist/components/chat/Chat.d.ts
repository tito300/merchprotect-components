/// <reference types="react" />

import { Socket } from '../../types/chat';

interface ChatProp {

    socketConfigs: Socket;

    color?: string;

    backgroundColor?: string;

    sentColor?: string;

    receiveColor?: string;

}

declare function Chat({ backgroundColor, color, sentColor, receiveColor, socketConfigs }: ChatProp): JSX.Element;

export default Chat;


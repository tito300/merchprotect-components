/// <reference types="react" />

import { Admin, Socket } from '../../types/chat';

interface ChatProp {

    socketConfigs: Socket;

    color?: string;

    backgroundColor?: string;

    sentColor?: string;

    receiveColor?: string;

    admin: Admin;

}

declare function ChatAdmin({ admin, backgroundColor, color, sentColor, receiveColor, socketConfigs }: ChatProp): JSX.Element;

export default ChatAdmin;


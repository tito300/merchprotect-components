
type MsgSource = "admin" | "user";

export interface Message {
    id: number,
    msg: string,
    source: MsgSource,
    timestamp: string
}

export interface Socket {
    url: string,
    rooms: {roomId: string, roomName: string}[]
}


export interface Room {
    id: string,
    name: string,
    active: boolean,
    handled: boolean,
    agent: string,
    messages: Message[],
}

export interface Admin {
    token: string,
    name: string,
    currentRoom?: Room,
}

export interface Theme {
    color?: string,
    backgroundColor?: string,
    sentColor?: string,
    receiveColor?: string,
}

export interface IUser {
    id: string
    userName: string
    name: string
    email: string
    password: string
}

export interface IChat {
    chatId: string
    participants: []
    timestamp: Date
    archived: []
    blocked: []
}

export interface IMessage {
    messageId: string
    chatId: string
    content: string
    senderId: string
    timestamp: Date
    attachment: string
    isDeleted: boolean
}


export interface MessagePayLoad {
    roomId: string
    participantId: string
    content: string
    senderId: string
    url?: string
}
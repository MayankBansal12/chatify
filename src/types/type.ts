
export interface IUserChats {
    id: string
    username: string
    name: string
    chatId: string
    timestamp: Date
    archived: [],
    blocked: []
}

export interface IUser {
    id: string
    username: string
    name: string
    email: string
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
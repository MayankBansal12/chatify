
export interface IUser {
    id: number
    userName: string
    name: string
    email: string
    password: string
}

export interface IChat {
    chatId: number
    participants: []
    timestamp: Date
    archived: []
    blocked: []
}

export interface IMessage {
    messageId: number
    content: string
    senderId: number
    timestamp: Date
    attachment: []
    isDeleted: boolean
}


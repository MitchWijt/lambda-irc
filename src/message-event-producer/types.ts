export interface EventBusEntry {
    Detail: string,
    DetailType: string,
    EventBusName: string,
    Source: string
}

export interface EventBusParams {
    Entries: EventBusEntry[]
}

export interface MessageBody {
    messageDetails: {
        name: string,
        message: string
    },
    socketUrl: string
}
import { MessageBody, EventBusParams } from "../types";

const BUS_NAME = "ircstackirceventbus954BCF59"

export {
    convertRequestBodyToMessageEntry
}

function convertRequestBodyToMessageEntry(data: MessageBody): EventBusParams {
    if(!data.messageDetails.name || !data.messageDetails.message) throw new Error("Message and Name are required")

    return {
        Entries: [
            {
                Detail: JSON.stringify(data),
                DetailType: JSON.stringify(Object.keys(data)),
                EventBusName: BUS_NAME,
                Source: 'newMessage'
            }
        ]
    }
}
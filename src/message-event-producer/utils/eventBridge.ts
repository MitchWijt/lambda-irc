import { MessageBody, EventBusParams } from "../types";

const BUS_NAME = "ircstackirceventbus954BCF59"

export {
    convertRequestBodyToMessageEntry
}

function convertRequestBodyToMessageEntry(data: MessageBody): EventBusParams {
    return {
        Entries: [
            {
                Detail: JSON.stringify({name: data.name, message: data.message}),
                DetailType: JSON.stringify(Object.keys(data)),
                EventBusName: BUS_NAME,
                Source: 'newMessage'
            }
        ]
    }
}
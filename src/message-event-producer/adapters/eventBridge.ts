import EventBridge from "aws-sdk/clients/eventbridge"
import { EventBusParams } from "../types";

const eventBridge = new EventBridge()

export {
    putDataInEventBus
}

async function putDataInEventBus(eventBusParams: EventBusParams) {
    return new Promise((resolve, reject) => {
        eventBridge.putEvents(eventBusParams, (err: any, data: any) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}
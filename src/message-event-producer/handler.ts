import { putDataInEventBus } from "./adapters/eventBridge";
import { convertRequestBodyToMessageEntry } from "./utils/eventBridge";

exports.handler = async function(request: any) {
    try {
        const reqBody = JSON.parse(request.body)
        const messageEntry = convertRequestBodyToMessageEntry(reqBody)
        const res = await putDataInEventBus(messageEntry)

        return {
            statusCode: 200,
            body: JSON.stringify(res),
            isBase64Encoded: false
        }
    } catch(err: any) {
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify(err.message || err.description),
            isBase64Encoded: false
        }
    }
}
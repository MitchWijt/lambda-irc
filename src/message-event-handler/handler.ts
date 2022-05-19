import { io } from "socket.io-client"

exports.clientHandler = async function(event: any) {
    const eventDetails = event.detail
    const message = eventDetails.messageDetails

    let socket = io(event.detail.socketUrl)
    await emitMessage(socket, message)

    socket.disconnect()
}

function emitMessage(socket: any, message: any) {
    return new Promise((resolve, reject) => {
        socket.emit("message", JSON.stringify(message), (err: Error, msg: any) => {
            if(err) reject(err)
            resolve(msg)
        })
    })
}
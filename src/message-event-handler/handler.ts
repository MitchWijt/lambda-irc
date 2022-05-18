import { io } from "socket.io-client"

exports.clientHandler = async function(event: any) {
    const message = event.detail

    let socket = io("http://165.232.89.237:3000/")
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
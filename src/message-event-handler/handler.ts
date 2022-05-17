exports.clientHandler = async function(event: any) {
    return {
        statusCode: 200,
        body: JSON.stringify("Hello Client")
    }
    // get event.detail
    // create a connection with the socket.io server
    // sent message from the event.detail to the socket.io server.

    // import { io as clientIo } from 'socket.io-client'
    // app.get('/send-message', (req, res) => {
    //     const socketClient = clientIo("ws://localhost:3000")
    //     socketClient.emit("message", "this is a new message")
    //
    //     setTimeout(() => {
    //         socketClient.disconnect()
    //     }, 2000)
    //
    //     res.json("message sent")
    // })
}
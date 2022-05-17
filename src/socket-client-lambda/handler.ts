exports.clientHandler = async function(event: any) {
    return {
        statusCode: 200,
        body: JSON.stringify("Hello Client")
    }
}
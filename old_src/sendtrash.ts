/* async function destroyConnection(device) {
    console.log("** Disconnecting from device. **")
    await device.disconnect()
}

async function sendColorToDevice(r, g, b, service) {
    var rhex = "0x" + r
    var ghex = "0x" + g
    var bhex = "0x" + b
    const colorBuffer = Buffer.from([0x3c, 0x02, parseInt(rhex), parseInt(ghex), parseInt(bhex), 0x18, 0x0c, 0xe4, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    const colorChar = await service.getCharacteristic(primaryCharacteristic)

    console.log(colorBuffer)
    await colorChar.writeValue(colorBuffer)
    console.log("** SENT. **")
    return
}

function getColorHex(service, device) {
    readline.question('Give me a color: ', (color: string) => {
        if (color == "exit") {
            readline.close()
            destroyConnection(device)
        }
        console.log("** SENDING: " + color + " **") 
        var r = color.substr(0, 2)
        var g = color.substr(2, 2)
        var b = color.substr(4, 2)
        sendColorToDevice(r, g, b, service)
        getColorHex(service, device)        
    })
} */
import { createBluetooth } from "node-ble"

async function main() {
    const { bluetooth, destroy } = createBluetooth()
    const adapter = await bluetooth.defaultAdapter()

    if (!await adapter.isDiscovering())
        await adapter.startDiscovery()

    const device = await adapter.waitDevice('24:71:89:1D:64:52')
    console.log("Connecting to device.")
    await device.connect()

    await device.disconnect()
    console.log("Bluetooth connection is no longer stuck.")
    destroy()
}

main()
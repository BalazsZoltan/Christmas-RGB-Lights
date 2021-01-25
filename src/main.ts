import { createBluetooth } from "node-ble"
import { delay } from "./delay"

const sun = require('sun-time');
const prompts = require('prompts')
const progressBar = require('progress');

const primaryService = '00001000-0000-1000-8000-00805f9b34fb'
const primaryCharacteristic = '00001001-0000-1000-8000-00805f9b34fb'

async function getHexColor() {
    var re = /^[0-9A-Fa-f]{6}$/g
    const response = await prompts({
        type: 'text',
        name: 'color',
        message: 'Enter a hex color: ',
        validate: (color: string) => re.test(color) ? true : `Valid hex color.`
    })
    return response.color
}

function hsvToRgb(h, s, v) {
    var r, g, b;
  
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
  
    return [ r, g, b ];
}

async function drawProgressBar(startingMessage, endMessage) {
    var bar = new progressBar(startingMessage + ':bar', {
        complete: '.',
        incomplete: ' ',
        width: 10,
        total: 20
    });
    var timer = setInterval(function () {
        bar.tick();
        if (bar.complete) {
          console.log(endMessage);
          clearInterval(timer);
        }
    }, 250);
}

async function main() {
    const { bluetooth, destroy } = createBluetooth()
    const adapter = await bluetooth.defaultAdapter()

    if (!await adapter.isDiscovering())
        await adapter.startDiscovery()

    const device = await adapter.waitDevice('24:71:89:1D:64:52')

    await device.connect()
    await drawProgressBar('Connecting to device', 'Connected')
    const gattServer = await device.gatt()

    var sunRise = sun.rise('Budapest')
    var sunSet = sun.set('Budapest')
    
    /* while (true) {
        var today = new Date()
        var todayHour = today.getHours()
        var todayMinute = today.getMinutes()
        console.log(todayHour + ":" + todayMinute)
        console.log((todayHour == parseInt(sunSet.substr(0, 2))) && (todayMinute == parseInt(sunSet.substr(3, 2))))
        if ((todayHour == parseInt(sunSet.substr(0, 2))) && (todayMinute == parseInt(sunSet.substr(3, 2)))) {
            const service = await gattServer.getPrimaryService(primaryService)
            const characteristic = await service.getCharacteristic(primaryCharacteristic)
            const packet = buildPacket({
                type: PacketType.SteadyColor,
                red: 1,
                green: 1,
                blue: 1
            })
            await characteristic.writeValue(Buffer.from(packet))
        }
        await delay(60000)
    } */
    
    const service = await gattServer.getPrimaryService(primaryService)
    const characteristic = await service.getCharacteristic(primaryCharacteristic)

    /* let hue = 0
    setInterval(async () => {
        hue = (hue + 0.01) % 1
        const [r, g, b] = hsvToRgb(hue, 1, 1)
        const packet = buildPacket({
            type: PacketType.SteadyColor,
            red: r,
            green: g,
            blue: b
        })
        await characteristic.writeValue(Buffer.from(packet))
    }, 10)
     */

    while (true) {
        var color = await getHexColor()
        const packet = buildPacket({
            type: PacketType.SteadyColor,
            red: parseInt("0x" + color.substr(0, 2)) / 255,
            green: parseInt("0x" + color.substr(2, 2)) / 255,
            blue: parseInt("0x" + color.substr(4, 2)) / 255
        })
        await characteristic.writeValue(Buffer.from(packet))
    }

    /* await device.disconnect()
    destroy() */
}

main().catch(() => { console.error("mimimi") })

//#region packets.ts

export enum PacketType {
    SyncTime,
    TurnOnOff,
    SteadyColor,
    UniColor,
    MultiColor,
    Speed,
    Timer
}

type BasePacket = {
    type: PacketType
}

export type SyncTimePacket = BasePacket & {
    type: PacketType.SyncTime
    time: number[]
}

export type OnOffPacket = BasePacket & {
    type: PacketType.TurnOnOff
    on: boolean
}

export type SteadyColorPacket = BasePacket & {
    type: PacketType.SteadyColor
    /** Red value. Range 0.0..1.0 */
    red: number
    /** Red value. Range 0.0..1.0 */
    green: number
    /** Red value. Range 0.0..1.0 */
    blue: number
}

// Todo: More packet types

type Packet = SyncTimePacket | OnOffPacket | SteadyColorPacket

export default Packet

//#endregion

//#region builder.ts

const MAGIC_VALUE = 0x3c

// Todo: buildSyncTimePacket()

function buildOnOffPacket(packet: OnOffPacket) {
    const array = new Uint8Array(3)
    const view = new DataView(array.buffer)

    view.setUint8(0, MAGIC_VALUE)
    view.setUint8(1, packet.type)
    view.setUint8(2, +packet.on)

    return array
}

function buildSteadyColorPacket(packet: SteadyColorPacket) {
    const array = new Uint8Array(5)
    const view = new DataView(array.buffer)

    view.setUint8(0, MAGIC_VALUE)
    view.setUint8(1, packet.type)
    
    const red = formatColor(packet.red)
    const green = formatColor(packet.green)
    const blue = formatColor(packet.blue)

    view.setUint8(2, red)
    view.setUint8(3, green)
    view.setUint8(4, blue)

    return array
}

export function buildPacket(packet: Packet): Uint8Array {
    switch(packet.type) {
        case PacketType.TurnOnOff:
            return buildOnOffPacket(packet)
        case PacketType.SteadyColor:
            return buildSteadyColorPacket(packet)
    }

    return null
}

//#endregion

//#region utils.ts

export function withinRange(min: number, max: number, value: number) {
    return Math.max(
        Math.min(
            value,
            max
        ),
        min
    )
}

export function formatColor(value: number) {
    return withinRange(0, 255, Math.round(value * 255))
}

//#endregion
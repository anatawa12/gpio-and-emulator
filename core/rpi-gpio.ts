import * as GPIO from 'rpi-gpio';
import {ISimpleInternalApi} from "./ISimpleInternalApi";
//const GPIO = require('rpi-gpio');
const gpio = GPIO.promise;
const {EventEmitter} = require('events');


GPIO.setMode(GPIO.MODE_BCM);

class RpiGpio implements ISimpleInternalApi {
    async setup(channel, direction, edge?) {
        await gpio.setup(channel, direction, edge)
    }

    async write(channel, value) {
        await gpio.write(channel, value)
    }

    async read(channel) {
        return await gpio.read(channel)
    }

    async destroy() {
        await gpio.destroy()
    }

    /**
     * @type EventEmitter
     */
    e: GPIO
}

module.exports = new RpiGpio();

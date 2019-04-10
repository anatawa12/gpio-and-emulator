const GPIO = require('rpi-gpio');
const gpio = GPIO.promise;
const {EventEmitter} = require('events');


GPIO.setMode(GPIO.MODE_BCM);

module.exports = {
    /**
     * wait for end init
     * @return {Promise<void>}
     */
    waitInit: async function () {
    },


    /**
     * set up pin #channel
     * @param {number}     channel
     * @param {"in"|"out"} direction
     * @param {'none'|'rising'|'falling'|'both'} edge
     * @return {Promise<void>}
     */
    setup: async function (channel, direction, edge) {
        await gpio.setup(channel, direction, edge)
    },

    /**
     *
     * @param channel {number}
     * @param value   {boolean}
     * @return {Promise<void>}
     */
    write: async function (channel, value) {
        await gpio.write(channel, value)
    },

    /**
     *
     * @param channel {number}
     * @return {Promise<boolean>}
     */
    read: async function (channel) {
        return await gpio.read(channel)
    },

    /**
     *
     * @return {Promise<void>}
     */
    destroy: async function () {
        await gpio.destroy()
    },

    /**
     * @type EventEmitter
     */
    e: GPIO,
};

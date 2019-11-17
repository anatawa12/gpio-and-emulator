import {Selected} from "gpio-and-emulator";

const rpiModeMap = {
    // 1: 3.3v
    // 2: 5v
    '3': 2,
    // 4: 5v
    '5': 3,
    // 6: ground
    '7': 4,
    '8': 14,
    // 9: ground
    '10': 15,
    '11': 17,
    '12': 18,
    '13': 27,
    // 14: ground
    '15': 22,
    '16': 23,
    // 17: 3.3v
    '18': 24,
    '19': 10,
    // 20: ground
    '21': 9,
    '22': 25,
    '23': 11,
    '24': 8,
    // 25: ground
    '26': 7,

    // Model B+ pins
    // 27: ID_SD
    // 28: ID_SC
    '29': 5,
    // 30: ground
    '31': 6,
    '32': 12,
    '33': 13,
    // 34: ground
    '35': 19,
    '36': 16,
    '37': 26,
    '38': 20,
    // 39: ground
    '40': 21

};

const rpiSelector = (ch) => rpiModeMap[ch.toString()];
const bcmSelector = (ch) => ch;

const DIR_IN = 'in';
const DIR_OUT = 'out';
const DIR_LOW = 'low';
const DIR_HIGH = 'high';

const MODE_RPI = 'mode_rpi';
const MODE_BCM = 'mode_bcm';

const EDGE_NONE = 'none';
const EDGE_RISING = 'rising';
const EDGE_FALLING = 'falling';
const EDGE_BOTH = 'both';

/**
 * api like 'rpi-gpio' package.
 */
class RpiGpio {
    DIR_IN = DIR_IN;
    DIR_OUT = DIR_OUT;
    DIR_LOW = DIR_LOW;
    DIR_HIGH = DIR_HIGH;

    MODE_RPI = MODE_RPI;
    MODE_BCM = MODE_BCM;

    EDGE_NONE = EDGE_NONE;
    EDGE_RISING = EDGE_RISING;
    EDGE_FALLING = EDGE_FALLING;
    EDGE_BOTH = EDGE_BOTH;

    promise: RpiGpioPromise;

    selector = rpiSelector;
    private base: Selected;

    /**
     * init
     * @param base {Selected}
     */
    constructor(base: Selected) {
        this.base = base;
        this.promise = new RpiGpioPromise(this, base);
    }

    /**
     * Set pin reference mode. Defaults to 'mode_rpi'.
     *
     * @param {'mode_rpi'|'mode_bcm'} mode Pin reference mode
     */
    setMode(mode) {
        if (mode === this.MODE_RPI) {
            this.selector = rpiSelector
        } else if (mode === this.MODE_BCM) {
            this.selector = bcmSelector
        } else {
            throw new Error('Cannot set invalid mode');
        }
    };


    /**
     * Setup a channel for use as an input or output
     *
     * @param {number}                           channel           Reference to the pin in the current mode's schema
     * @param {'in'|'out'}                       [direction='out'] The pin direction, either 'in' or 'out'
     * @param {'none'|'rising'|'falling'|'both'} [edge='none']     Informs the GPIO chip if it needs to generate interrupts. Either 'none', 'rising', 'falling' or 'both'. Defaults to 'none'
     * @param {function(Error=):void}            onSetup           Optional callback
     */
    setup(channel, direction, edge, onSetup) {
        if (arguments.length === 2 && typeof direction == 'function') {
            // noinspection JSValidateTypes
            onSetup = direction;
            direction = this.DIR_OUT;
            edge = this.EDGE_NONE;
        } else if (arguments.length === 3 && typeof edge == 'function') {
            // noinspection JSValidateTypes
            onSetup = edge;
            edge = this.EDGE_NONE;
        }
        this.promise.setup(channel, direction, edge)
            .then(() => onSetup())
            .catch((e) => onSetup(e))
    }


    /**
     * Write a value to a channel
     *
     * @param {number}                channel The channel to write to
     * @param {boolean}               value   If true, turns the channel on, else turns off
     * @param {function(Error=):void} cb      Optional callback
     */
    write(channel, value, cb) {
        this.promise.write(channel, value)
            .then(() => cb())
            .catch((e) => cb(e))
    }

    /**
     * Write a value to a channel
     *
     * @param {number}                channel The channel to write to
     * @param {boolean}               value   If true, turns the channel on, else turns off
     * @param {function(Error=):void} cb      Optional callback
     */
    output(channel, value, cb) {
        this.write(channel, value, cb)
    }

    /**
     * Read a value from a channel
     *
     * @param {number}                channel The channel to read from
     * @param {function(Error|null, boolean=):void} cb      Callback which receives the channel's boolean value
     */
    read(channel, cb) {
        this.promise.read(channel)
            .then((v) => cb(null, v))
            .catch((e) => cb(e))
    }

    /**
     * Read a value from a channel
     *
     * @param {number}                channel The channel to read from
     * @param {function(Error|null, boolean=):void} cb      Callback which receives the channel's boolean value
     */
    input(channel, cb) {
        this.read(channel, cb)
    }

    /**
     * Unexport any pins setup by this module
     *
     * @param {function(Error=):void} cb Optional callback
     */
    destroy(cb) {
        this.promise.destroy()
            .then(() => cb())
            .catch((e) => cb(e))
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Reset the state of the module
     */
    reset() {
        throw Error("unsupported operation: reset");
    }
}

class RpiGpioPromise {
    private base: Selected;
    private gpio: RpiGpio;

    /**
     * init
     * @param gpio {RpiGpio}
     * @param base {Selected}
     */
    constructor(gpio: RpiGpio, base: Selected) {
        this.gpio = gpio;
        this.base = base;
    }

    /**
     * Setup a channel for use as an input or output
     *
     * @param {number}                           channel       Reference to the pin in the current mode's schema
     * @param {'in'|'out'}                       direction     The pin direction, either 'in' or 'out'
     * @param {'none'|'rising'|'falling'|'both'} [edge='none'] Informs the GPIO chip if it needs to generate interrupts. Either 'none', 'rising', 'falling' or 'both'. Defaults to 'none'
     * @return {Promise<void>}
     */
    async setup(channel, direction, edge) {
        await this.base.setup(this.gpio.selector(channel), direction, edge);
    }


    /**
     * Write a value to a channel
     *
     * @param {number}   channel The channel to write to
     * @param {boolean}  value   If true, turns the channel on, else turns off
     * @return {Promise<void>}
     */
    async write(channel, value) {
        await this.base.write(this.gpio.selector(channel), value);
    }

    /**
     * Read a value from a channel
     *
     * @param {number}   channel The channel to read from
     * @return {Promise<boolean>}
     */
    async read(channel) {
        return await this.base.read(this.gpio.selector(channel));
    }

    /**
     * Unexport any pins setup by this module
     * @return {Promise<void>}
     */
    async destroy() {
        await this.base.destroy();
    }
}

module.exports = RpiGpio;

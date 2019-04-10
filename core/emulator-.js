const carlo = require('carlo');
const {EventEmitter} = require('events');

let isInited = false;
/**
 * @type {(function():void)[]|null}
 */
let waitForInit = [];

/**
 * @return Promise<void>
 */
let update;

// null   : invalid pin
// 'none' : not mode set
// 'non'  : not mode set and on
// 'on'   : input mode and on
// 'off'  : input mode and off
// 'high' : out put mode and on
// 'low'  : out put mode and off
/**
 *
 * @type {(null|'none'|'non'|'on'|'off'|'high'|'low')[]}
 */
const elements = [
    null, null,
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',// 27
];
/**
 *
 * @type {(null|'none'|'rising'|'falling'|'both')[]}
 */
const edges = [
    null, null,
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',// 27
];

const e = new EventEmitter();

module.exports = {
    /**
     * wait for end init
     * @return {Promise<void>}
     */
    waitInit: function () {
        if (isInited) return Promise.resolve();
        else return new Promise((resolve) => {
            waitForInit.push(resolve)
        })
    },


    /**
     * set up pin #channel
     * @param {number}     channel
     * @param {"in"|"out"} direction
     * @param {'none'|'rising'|'falling'|'both'} edge
     * @return {Promise<void>}
     */
    setup: async function (channel, direction, edge) {
        await this.waitInit();
        if (["in", "out"].indexOf(direction) === -1)
            throw TypeError("Cannot set invalid direction");
        if (['none', 'rising', 'falling', 'both'].indexOf(edge) === -1)
            throw TypeError("Cannot set invalid edge");
        if (!(typeof channel === "number" && Number.isInteger(channel)))
            throw TypeError("channel is not integer");

        if (!elements[channel])
            throw Error(`invalid channel: ${channel}`);
        switch (elements[channel]) {
            case "on":
            case "off":
            case "high":
            case "low":
                throw Error(`channel is already seted up: ${channel}`);
            case "none":
                if (direction === 'in') {
                    elements[channel] = "off"
                } else {
                    elements[channel] = "low"
                }
                break;
            case "non":
                if (direction === 'in') {
                    elements[channel] = "on"
                } else {
                    elements[channel] = "low"
                }
                break;
        }
        edges[channel] = edge;
        await update();
    },

    /**
     *
     * @param channel {number}
     * @param value   {boolean}
     * @return {Promise<void>}
     */
    write: async function (channel, value) {
        await this.waitInit();
        if (!(typeof channel === "number" && Number.isInteger(channel)))
            throw TypeError("channel is not integer");
        if (typeof value !== "boolean")
            throw TypeError("value is not boolean");

        if (!elements[channel])
            throw Error(`invalid channel: ${channel}`);
        switch (elements[channel]) {
            case "on":
            case "off":
            case "none":
            case "non":
                throw Error(`channel is not output mode: ${channel}`);
            case "high":
            case "low":
                if (value) {
                    elements[channel] = "high"
                } else {
                    elements[channel] = "low"
                }
                break;
        }
        await update();
    },

    /**
     *
     * @param channel {number}
     * @return {Promise<boolean>}
     */
    read: async function (channel) {
        await this.waitInit();
        if (!(typeof channel === "number" && Number.isInteger(channel)))
            throw TypeError("channel is not integer");

        if (!elements[channel])
            throw Error(`invalid channel: ${channel}`);
        switch (elements[channel]) {
            case "high":
            case "low":
            case "none":
            case "non":
                throw Error(`channel is not input mode: ${channel}`);
            case "on":
                return true;
            case "off":
                return false;
        }
    },

    /**
     *
     * @return {Promise<void>}
     */
    destroy: async function () {
        for (let i = 2; i < 28; i++) {
            elements[i] = 'none';
        }
    },

    /**
     * @type EventEmitter
     */
    e: e,
};

function onChange(channel, stat) {
    if (!(typeof channel === "number" && Number.isInteger(channel)))
        throw TypeError("channel is not integer");
    if (!(typeof stat === "boolean"))
        throw TypeError("stat is not boolean");

    if (!elements[channel])
        throw Error(`invalid channel: ${channel}`);
    switch (elements[channel]) {
        case "high":
        case "low":
            throw Error(`channel is output mode: ${channel}`);
        case "none":
        case "non":
            if (stat) {
                elements[channel] = "non"
            } else {
                elements[channel] = "none"
            }
            break;
        case "on":
        case "off":
            switch (edges[channel]) {
                case "none":
                    break;
                case "falling":
                    if (!stat) e.emit('change', channel, stat);
                    break;
                case "rising":
                    if (stat) e.emit('change', channel, stat);
                    break;
                case "both":
                    e.emit('change', channel, stat);
                    break;
            }
            if (stat) {
                elements[channel] = "on"
            } else {
                elements[channel] = "off"
            }
            break;
    }
}

const bootstrap = async () => {
    const app = await carlo.launch({
        width: 304,
        height: 522
    });
    app.on('exit', () => process.exit());
    app.serveFolder(__dirname);

    await app.exposeFunction('gpios', () => elements);
    await app.exposeFunction('update', onChange);

    update = async () => {
        await app.evaluate("update1();")
    };

    await app.load(`emulator.html`);

    process.on("beforeExit", async () => {
        await app.close()
    });

    isInited = true;
    for (const waitForInitElement of waitForInit) {
        process.nextTick(waitForInitElement);
    }
    waitForInit = null;
};

// noinspection JSIgnoredPromiseFromCall
bootstrap();

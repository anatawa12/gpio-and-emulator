import {Direction, Edge, ISimpleInternalApi} from "./ISimpleInternalApi";
import {BCMChannel} from "../gpio-and-emulator";
import {EventEmitter} from 'events';

const carlo = require('carlo');

let isInited = false;
let waitForInit: (() => void)[] = [];

let update: () => Promise<void>;

// null   : invalid pin
// 'none' : not mode set
// 'non'  : not mode set and on
// 'on'   : input mode and on
// 'off'  : input mode and off
// 'high' : out put mode and on
// 'low'  : out put mode and off
type ElementStatus = null | 'none' | 'non' | 'on' | 'off' | 'high' | 'low'
const elements: ElementStatus[] = [
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
type EdgeStatus = null | 'none' | 'rising' | 'falling' | 'both'
const edges: EdgeStatus[] = [
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

class Emulator implements ISimpleInternalApi {
    private waitInit() {
        if (isInited) return Promise.resolve();
        else return new Promise((resolve) => {
            waitForInit.push(resolve)
        })
    }

    async destroy(): Promise<void> {
        for (let i = 2; i < 28; i++) {
            elements[i] = 'none';
        }
        await update();
        await app.exit();
    }

    async read(channel: BCMChannel): Promise<boolean> {
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
    }

    async setup(channel: BCMChannel, direction: Direction, edge?: Edge): Promise<void> {
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
    }

    async write(channel: BCMChannel, value: boolean): Promise<void> {
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
    }

    e = e;
}

module.exports = new Emulator();

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

let app;

const bootstrap = async () => {
    app = await carlo.launch({
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
        await app.exit()
    });

    isInited = true;
    for (const waitForInitElement of waitForInit) {
        process.nextTick(waitForInitElement);
    }
    waitForInit = null;
};

// noinspection JSIgnoredPromiseFromCall
bootstrap();

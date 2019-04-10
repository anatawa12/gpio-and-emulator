import * as fs from 'fs';
import {EventEmitter} from 'events';
import {ISimpleInternalApi} from "./core/ISimpleInternalApi";


class Selected extends EventEmitter {
    private base: ISimpleInternalApi;

    constructor(useEmulator?: boolean) {
        super();
        if (useEmulator || process.platform !== "linux") {
            this.base = require('./core/emulator')
        } else {
            try {
                const issue = fs.readFileSync('/etc/issue', 'utf8');
                if (issue.startsWith('Raspbian')) {
                    this.base = require('./core/rpi-gpio')
                } else {
                    this.base = require('./core/emulator')
                }
            } catch (e) {
                this.base = require('./core/emulator')
            }
        }
        this.base.e.on('change', (channel, value) => {
            this.emit('change', channel, value);
        })
    }

    /**
     * set up pin #channel
     * @param {number}     channel
     * @param {"in"|"out"} direction
     * @param {'none'|'rising'|'falling'|'both'} [edge='none']
     * @return {Promise<void>}
     */
    async setup(channel, direction, edge) {
        await this.base.setup(channel, direction, edge || 'none')
    }

    /**
     *
     * @param channel {number}
     * @param value   {boolean}
     * @return {Promise<void>}
     */
    async write(channel, value) {
        await this.base.write(channel, value)
    }

    /**
     *
     * @param channel {number}
     * @return {Promise<boolean>}
     */
    async read(channel) {
        return await this.base.read(channel)
    }

    /**
     *
     * @return {Promise<void>}
     */
    async destroy() {
        await this.base.destroy()
    }
}

module.exports = Selected;

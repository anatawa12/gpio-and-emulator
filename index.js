const Selected = require('./selector');
const RpiGpio = require('./rpi-gpio');

const Undefined = {};

function lazy(init) {
    let v;
    return () => {
        if (v === Undefined) return void 0;
        if (v !== void 0) return v;
        v = init();
        if (v === void 0) return void 0;
        return v;
    }
}

module.exports.isBCMChannel = function (arg) {
    if (!(typeof arg == 'number')) return false;
    if (!Number.isInteger(arg)) return false;
    if (!(2 <= arg && arg < 28)) return false;
    return true;
};

module.exports.isBCMOrRPIChannel = function (arg) {
    if (!(typeof arg == 'number')) return false;
    if (!Number.isInteger(arg)) return false;
    if (!(1 <= arg && arg <= 40)) return false;
    return true;
};

module.exports.useEmulator = process.env['USE_EMULATOR']?.toLowerCase() === 'true';

Object.defineProperty(module.exports, 'selected', {
    get: lazy(() => new Selected(module.exports.useEmulator)),
});

Object.defineProperty(module.exports, 'rpiGpio', {
    get: lazy(() => new RpiGpio(module.exports.selected)),
});

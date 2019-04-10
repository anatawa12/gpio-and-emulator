const gpio = require('gpio-and-emulator').selected;

(async () => {
    const ch = Number(process.argv[2] || 2);
    await gpio.setup(ch, "out");

    const wait = 1000;

    const makeOn = async () => {
        await gpio.write(ch, true);
        setTimeout(makeOff, wait)
    };

    const makeOff = async () => {
        await gpio.write(ch, false);
        setTimeout(makeOn, wait)
    };
    await makeOn()
})();

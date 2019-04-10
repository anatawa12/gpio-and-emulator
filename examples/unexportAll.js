const gpio = require('gpio-and-emulator').selected;

(async () => {
    for (let i = 2; i < 28; i++) {
        await gpio.setup(i, "in", "both");
    }
    await gpio.destroy();
})();

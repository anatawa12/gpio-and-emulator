const gpio = require('gpio-and-emulator').selected;

(async () => {
    for (let i = 2; i < 28; i++) {
        await gpio.setup(i, "in", "both");
    }

    gpio.on('change',
        (ch, log) => {
            console.log(`ch: ${ch} to ${log}`)
        }
    );

    const f = () => {
        setTimeout(f, 1000);
    };

    f();
})();

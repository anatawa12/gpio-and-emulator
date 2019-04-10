import {isBCMChannel, selected as gpio} from 'gpio-and-emulator';

(async () => {
    const inch = Number(process.argv[2] || 2);

    if (!isBCMChannel(inch)) return;

    await gpio.setup(inch, "out");

    const wait = 1000;

    const makeOn = async () => {
        await gpio.write(inch, true);
        setTimeout(makeOff, wait)
    };

    const makeOff = async () => {
        await gpio.write(inch, false);
        setTimeout(makeOn, wait)
    };
    await makeOn()
})();

declare module "rpi-gpio" {

    import {EventEmitter} from "events";
    type PinMode = 'mode_rpi' | 'mode_bcm';
    type Direction = "in" | "out";
    type Edge = "none" | "rising" | "falling" | "both";

    class Gpio extends EventEmitter {
        DIR_IN: "in";
        DIR_OUT: "out";
        DIR_LOW: "low";
        DIR_HIGH: "high";

        MODE_RPI: "mode_rpi";
        MODE_BCM: "mode_bcm";

        EDGE_NONE: "none";
        EDGE_RISING: "rising";
        EDGE_FALLING: "falling";
        EDGE_BOTH: "both";

        setMode(mode: PinMode): void;

        setup(channel: number, direction: Direction, edge?: Edge, cb?: (err?: NodeJS.ErrnoException) => void): void;
        setup(channel: number, direction: Direction, cb?: (err?: NodeJS.ErrnoException) => void): void;

        write(channel: number, value: boolean, cb?: (err?: NodeJS.ErrnoException) => void): void;

        output(channel: number, value: boolean, cb?: (err?: NodeJS.ErrnoException) => void): void;

        read(channel: number, cb: (err?: NodeJS.ErrnoException, value?: boolean) => void): void;

        input(channel: number, cb: (err?: NodeJS.ErrnoException, value?: boolean) => void): void;

        destroy(cb: (err?: Error) => void): void;

        reset(): void;

        promise: GpioPromise
    }

    interface GpioPromise {
        setup(channel: number, direction: Direction, edge?: Edge): Promise<void>;

        write(channel: number, value: boolean): Promise<void>;

        read(channel: number): Promise<boolean>;

        destroy(): Promise<void>;
    }

    const GPIO: Gpio;
    export = GPIO;
}

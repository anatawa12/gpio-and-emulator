declare module 'gpio-and-emulator' {
    import {EventEmitter} from "events";


    export const selected: Selected;
    export const rpiGpio: RpiGpio;
    export const useEmulator: boolean;

    function isBCMChannel(arg: any): arg is BCMChannel;

    function isBCMOrRPIChannel(arg: any): arg is (BCMChannel | RPIChannel);

    interface Selected extends EventEmitter {
        setup(channel: BCMChannel, direction: Direction, edge: Edge): Promise<void>

        setup(channel: BCMChannel, direction: Direction): Promise<void>

        write(channel: BCMChannel, value: boolean): Promise<void>

        read(channel: BCMChannel): Promise<boolean>

        destroy(): Promise<void>


        on(event: 'change', listener: (channel: BCMChannel, value: boolean) => void): this;
    }

    interface RpiGpio {
        DIR_IN: Direction;
        DIR_OUT: Direction;
        DIR_LOW: Direction;
        DIR_HIGH: Direction;

        MODE_RPI: RpiMode;
        MODE_BCM: RpiMode;

        EDGE_NONE: Edge;
        EDGE_RISING: Edge;
        EDGE_FALLING: Edge;
        EDGE_BOTH: Edge;

        setMode(mode: RpiMode): void;

        setup(channel: BCMChannel | RPIChannel, direction: Direction, edge: Edge, onSetup: DoneOrErrorCallback): void;

        write(channel: BCMChannel | RPIChannel, value: boolean, cb: DoneOrErrorCallback): void;

        output(channel: BCMChannel | RPIChannel, value: boolean, cb: DoneOrErrorCallback): void;

        read(channel: BCMChannel | RPIChannel, value: boolean, cb: ValueOrErrorCallback<boolean>): void;

        input(channel: BCMChannel | RPIChannel, value: boolean, cb: ValueOrErrorCallback<boolean>): void;

        destroy(cb: DoneOrErrorCallback)

        reset(): never

        promise: RpiGpioPromise
    }

    interface RpiGpioPromise {
        setup(channel: BCMChannel | RPIChannel, direction: Direction, edge: Edge): Promise<void>

        write(channel: BCMChannel | RPIChannel, value: boolean): Promise<void>

        read(channel: BCMChannel | RPIChannel, value: boolean): Promise<boolean>

        destroy(): Promise<void>
    }

    interface DoneOrErrorCallback {
        (): void

        (error: Error): void
    }

    interface ValueOrErrorCallback<T> {
        (error: null, value: T): void

        (error: Error): void
    }

    type BCMChannel =
        2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12
        | 13
        | 14
        | 15
        | 16
        | 17
        | 18
        | 19
        | 20
        | 21
        | 22
        | 23
        | 24
        | 25
        | 26
        | 27
    type RPIChannel =
        1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12
        | 13
        | 14
        | 15
        | 16
        | 17
        | 18
        | 19
        | 20
        | 21
        | 22
        | 23
        | 24
        | 25
        | 26
        | 27
        | 28
        | 29
        | 30
        | 31
        | 32
        | 33
        | 34
        | 35
        | 36
        | 37
        | 38
        | 39
        | 40
    type Direction = 'in' | 'out'
    type Edge = 'none' | 'rising' | 'falling' | 'both'
    type RpiMode = 'mode_rpi' | 'mode_bcm'
}

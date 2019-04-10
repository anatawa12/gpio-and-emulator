import {EventEmitter} from 'events';

interface ISimpleInternalApi {
    setup(channel: BCMChannel, direction: Direction, edge?: Edge): Promise<void>

    write(channel: BCMChannel, value: boolean): Promise<void>

    read(channel: BCMChannel): Promise<boolean>

    destroy(): Promise<void>

    e: EventEmitter
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
type Direction = 'in' | 'out'
type Edge = 'none' | 'rising' | 'falling' | 'both'

export {ISimpleInternalApi, Edge, Direction, BCMChannel}

# GPIO And Emulator

Control Raspberry Pi GPIO pins with node.js or emulate Raspberry Pi GPIO.

## Supported hardware

- Raspberry Pi 1 Model A
- Raspberry Pi 1 Model A+
- Raspberry Pi 1 Model B
- Raspberry Pi 1 Model B+
- Raspberry Pi 2 Model B
- Raspberry Pi 3 Model B
- Raspberry Pi 3 Model B+
- Raspberry Pi Zero
- Raspberry Pi Zero W

and support only Revision 2

Tested on Raspberry Pi 3 Model B or Raspberry Pi 3 Model B+. 
Others are supported form base API, [rpi-gpio](//www.npmjs.com/package/rpi-gpio).

## Configure

#### useEmulator

If true this will use Emulator regardless of platform. 
Please set before access API property e.g. `selected`, `rpiGpio`.  
if environment `USE_EMULATOR` is `true` without cases, Defaults to `true`, otherwise `false`.

## Utilities

utilities for type-safe.

#### isBCMChannel(arg)

returns `true` if arg is BCM Channel

#### isBCMOrRPIChannel(arg)

returns `true` if arg is BCM or RPI Channel 

## Simple (Basic) API

this API is a simple async API for GPIO.

this API is in `selected`.

### Methods

#### setup(channel, direction\[, edge]): Promise\<void>

Sets up a channel for read or write. Must be done before the channel can be used.
* channel: Reference to the pin in the current mode's schema.
* direction: The pin direction, pass either `'in'` for read mode or `'out'` for write mode. 
* edge: Interrupt generating GPIO chip setting, pass in `'none'` for no interrupts, `'rising'` for interrupts on rising values, `'falling'` for interrupts on falling values or `'both'` for all interrupts.\
Defaults to `'none'`.

#### write(channel, value): Promise\<void>

Writes the value of a channel.

* channel: Reference to the pin in the current mode's schema.
* value: Boolean value to specify whether the channel will turn on or off.

#### read(channel): Promise\<boolean>
Reads the value of a channel.

* channel: Reference to the pin in the current mode's schema.

#### destroy(): Promise\<void>

Tears down any previously set up channels. Should be run when your program stops, or needs to reset the state of the pins.

## Events

#### change
Emitted when the value of a channel changed. 
Sometimes call continuously with same value. 
 
* channel: change channel. Sometimes not changed.
* value: Changed value.

## Other API like APIs

This have [rpi-gpio](//www.npmjs.com/package/rpi-gpio) like API in `rpiGpio` property. 

## Examples

Examples is in `examples` directory

## Futures

- Add support for Revision 1
- Add other API like API. f.g. [onoff](//www.npmjs.com/packages/onoff), [rpio](//www.npmjs.com/package/rpio).

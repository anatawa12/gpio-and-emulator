"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var carlo = require('carlo');
var isInited = false;
var waitForInit = [];
var update;
var elements = [
    null, null,
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
];
var edges = [
    null, null,
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
    'none', 'none',
];
var e = new events_1.EventEmitter();
var Emulator = /** @class */ (function () {
    function Emulator() {
        this.e = e;
    }
    Emulator.prototype.waitInit = function () {
        if (isInited)
            return Promise.resolve();
        else
            return new Promise(function (resolve) {
                waitForInit.push(resolve);
            });
    };
    Emulator.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        for (i = 2; i < 28; i++) {
                            elements[i] = 'none';
                        }
                        return [4 /*yield*/, update()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, app.exit()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Emulator.prototype.read = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitInit()];
                    case 1:
                        _a.sent();
                        if (!(typeof channel === "number" && Number.isInteger(channel)))
                            throw TypeError("channel is not integer");
                        if (!elements[channel])
                            throw Error("invalid channel: " + channel);
                        switch (elements[channel]) {
                            case "high":
                            case "low":
                            case "none":
                            case "non":
                                throw Error("channel is not input mode: " + channel);
                            case "on":
                                return [2 /*return*/, true];
                            case "off":
                                return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Emulator.prototype.setup = function (channel, direction, edge) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitInit()];
                    case 1:
                        _a.sent();
                        if (["in", "out"].indexOf(direction) === -1)
                            throw TypeError("Cannot set invalid direction");
                        if (['none', 'rising', 'falling', 'both'].indexOf(edge) === -1)
                            throw TypeError("Cannot set invalid edge");
                        if (!(typeof channel === "number" && Number.isInteger(channel)))
                            throw TypeError("channel is not integer");
                        if (!elements[channel])
                            throw Error("invalid channel: " + channel);
                        switch (elements[channel]) {
                            case "on":
                            case "off":
                            case "high":
                            case "low":
                                throw Error("channel is already seted up: " + channel);
                            case "none":
                                if (direction === 'in') {
                                    elements[channel] = "off";
                                }
                                else {
                                    elements[channel] = "low";
                                }
                                break;
                            case "non":
                                if (direction === 'in') {
                                    elements[channel] = "on";
                                }
                                else {
                                    elements[channel] = "low";
                                }
                                break;
                        }
                        edges[channel] = edge;
                        return [4 /*yield*/, update()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Emulator.prototype.write = function (channel, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitInit()];
                    case 1:
                        _a.sent();
                        if (!(typeof channel === "number" && Number.isInteger(channel)))
                            throw TypeError("channel is not integer");
                        if (typeof value !== "boolean")
                            throw TypeError("value is not boolean");
                        if (!elements[channel])
                            throw Error("invalid channel: " + channel);
                        switch (elements[channel]) {
                            case "on":
                            case "off":
                            case "none":
                            case "non":
                                throw Error("channel is not output mode: " + channel);
                            case "high":
                            case "low":
                                if (value) {
                                    elements[channel] = "high";
                                }
                                else {
                                    elements[channel] = "low";
                                }
                                break;
                        }
                        return [4 /*yield*/, update()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Emulator;
}());
module.exports = new Emulator();
function onChange(channel, stat) {
    if (!(typeof channel === "number" && Number.isInteger(channel)))
        throw TypeError("channel is not integer");
    if (!(typeof stat === "boolean"))
        throw TypeError("stat is not boolean");
    if (!elements[channel])
        throw Error("invalid channel: " + channel);
    switch (elements[channel]) {
        case "high":
        case "low":
            throw Error("channel is output mode: " + channel);
        case "none":
        case "non":
            if (stat) {
                elements[channel] = "non";
            }
            else {
                elements[channel] = "none";
            }
            break;
        case "on":
        case "off":
            switch (edges[channel]) {
                case "none":
                    break;
                case "falling":
                    if (!stat)
                        e.emit('change', channel, stat);
                    break;
                case "rising":
                    if (stat)
                        e.emit('change', channel, stat);
                    break;
                case "both":
                    e.emit('change', channel, stat);
                    break;
            }
            if (stat) {
                elements[channel] = "on";
            }
            else {
                elements[channel] = "off";
            }
            break;
    }
}
var app;
var bootstrap = function () { return __awaiter(_this, void 0, void 0, function () {
    var _i, waitForInit_1, waitForInitElement;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, carlo.launch({
                    width: 304,
                    height: 522
                })];
            case 1:
                app = _a.sent();
                app.on('exit', function () { return process.exit(); });
                app.serveFolder(__dirname);
                return [4 /*yield*/, app.exposeFunction('gpios', function () { return elements; })];
            case 2:
                _a.sent();
                return [4 /*yield*/, app.exposeFunction('update', onChange)];
            case 3:
                _a.sent();
                update = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, app.evaluate("update1();")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, app.load("emulator.html")];
            case 4:
                _a.sent();
                process.on("beforeExit", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, app.exit()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                }); }); });
                isInited = true;
                for (_i = 0, waitForInit_1 = waitForInit; _i < waitForInit_1.length; _i++) {
                    waitForInitElement = waitForInit_1[_i];
                    process.nextTick(waitForInitElement);
                }
                waitForInit = null;
                return [2 /*return*/];
        }
    });
}); };
// noinspection JSIgnoredPromiseFromCall
bootstrap();
//# sourceMappingURL=emulator.js.map
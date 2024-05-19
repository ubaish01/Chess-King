"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var chess_js_1 = require("chess.js");
var messages_1 = require("./messages");
var Game = /** @class */ (function () {
    function Game(player1, player2) {
        var _this = this;
        var _a, _b;
        this.makeMove = function (socket, move) {
            var _a, _b, _c, _d, _e, _f;
            if (_this.movesCount % 2 == 0 && socket != ((_a = _this.player1) === null || _a === void 0 ? void 0 : _a.socket)) {
                console.log("early return 1");
                return;
            }
            if (_this.movesCount % 2 == 1 && socket != ((_b = _this.player2) === null || _b === void 0 ? void 0 : _b.socket)) {
                console.log("early return 2");
                return;
            }
            try {
                _this.board.move(move);
            }
            catch (error) {
                console.log(error);
                return;
            }
            if (_this.board.isGameOver()) {
                (_c = _this.player1) === null || _c === void 0 ? void 0 : _c.socket.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: _this.board.turn() === "w" ? "black" : "white",
                    },
                }));
                (_d = _this.player2) === null || _d === void 0 ? void 0 : _d.socket.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: _this.board.turn() === "w" ? "black" : "white",
                    },
                }));
                return;
            }
            if (_this.movesCount % 2 === 0) {
                (_e = _this.player2) === null || _e === void 0 ? void 0 : _e.socket.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move,
                }));
            }
            else {
                (_f = _this.player1) === null || _f === void 0 ? void 0 : _f.socket.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move,
                }));
            }
            _this.movesCount++;
        };
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.movesCount = 0;
        this.startTime = new Date();
        (_a = this.player1) === null || _a === void 0 ? void 0 : _a.socket.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                type: "w",
                opponent: player2 === null || player2 === void 0 ? void 0 : player2.name,
            },
        }));
        (_b = this.player2) === null || _b === void 0 ? void 0 : _b.socket.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                type: "b",
                opponent: player1 === null || player1 === void 0 ? void 0 : player1.name,
            },
        }));
    }
    return Game;
}());
exports.Game = Game;

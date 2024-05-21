"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        var _a, _b;
        this.makeMove = (socket, move) => {
            var _a, _b, _c, _d, _e, _f;
            if (this.movesCount % 2 == 0 && socket != ((_a = this.player1) === null || _a === void 0 ? void 0 : _a.socket)) {
                console.log("early return 1");
                return;
            }
            if (this.movesCount % 2 == 1 && socket != ((_b = this.player2) === null || _b === void 0 ? void 0 : _b.socket)) {
                console.log("early return 2");
                return;
            }
            try {
                this.board.move(move);
            }
            catch (error) {
                console.log(error);
                return;
            }
            if (this.board.isGameOver()) {
                (_c = this.player1) === null || _c === void 0 ? void 0 : _c.socket.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                }));
                (_d = this.player2) === null || _d === void 0 ? void 0 : _d.socket.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                }));
                return;
            }
            if (this.movesCount % 2 === 0) {
                (_e = this.player2) === null || _e === void 0 ? void 0 : _e.socket.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move,
                }));
            }
            else {
                (_f = this.player1) === null || _f === void 0 ? void 0 : _f.socket.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move,
                }));
            }
            this.movesCount++;
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
                opponent: player2,
            },
        }));
        (_b = this.player2) === null || _b === void 0 ? void 0 : _b.socket.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                type: "b",
                opponent: player1,
            },
        }));
    }
}
exports.Game = Game;

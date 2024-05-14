"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.makeMove = (socket, move) => {
            if (this.movesCount % 2 == 0 && socket != this.player1) {
                console.log("early return 1");
                return;
            }
            if (this.movesCount % 2 == 1 && socket != this.player2) {
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
                this.player1.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                }));
                this.player2.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                    },
                }));
                return;
            }
            if (this.movesCount % 2 === 0) {
                this.player2.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move,
                }));
            }
            else {
                this.player1.send(JSON.stringify({
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
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
}
exports.Game = Game;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.pendingUser = null;
        this.games = [];
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user != socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    //start the game
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            else if (message.type === messages_1.MOVE) {
                console.log(message);
                const game = this.games.find((curr) => curr.player1 === socket || curr.player2 === socket);
                if (game)
                    console.log("game found");
                game === null || game === void 0 ? void 0 : game.makeMove(socket, message.move);
            }
        });
    }
}
exports.GameManager = GameManager;

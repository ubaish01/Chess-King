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
        console.log("Here is am");
        this.users = this.users.filter((user) => user != socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            var _a, _b;
            const message = JSON.parse(data.toString());
            console.log(message);
            switch (message.type) {
                case messages_1.INIT_GAME: {
                    if (this.pendingUser) {
                        // same user should not connect with himself
                        if (this.pendingUser.socket == socket) {
                            socket.send("Please wait we are finding your oppenent");
                            return;
                        }
                        //start the game
                        this.pendingUser.waiting = false;
                        const game = new Game_1.Game(this.pendingUser, {
                            name: message.name,
                            type: "b",
                            socket,
                            waiting: false,
                            offer: null,
                        });
                        this.games.push(game);
                        this.pendingUser = null;
                    }
                    else {
                        this.pendingUser = {
                            name: message.name,
                            socket: socket,
                            type: "w",
                            waiting: true,
                            offer: message.offer,
                        };
                    }
                    break;
                }
                case messages_1.OFFER_ACCEPTED: {
                    const ans = message.ans;
                    const game = this.games.find((curr) => { var _a, _b; return ((_a = curr.player1) === null || _a === void 0 ? void 0 : _a.socket) === socket || ((_b = curr.player2) === null || _b === void 0 ? void 0 : _b.socket) === socket; });
                    const oppenent = ((_a = game === null || game === void 0 ? void 0 : game.player1) === null || _a === void 0 ? void 0 : _a.socket) === socket ? game === null || game === void 0 ? void 0 : game.player2 : game === null || game === void 0 ? void 0 : game.player1;
                    (_b = oppenent === null || oppenent === void 0 ? void 0 : oppenent.socket) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                        type: messages_1.OFFER_ACCEPTED,
                        ans,
                    }));
                    break;
                }
                case messages_1.MOVE: {
                    console.log(message);
                    const game = this.games.find((curr) => { var _a, _b; return ((_a = curr.player1) === null || _a === void 0 ? void 0 : _a.socket) === socket || ((_b = curr.player2) === null || _b === void 0 ? void 0 : _b.socket) === socket; });
                    console.log({ game });
                    game === null || game === void 0 ? void 0 : game.makeMove(socket, message.move);
                    break;
                }
            }
        });
    }
}
exports.GameManager = GameManager;

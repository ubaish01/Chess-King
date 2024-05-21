"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var messages_1 = require("./messages");
var Game_1 = require("./Game");
var GameManager = /** @class */ (function () {
    function GameManager() {
        this.pendingUser = null;
        this.games = [];
        this.users = [];
    }
    GameManager.prototype.addUser = function (socket) {
        console.log("User connected");
        this.users.push(socket);
        this.addHandler(socket);
    };
    GameManager.prototype.removeUser = function (socket) {
        console.log("Here is am");
        this.users = this.users.filter(function (user) { return user != socket; });
    };
    GameManager.prototype.addHandler = function (socket) {
        var _this = this;
        socket.on("message", function (data) {
            var message = JSON.parse(data.toString());
            console.log("Below is the message");
            console.log("message");
            console.log("above is the message");
            if (message.type === messages_1.INIT_GAME) {
                console.log("Game started!");
                if (_this.pendingUser) {
                    //start the game
                    var game = new Game_1.Game(_this.pendingUser, {
                        name: message.name,
                        type: "b",
                        socket: socket,
                        waiting: false,
                    });
                    _this.games.push(game);
                    _this.pendingUser = null;
                }
                else {
                    _this.pendingUser = {
                        name: message.name,
                        socket: socket,
                        type: "w",
                        waiting: true,
                    };
                }
            }
            else if (message.type === messages_1.MOVE) {
                console.log(message);
                var game = _this.games.find(function (curr) { var _a, _b; return ((_a = curr.player1) === null || _a === void 0 ? void 0 : _a.socket) === socket || ((_b = curr.player2) === null || _b === void 0 ? void 0 : _b.socket) === socket; });
                console.log("Game found below");
                // console.log(game);
                console.log("Game found above");
                game === null || game === void 0 ? void 0 : game.makeMove(socket, message.move);
            }
        });
    };
    return GameManager;
}());
exports.GameManager = GameManager;

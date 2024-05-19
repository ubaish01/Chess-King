import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game, userType } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: userType;
  private users: WebSocket[];

  constructor() {
    this.pendingUser = null;
    this.games = [];
    this.users = [];
  }

  public addUser(socket: WebSocket) {
    console.log("User connected");
    this.users.push(socket);
    this.addHandler(socket);
  }

  public removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user != socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log(message);
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          //start the game

          const game = new Game(this.pendingUser, {
            name: message.name,
            type: "b",
            socket,
            waiting: false,
          });
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = {
            name: message.name,
            socket: socket,
            type: "w",
            waiting: true,
          };
        }
      } else if (message.type === MOVE) {
        console.log(message);
        const game = this.games.find(
          (curr) =>
            curr.player1?.socket === socket || curr.player2?.socket === socket
        );
        if (game) console.log("game found");
        game?.makeMove(socket, message.move);
      }
    });
  }
}

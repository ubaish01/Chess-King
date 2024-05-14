import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.pendingUser = null;
    this.games = [];
    this.users = [];
  }

  public addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  public removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user != socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          //start the game
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      } else if (message.type === MOVE) {
        const game = this.games.find(
          (curr) => curr.player1 === socket || curr.player2 === socket
        );
        if (game) console.log("game found");
        game?.makeMove(socket, message.move);
      }
    });
  }
}

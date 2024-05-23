import { WebSocket } from "ws";
import { INIT_GAME, MOVE, OFFER_ACCEPTED } from "./messages";
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
    this.users.push(socket);
    this.addHandler(socket);
  }

  public removeUser(socket: WebSocket) {
    console.log("Here is am");
    this.users = this.users.filter((user) => user != socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log(message);

      switch (message.type) {
        case INIT_GAME: {
          if (this.pendingUser) {
            // same user should not connect with himself
            if (this.pendingUser.socket == socket) {
              socket.send("Please wait we are finding your oppenent");
              return;
            }

            //start the game
            this.pendingUser.waiting = false;
            const game = new Game(this.pendingUser, {
              name: message.name,
              type: "b",
              socket,
              waiting: false,
              offer: null,
            });
            this.games.push(game);
            this.pendingUser = null;
          } else {
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
        case OFFER_ACCEPTED: {
          const ans = message.ans;
          const game = this.games.find(
            (curr) =>
              curr.player1?.socket === socket || curr.player2?.socket === socket
          );

          const oppenent =
            game?.player1?.socket === socket ? game?.player2 : game?.player1;

          oppenent?.socket?.send(
            JSON.stringify({
              type: OFFER_ACCEPTED,
              ans,
            })
          );

          break;
        }
        case MOVE: {
          console.log(message);
          const game = this.games.find(
            (curr) =>
              curr.player1?.socket === socket || curr.player2?.socket === socket
          );
          console.log({ game });
          game?.makeMove(socket, message.move);
          break;
        }
      }
    });
  }
}

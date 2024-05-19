import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export type userType = {
  name: string;
  type: "b" | "w";
  waiting: true | false;
  id?: string;
  socket: WebSocket;
} | null;

export class Game {
  public player1: userType;
  public player2: userType;
  private board: Chess;
  private movesCount: number;
  private startTime: Date;

  constructor(player1: userType, player2: userType) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.movesCount = 0;
    this.startTime = new Date();
    this.player1?.socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          type: "w",
          opponent: player2?.name,
        },
      })
    );
    this.player2?.socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          type: "b",
          opponent: player1?.name,
        },
      })
    );
  }

  makeMove = (socket: WebSocket, move: { from: string; to: string }) => {
    if (this.movesCount % 2 == 0 && socket != this.player1?.socket) {
      console.log("early return 1");
      return;
    }
    if (this.movesCount % 2 == 1 && socket != this.player2?.socket) {
      console.log("early return 2");
      return;
    }

    try {
      this.board.move(move);
    } catch (error) {
      console.log(error);
      return;
    }

    if (this.board.isGameOver()) {
      this.player1?.socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );

      this.player2?.socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    if (this.movesCount % 2 === 0) {
      this.player2?.socket.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1?.socket.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
    this.movesCount++;
  };
}

import { useEffect, useState } from "react";
import Chessboard from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const GAME_OVER = "game_over";
export const MOVE = "move";

const chess = new Chess();

const Game = () => {
  const socket = useSocket();
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          console.log("Game initialized");
          break;
        case MOVE:
          chess.move(message.payload);
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          console.log("Game Over");
          break;
        default:
          console.log("Invalid case");
      }
    };
  }, [socket]);

  if (!socket) return <div>Loading...</div>;

  return (
    <div className="w-screen grid grid-cols-12 px-24 py-12 bg-slate-950 h-screen ">
      <div className="col-span-6 flex items-center justify-center ">
        <Chessboard
          board={board}
          socket={socket}
          chess={chess}
          setBoard={setBoard}
        />
      </div>
      <div className="col-span-6 flex items-center justify-center   ">
        <button
          onClick={() => {
            socket.send(JSON.stringify({ type: INIT_GAME }));
            console.log("Init game");
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Game;

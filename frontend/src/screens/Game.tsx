import { useEffect, useState } from "react";
import Chessboard from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import clsx from "clsx";

export const INIT_GAME = "init_game";
export const GAME_OVER = "game_over";
export const MOVE = "move";

export type opponentType = {
  name: string;
  type: string;
  id?: string;
  socket?: WebSocket;
} | null;

const chess = new Chess();

const Game = () => {
  const socket = useSocket();
  const [board, setBoard] = useState(chess.board());
  const [name, setName] = useState("");
  const [opponent, setOpponent] = useState<opponentType>(null);
  const [waiting, setWaiting] = useState(false);
  // const [type, setType] = useState<"w" | "b">("w");
  const [movesCount, setMovesCount] = useState(0);

  const increamentMovesCount = () => {
    setMovesCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          console.log(message);
          setWaiting(false);
          setOpponent(message.payload.opponent);
          console.log("Game initialized");
          break;
        case MOVE:
          chess.move(message.payload);
          setBoard(chess.board());
          console.log("Move made");
          increamentMovesCount();
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
    <div className="w-screen grid md:grid-cols-12 grid-cols-6 px-24 py-12 bg-slate-950 h-fit space-y-8 ">
      <div className="col-span-6 flex items-center justify-center ">
        <Chessboard
          board={board}
          socket={socket}
          chess={chess}
          setBoard={setBoard}
          increaseMoveCount={increamentMovesCount}
          opponent={opponent}
        />
      </div>
      {opponent ? (
        <div className="col-span-6 flex items-center justify-center text-2xl flex-col">
          <div>Game Connected</div>
          <div className=" flex items-center justify-center gap-2 mt-4">
            You are playing against{" "}
            <span className="text-purple-500 font-medium">
              {opponent?.name || ""}
            </span>
            ({opponent.type === "w" ? "White" : "Black"})
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">Turn: </span>
            <span className="text-xl text-purple-500 font-medium">
              {movesCount % 2 === 0 ? "White" : "Black"}
            </span>
          </div>
        </div>
      ) : waiting ? (
        <div className="col-span-6 flex items-center justify-center text-2xl">
          Finding oppenent...
        </div>
      ) : (
        <div className="col-span-6 flex items-center justify-center flex-col gap-2 ">
          <input
            type="text"
            placeholder="Enter your name to start"
            className="w-80 h-12 flex px-4 rounded-md"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button
            className={clsx(
              !name
                ? "cursor-not-allowed hover:outline-none"
                : "cursor-pointer hover:border-2",
              "border-0"
            )}
            disabled={!name}
            onClick={() => {
              setWaiting(true);
              socket.send(JSON.stringify({ type: INIT_GAME, name }));
              console.log("Init game");
            }}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;

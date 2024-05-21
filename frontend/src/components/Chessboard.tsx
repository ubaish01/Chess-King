import { Chess, Color, PieceSymbol, Square } from "chess.js";
import clsx from "clsx";
import { useState } from "react";
import { MOVE, opponentType } from "../screens/Game";
import { Pieces } from "../helper/Pieces";

type SquareType = {
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null;

const Chessboard = ({
  chess,
  setBoard,
  board,
  socket,
  increaseMoveCount,
  opponent,
}: {
  setBoard: any;
  chess: Chess;
  board: SquareType[][];
  socket: WebSocket;
  increaseMoveCount: () => void;
  opponent: opponentType;
}) => {
  const [from, setFrom] = useState<string | null>(null);
  const [possibleTargets, setPossibleTargets] = useState<string[]>([]);

  const isATarget = (i: number, j: number) => {
    const square = String.fromCharCode(97 + j) + "" + (8 - i);
    if (possibleTargets.includes(square)) return true;
    return false;
  };

  const isAttacked = () => {
    const issfds = chess.isAttacked("a1", "b");
  };

  const handleMove = (i: number, j: number) => {
    if (!opponent) {
      alert("Please type your name and start the game");
      return;
    }
    const square = String.fromCharCode(97 + j) + "" + (8 - i);
    const targets = chess
      .moves({ square: JSON.parse(JSON.stringify(square)), verbose: true })
      .map((move: any) => {
        return move?.to;
      });

    console.log(targets);
    try {
      if (!from) {
        setPossibleTargets(targets);
        setFrom(square);
      } else {
        socket?.send(
          JSON.stringify({
            type: MOVE,
            move: {
              from: from,
              to: square,
            },
          })
        );
        chess.move({
          from: from,
          to: square,
        });
        increaseMoveCount();
        setBoard(chess.board());
        setFrom(null);
        setPossibleTargets([]);
      }
    } catch (error: any) {
      console.log("Should pint error right below this");
      console.error(error.message);
      setFrom(square);
      setPossibleTargets(targets);
    }
  };

  return (
    <div className="w-full">
      {board?.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row?.map((square, j) => {
              return (
                <div
                  onClick={() => {
                    handleMove(i, j);
                  }}
                  key={j}
                  className={clsx(
                    (i + j) % 2 == 1 ? "bg-green-700" : "bg-green-400",
                    "w-20 h-20 relative flex items-center justify-center text-3xl cursor-pointer text-white"
                  )}
                >
                  {isATarget(i, j) && (
                    <div className="w-8 h-8 bg-black rounded-full opacity-90 absolute" />
                  )}

                  {isATarget(i, j) && square?.type && (
                    <div className="w-full h-full bg-red-500  opacity-90 absolute z-0" />
                  )}
                  {square?.type && (
                    <img
                      className="z-10"
                      src={Pieces[`${square?.type}${square?.color}`]}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Chessboard;

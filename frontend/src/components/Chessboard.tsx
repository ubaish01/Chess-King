import { Chess, Color, PieceSymbol, Square } from "chess.js";
import clsx from "clsx";
import { useState } from "react";
import { MOVE } from "../screens/Game";
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
}: {
  setBoard: any;
  chess: Chess;
  board: SquareType[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<string | null>(null);

  const handleMove = (i: number, j: number) => {
    const square = String.fromCharCode(97 + j) + "" + (8 - i);
    if (!from) {
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
      setBoard(chess.board());
      setFrom(null);
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
                    "w-20 h-20 flex items-center justify-center text-3xl cursor-pointer text-white"
                  )}
                >
                  {square?.type && (
                    <img src={Pieces[`${square?.type}${square?.color}`]} />
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

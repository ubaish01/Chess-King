import { useCallback, useEffect, useState } from "react";
import Chessboard from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import clsx from "clsx";
import peer from "../service/peer";
import ReactPlayer from "react-player";

export const INIT_GAME = "init_game";
export const GAME_OVER = "game_over";
export const MOVE = "move";
export const OFFER_ACCEPTED = "offer_accepted";
export const ACCEPT_CALL = "accept_call";
export const CALL_ACCEPTED = "call_accepted";

export type opponentType = {
  name: string;
  type: string;
  id?: string;
  socket?: WebSocket;
} | null;

type StreamType = MediaStream | null;

const chess = new Chess();

const Game = () => {
  const socket = useSocket();
  const [board, setBoard] = useState(chess.board());
  const [name, setName] = useState("");
  const [opponent, setOpponent] = useState<opponentType>(null);
  const [waiting, setWaiting] = useState(false);
  // const [type, setType] = useState<"w" | "b">("w");
  const [movesCount, setMovesCount] = useState(0);

  const [myStream, setMyStream] = useState<StreamType>(null);
  const [remoteStream, setRemoteStream] = useState<StreamType>(null);

  const increamentMovesCount = () => {
    setMovesCount((prev) => prev + 1);
  };

  const startGame = async () => {
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });
    // setMyStream(stream);
    const offer = await peer.getOffer();
    console.log({ offer });

    console.log(`starting game for : ${name}`);
    setWaiting(true);
    socket?.send(
      JSON.stringify({ type: INIT_GAME, name, offer: offer || "Offer is null" })
    );
    console.log("Init game");
  };

  const handleInitGame = async (message: any) => {
    setBoard(chess.board());
    console.log("Game started");
    console.log(message);
    setWaiting(false);
    setOpponent(message.payload.opponent);

    if (message.offer) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const ans = await peer.getAnswer(message.offer);
      setMyStream(stream);
      // sending the offer to opponent
      socket?.send(
        JSON.stringify({
          type: OFFER_ACCEPTED,
          ans,
        })
      );
    }

    console.log("Game initialized");
  };

  const handleIncomingMove = (message: any) => {
    chess.move(message.payload);
    setBoard(chess.board());
    console.log("Move made");
    increamentMovesCount();
  };

  const sendStreams = () => {
    if (myStream) {
      for (const track of myStream?.getTracks()) {
        peer?.peer?.addTrack(track, myStream);
      }
    }
  };

  const handleOfferAccepted = async (message: any) => {
    peer.setLocalDescription(message.ans);
    console.log("Offer acceped");
    sendStreams();
  };

  const handleNegoNeeded = async () => {
    console.log("Negotiate krle bhai, fyede me rhgea");
  };

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          handleInitGame(message);
          break;
        case OFFER_ACCEPTED:
          handleOfferAccepted(message);
          break;
        case MOVE:
          handleIncomingMove(message);
          break;
        case GAME_OVER:
          console.log("Game Over");
          break;
          break;
        default:
          console.log("Invalid case");
      }
    };
  }, [socket]);

  useEffect(() => {
    peer?.peer?.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer?.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);
  useEffect(() => {
    peer?.peer?.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  if (!socket) return <div>Loading...</div>;

  return (
    <div className="w-screen grid md:grid-cols-12 grid-cols-6 px-24 py-12 bg-slate-950 h-fit space-y-8 ">
      <div className="col-span-6 flex items-center justify-center ">
        {/*
        {myStream && (
          <>
            <h1>My Stream</h1>
            <ReactPlayer
              playing
              muted
              height="100px"
              width="200px"
              url={myStream}
            />
          </>
        )}
        {remoteStream && (
          <>
            <h1>Remote Stream</h1>
            <ReactPlayer
              playing
              muted
              height="100px"
              width="200px"
              url={remoteStream}
            />
          </>
        )}
       */}
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
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;

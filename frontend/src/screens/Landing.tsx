import { useNavigate } from "react-router-dom";

const chessImg =
  "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen p-16 flex items-center justify-center ">
      <div className="w-[48rem]  rounded-md overflow-hidden relative">
        <img className="w-full hover:scale-105 h-full" src={chessImg} alt="" />
        <div className="w-[24rem] h-full absolute  top-0 right-0 flex flex-col items-center justify-center gap-4">
          <div className="bg-black absolute opacity-95 w-full h-full top-0 right-0"></div>

          <div className="z-20 w-full px-4">
            <div className="text-5xl mb-4 text-white font-medium">
              <span>Chess</span>
              <span className="text-amber-500">Kings</span>
            </div>

            <div>#1 Online multiplayer chess game with video calls</div>

            <div className="w-full my-4 flex gap-2 items-center justify-between px-4">
              <div className=" border px-2 hover:border-amber-500  cursor-default rounded-md bg-slate-950 border-slate-950  py-1">
                200 games ongoing
              </div>
              <div className=" border px-2 hover:border-amber-500  cursor-default rounded-md bg-slate-950 border-slate-950  py-1">
                1024 people online
              </div>
            </div>
            <div className="w-full  flex items-center justify-center">
              <button
                onClick={() => {
                  navigate("/game");
                }}
                className="w-3/4 hover:border-amber-500 focus:border-amber-500 "
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

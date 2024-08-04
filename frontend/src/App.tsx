import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./screens/Landing";
import Game from "./screens/Game";

function App() {
  return (
    <div>
      <div className="md:flex hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div className="flex md:hidden flex-col font-bold  items-center justify-center text-2xl px-2 h-screen w-screen text-center">
        <div>Note : Please use this in computer.</div>
        <div className="text-base font-medium">
          Sorry for the inconvenience you are facing but we're not responsive
          yet for mobile or small screen devices. Please use a large screen
          device to use the app.
        </div>
        <div className="text-xl">Thanks for visiting.</div>
      </div>
    </div>
  );
}

export default App;

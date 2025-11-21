import { Route, Routes } from "react-router";
import Main from "./components/main";
import "./App.css";

export default function App() {
  return (
    <div className="max-h-screen ">
      <div className="m-2 border-2 border-white/20 rounded-lg shadow-md h-full">
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </div>
    </div>
  );
}

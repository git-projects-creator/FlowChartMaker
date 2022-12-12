import Palette from "./Palette";
import Canva from "./Canva";
import "./styles.css";
import ArrowState from "./context/ArrowState";

export default function App() {
  return (
    <ArrowState>
      <div className="app">
        <Palette />
        <Canva />
      </div>
    </ArrowState>
  );
}

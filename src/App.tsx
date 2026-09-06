import { useReducer } from "react";
import { createInitialState, gameReducer } from "./game/state";
import {
  BoardroomScene,
  FactoryScene,
  HomeScene,
  LandfillScene,
  StoreScene,
  ThriftScene,
} from "./Scenes";

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  return (
    <div className="game-root">
      <div className="hud">
        <span>Price: ${state.price.toFixed(2)}</span>
        <span>Hidden cost: ${state.hiddenCost.toFixed(2)}</span>
      </div>

      {state.scene === "boardroom" && <BoardroomScene state={state} dispatch={dispatch} />}
      {state.scene === "factory" && <FactoryScene state={state} dispatch={dispatch} />}
      {state.scene === "store" && <StoreScene state={state} dispatch={dispatch} />}
      {state.scene === "thrift" && <ThriftScene state={state} dispatch={dispatch} />}
      {state.scene === "home" && <HomeScene state={state} dispatch={dispatch} />}
      {state.scene === "landfill" && <LandfillScene state={state} dispatch={dispatch} />}
    </div>
  );
}

export default App;

import { useState } from "react";
import type { Dispatch } from "react";
import { WorldCanvas } from "./components/WorldCanvas";
import { ClickTimingGame } from "./minigames/ClickTimingGame";
import { FindItemGame } from "./minigames/FindItemGame";
import type { GameAction, GameState } from "./game/types";

interface SceneProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function BoardroomScene({ dispatch }: SceneProps) {
  return (
    <>
      <WorldCanvas world="boardroom" />
      <div className="overlay-panel">
        <h2>The Boardroom</h2>
        <p>Choose the fabric this shirt will be made from.</p>
        <div className="button-row">
          <button onClick={() => dispatch({ type: "CHOOSE_MATERIAL", material: "cotton" })}>
            Cotton
          </button>
          <button onClick={() => dispatch({ type: "CHOOSE_MATERIAL", material: "polyester" })}>
            Polyester
          </button>
        </div>
      </div>
    </>
  );
}

export function FactoryScene({ dispatch }: SceneProps) {
  return (
    <>
      <WorldCanvas world="factory" showShirt shirtY={0.8} shirtZ={-1.5} />
      <ClickTimingGame
        title="The Factory"
        instructions="Click when the marker crosses the center zone to sew each piece cleanly."
        rounds={5}
        onComplete={(misses) => dispatch({ type: "FACTORY_DONE", misses })}
      />
    </>
  );
}

export function StoreScene({ dispatch }: SceneProps) {
  const [spun, setSpun] = useState(false);

  const handleSpin = () => {
    setSpun(true);
    dispatch({ type: "STORE_RESOLVED" });
  };

  return (
    <>
      <WorldCanvas world="store" showShirt shirtY={1} shirtZ={-1} />
      <div className="overlay-panel">
        <h2>The Store</h2>
        <p>A shopper walks in with a budget between $20 and $30.</p>
        <button onClick={handleSpin} disabled={spun}>
          {spun ? "Spinning…" : "Spin customer budget"}
        </button>
      </div>
    </>
  );
}

export function ThriftScene({ dispatch }: SceneProps) {
  return (
    <>
      <WorldCanvas world="resale" showShirt shirtY={1} shirtZ={-1} />
      <FindItemGame
        title="Thrift Store"
        instructions="Find the shirt on the rack before time runs out."
        seconds={30}
        tileCount={12}
        onComplete={(found) =>
          dispatch({ type: found ? "THRIFT_FOUND" : "THRIFT_NOT_FOUND" })
        }
      />
    </>
  );
}

export function HomeScene({ dispatch }: SceneProps) {
  const [phase, setPhase] = useState<"arrival" | "reselling">("arrival");

  return (
    <>
      <WorldCanvas world="home" showShirt shirtY={1} shirtZ={-1} />
      {phase === "arrival" && (
        <div className="overlay-panel">
          <h2>Home</h2>
          <p>The shirt has a new owner. Eventually, they decide to resell it.</p>
          <button onClick={() => setPhase("reselling")}>List it on Depop</button>
        </div>
      )}
      {phase === "reselling" && (
        <ClickTimingGame
          title="Listing on Depop"
          instructions="Click when the marker crosses the center zone to crop each photo well."
          rounds={3}
          onComplete={(misses) => dispatch({ type: "RESELL_DONE", misses })}
        />
      )}
    </>
  );
}

export function LandfillScene({ state, dispatch }: SceneProps) {
  return (
    <>
      <WorldCanvas world="landfill" showShirt shirtY={0.3} shirtZ={-1} />
      <div className="overlay-panel">
        <h2>The Landfill</h2>
        <p>
          Day and night, rain and thunder — the shirt breaks down over{" "}
          {state.decomposeYears} years.
        </p>
        <ul className="stats-list">
          <li>Final price: ${state.price.toFixed(2)}</li>
          <li>Hidden cost accumulated: ${state.hiddenCost.toFixed(2)}</li>
          <li>Times resold or re-shelved: {state.cycles}</li>
          <li>Material: {state.material}</li>
        </ul>
        <button onClick={() => dispatch({ type: "RESTART" })}>Play again</button>
      </div>
    </>
  );
}

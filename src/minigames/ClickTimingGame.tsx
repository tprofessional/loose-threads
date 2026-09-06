import { useEffect, useRef, useState } from "react";

interface ClickTimingGameProps {
  title: string;
  instructions: string;
  rounds: number;
  onComplete: (misses: number) => void;
}

const PERIOD_MS = 1400;
const HIT_ZONE_MIN = 40;
const HIT_ZONE_MAX = 60;

export function ClickTimingGame({
  title,
  instructions,
  rounds,
  onComplete,
}: ClickTimingGameProps) {
  const [round, setRound] = useState(0);
  const [misses, setMisses] = useState(0);
  const [markerPercent, setMarkerPercent] = useState(0);
  const startRef = useRef(performance.now());
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const phase = (elapsed % PERIOD_MS) / PERIOD_MS;
      const triangle = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      setMarkerPercent(triangle * 100);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const handleClick = () => {
    const isHit = markerPercent >= HIT_ZONE_MIN && markerPercent <= HIT_ZONE_MAX;
    const nextMisses = isHit ? misses : misses + 1;
    const nextRound = round + 1;
    setMisses(nextMisses);
    if (nextRound >= rounds) {
      onComplete(nextMisses);
    } else {
      setRound(nextRound);
    }
  };

  return (
    <div className="minigame-panel">
      <h2>{title}</h2>
      <p>{instructions}</p>
      <p>
        Round {round + 1} / {rounds}
      </p>
      <div className="timing-track">
        <div className="timing-hit-zone" />
        <div
          className="timing-marker"
          style={{ left: `${markerPercent}%` }}
        />
      </div>
      <button onClick={handleClick}>Click!</button>
      <p>Misses so far: {misses}</p>
    </div>
  );
}

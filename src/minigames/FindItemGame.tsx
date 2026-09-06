import { useEffect, useMemo, useState } from "react";

interface FindItemGameProps {
  title: string;
  instructions: string;
  seconds: number;
  tileCount: number;
  onComplete: (found: boolean) => void;
}

export function FindItemGame({
  title,
  instructions,
  seconds,
  tileCount,
  onComplete,
}: FindItemGameProps) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [resolved, setResolved] = useState(false);
  const shirtIndex = useMemo(
    () => Math.floor(Math.random() * tileCount),
    [tileCount],
  );

  useEffect(() => {
    if (resolved) return;
    if (secondsLeft <= 0) {
      setResolved(true);
      onComplete(false);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, resolved, onComplete]);

  const handleTileClick = (index: number) => {
    if (resolved) return;
    if (index === shirtIndex) {
      setResolved(true);
      onComplete(true);
    }
  };

  return (
    <div className="minigame-panel">
      <h2>{title}</h2>
      <p>{instructions}</p>
      <p>Time left: {secondsLeft}s</p>
      <div className="find-item-grid">
        {Array.from({ length: tileCount }, (_, index) => (
          <button
            key={index}
            className="find-item-tile"
            onClick={() => handleTileClick(index)}
          >
            {resolved && index === shirtIndex ? "👕" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

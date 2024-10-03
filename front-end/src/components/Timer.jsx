/* eslint-disable react/prop-types */
import { useEffect } from "react";

const Timer = ({ seconds, setSeconds }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup interval on component unmount or when gameOver changes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
      <p>Elapsed Time: {seconds}s</p>
    </div>
  );
};

export default Timer;

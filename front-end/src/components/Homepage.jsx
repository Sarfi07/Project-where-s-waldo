import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Homepage = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/game"); // Navigate to the Gamepage component
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center h-screen bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white">
        <h1 className="text-4xl font-bold mb-8">Welcome to the Game!</h1>
        <button
          onClick={handleStartGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Game
        </button>
      </div>
    </>
  );
};

export default Homepage;

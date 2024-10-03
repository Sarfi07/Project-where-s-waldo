import ModalForm from "./ModelForm";

/* eslint-disable react/prop-types */
const Gameover = ({ onRestart, score, isModelOpen, setModelOpen }) => {
  if (isModelOpen) {
    return <ModalForm isOpen={isModelOpen} setModelOpen={setModelOpen} />;
  }
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white z-50">
      <h1 className="text-4xl mb-4">Game Over!</h1>
      <p className="mb-8">
        Congratulations! You found all the characters in {score} seconds
      </p>
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-800"
      >
        Restart Game
      </button>
    </div>
  );
};

export default Gameover;

// this component will show the time user has taken and all the highest scorer of the game

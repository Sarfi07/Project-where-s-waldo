import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ItemList from "./ItemList";
import Gameover from "./GameOver";
import Timer from "./Timer";

// mark the image cooridnates permanently if user selects correctly;

const Gamepage = () => {
  const [marker, setMarker] = useState(null);
  const [result, setResult] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [foundItems, setFoundItems] = useState([]);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [gameOver, setGameover] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [images, setImages] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [isHighestScore, setIsHighestScore] = useState(false);
  const [isModelOpen, setModelOpen] = useState(false);

  // get the image url
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/`);
        if (!response.ok) throw new Error("Failed to Load images");
        const data = await response.json();
        setImages(data);
        // temp
        setCurrentImage(data[0]);

        const foo = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/image/${data[0].id}/characters`
        );

        if (!foo.ok) throw new Error("Failed to load characters");

        const characters = await foo.json();
        setItems(Array.isArray(characters) ? characters : []);

        // create a player session;

        const luserId = localStorage.getItem("userId");

        if (!luserId) {
          const userSession = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/create_user_session`
          );

          if (!userSession.ok)
            throw new Error(`Response Status: ${userSession.status}`);

          const json = await userSession.json();
          localStorage.setItem("userId", json.id);

          // start timer
          const startTimerFetch = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/start-timer`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Specify the content type
              },
              body: JSON.stringify({
                userId: json.id, // Serialize the body as JSON
              }),
            }
          );

          const foo = await startTimerFetch.json();

          console.log(foo.message);
        } else {
          // start timer
          const startTimerFetch = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/start-timer`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Specify the content type
              },
              body: JSON.stringify({
                userId: luserId, // Serialize the body as JSON
              }),
            }
          );

          const foo = await startTimerFetch.json();

          console.log(foo.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    initializeGame();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  });

  const handleImageClick = (e) => {
    // Get the bounding rectangle of the image
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // X coordinate relative to the image
    const y = e.clientY - rect.top; // Y coordinate relative to the image

    // Set the marker to the clicked position if within image bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setMarker({ x, y });
      setDropdownPosition({ x: x + 64, y });
      setDropdownVisible(true);
    }
  };

  const checkMarking = async (pos, character) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/check/${character.id}/${pos.x}/${
          pos.y
        }`
      );

      if (!response.ok)
        throw new Error("Failed to check coordinates with the backend");

      const data = await response.json();
      if (data.found) {
        setResult("You got " + character.name);

        if (!foundItems.includes(character.id)) {
          setFoundItems((prevfoundItems) => {
            const updatedFoundItems = [...prevfoundItems, character.id];
            if (foundItems.length === 3) {
              const userId = localStorage.getItem("userId");

              fetch(`${import.meta.env.VITE_BACKEND_URL}/end-timer`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId,
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  setTimeElapsed(data.elapsedTime);
                  console.log(data); // debugging
                  if (data.highestScore > data.elapsedTime) {
                    setIsHighestScore(true);
                    console.log(isHighestScore);
                    console.log("Setting model open");
                    setModelOpen(true);
                  } else {
                    setIsHighestScore(false);
                  }
                });
              setGameover(true);
            }
            return updatedFoundItems;
          });
        }
      } else setResult(null);
    } catch (err) {
      return new Error(err);
    }
  };

  const handleTimeEnd = (seconds) => {
    setTimeElapsed(seconds);
  };

  if (gameOver) {
    async () => {
      handleTimeEnd(seconds);

      if (isHighestScore) {
        console.log("highest score till now");
      }
    };
  }

  const handleClickOutside = () => {
    // Remove the marker when clicking outside the image
    setMarker(null);
    setDropdownVisible(false);
  };

  const resStartGame = async () => {
    // Reset Game state
    setGameover(false);
    setMarker(null);
    setFoundItems([]);
    setDropdownPosition({ x: 0, y: 0 });
    setResult(null);
    setTimeElapsed(0);
    setSeconds(0);

    const luserId = localStorage.getItem("userId");
    // start timer
    const startTimerFetch = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/start-timer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify({
          userId: luserId, // Serialize the body as JSON
        }),
      }
    );
    const foo = await startTimerFetch.json();

    console.log(foo.message);
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading post details...</p>;

  return (
    <>
      <Navbar />

      {/* {marker && (
        <p>
          x: {marker.x}, y: {marker.y}
        </p>
      )} */}

      {items && Array.isArray(items) && items.length > 0 && (
        <ItemList items={items} foundItems={foundItems} result={result} />
      )}

      <div
        className={`${
          gameOver ? "blur-sm" : ""
        } gamepageC flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white`}
        onClick={handleClickOutside} // Click anywhere outside to remove the marker
        style={{ height: "65vh" }}
      >
        <div className="relative">
          {/* Display the Timer */}
          {!gameOver && !setLoading && (
            <div className="absolute top-4 right-4">
              <Timer
                seconds={seconds}
                setSeconds={setSeconds}
                gameOver={gameOver}
                onTimeEnd={handleTimeEnd}
              />
            </div>
          )}

          {images && images.length > 0 && (
            <img
              src={currentImage.cloud_url}
              alt="Game Image"
              className={
                screenSize.width > 400
                  ? "w-[480px] h-[480px] m-8"
                  : "w-[160px] h-[160px] "
              }
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering outside click
                handleImageClick(e);
              }}
            />
          )}

          {marker && (
            <div
              className="absolute bg-red-500 rounded-full w-4 h-4"
              style={{
                top: `${marker.y + 24}px`, // Place marker inside the image
                left: `${marker.x + 24}px`,
              }}
            >
              {" "}
            </div>
          )}

          {dropdownVisible && (
            <div
              className="absolute bg-white text-black border border-gray-300 rounded shadow-lg"
              style={{
                top: `${dropdownPosition.y}px`,
                left: `${dropdownPosition.x}px`,
                zIndex: 10,
              }}
            >
              <ul className="list-none p-2">
                {Array.isArray(items) &&
                  items.map((item) => (
                    <li
                      key={item.id}
                      className="hover:bg-gray-200 p-1 cursor-pointer"
                      onClick={() => {
                        checkMarking(marker, item);
                        setDropdownVisible(false);
                      }}
                    >
                      {item.name}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {gameOver && (
        <Gameover
          onRestart={resStartGame}
          score={timeElapsed}
          isModelOpen={isModelOpen}
          setModelOpen={setModelOpen}
        />
      )}
    </>
  );
};

export default Gamepage;

import express from "express";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* GET all images. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const images = await prisma.game_Image.findMany();
    res.json(images);
  })
);

router.get(
  "/image/:id/",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const image = await prisma.game_Image.findFirst({
        where: {
          id,
        },
      });

      res.json(image);
    } catch (err) {
      res.json(err);
    }
  })
);

router.get(
  "/image/:imageId/characters",
  asyncHandler(async (req, res) => {
    const { imageId } = req.params;

    try {
      const characters = await prisma.character.findMany({
        select: {
          name: true,
          id: true,
        },
        where: {
          parent_id: imageId,
        },
      });

      res.json(characters);
    } catch (err) {
      res.json(err);
    }
  })
);

router.get(
  "/image/:imageId/characters/:id",
  asyncHandler(async (req, res) => {
    const { imageId, id } = req.params;

    try {
      const character = await prisma.character.findFirst({
        where: {
          id,
        },
      });

      res.json(character);
    } catch (err) {
      res.json(err);
    }
  })
);

router.get(
  "/check/:characterId/:x/:y",
  asyncHandler(async (req, res) => {
    try {
      const { characterId, x, y } = req.params;
      const character = await prisma.character.findFirst({
        where: {
          id: characterId,
        },
      });

      if (
        x >= character.x_s &&
        x <= character.x_e &&
        y >= character.y_s &&
        y <= character.y_e
      )
        res.json({ found: true });
      else res.json({ found: false, name: character.name });
    } catch (err) {
      res.json(err);
    }
  })
);

router.get(
  "/create_user_session",
  asyncHandler(async (req, res) => {
    try {
      const newUser = await prisma.player.create({
        data: {
          id: uuidv4(),
        },
      });
      res.json({ message: "User session created", id: newUser.id });
    } catch (err) {
      res.json(err);
    }
  })
);

router.post(
  "/start-timer",
  asyncHandler(async (req, res) => {
    const userId = req.body.userId;

    try {
      // Check if userId exists and is valid
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Find the player by userId
      const player = await prisma.player.findFirst({
        where: {
          id: userId, // Ensure userId type matches Prisma schema (string or number)
        },
      });

      // If player exists, update the startTime
      if (player) {
        await prisma.player.update({
          where: {
            id: userId,
          },
          data: {
            startTime: new Date(), // Ensure this field is a DateTime in Prisma schema
          },
        });

        // Return success response
        return res.status(201).json({ message: "Timer Started" });
      } else {
        // If player is not found, return 404
        return res.status(404).json({ message: "Player not found" });
      }
    } catch (err) {
      // Handle any server-side errors
      console.error("Error in /start-timer route:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  })
);

router.post(
  "/end-timer",
  asyncHandler(async (req, res) => {
    const userId = req.body.userId;

    try {
      // Find the player by ID
      const player = await prisma.player.findFirst({
        where: {
          id: userId,
        },
      });

      if (player) {
        // Calculate elapsed time (corrected Date.now() usage)
        const elapsedTime =
          (Date.now() - new Date(player.startTime).getTime()) / 1000;

        // Update the player's elapsed time in the database
        await prisma.player.update({
          where: {
            id: userId,
          },
          data: {
            elapsedTime, // Make sure the field name matches your database schema
          },
        });

        const highestScore = await prisma.timing.findMany({
          orderBy: {
            score: "asc",
          },
          take: 1,
        });

        console.log(highestScore);

        const topScore = highestScore.length > 0 ? highestScore[0].score : null;

        // Send the elapsed time as a response
        res.json({
          message: "Timer ended",
          elapsedTime,
          highestScore: topScore,
        });
      } else {
        res.status(404).json({ error: "Player not found" });
      }
    } catch (err) {
      // Send the error message in case of failure
      res.status(500).json({ error: err.message });
    }
  })
);

// check for leading score;
router.get(
  "/highest-score",
  asyncHandler(async (req, res) => {
    try {
      const highest = await prisma.timing.findMany({
        orderBy: {
          score: "asc",
        },
        take: 1,
      });

      if (highest.length) {
        // send only the first one
        res.json(highest[0].score);
      } else {
        res.status(404).json({ message: "Records not found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

router.post(
  "/highest-score",
  asyncHandler(async (req, res) => {
    const { userId, name } = req.body;

    // look for user and his elapsed time and set a timing record in db

    try {
      const player = await prisma.player.findFirst({
        where: {
          id: userId,
        },
      });

      if (player) {
        // create a new timing
        const newTiming = await prisma.timing.create({
          data: {
            player_id: player.id,
            name,
            score: player.elapsedTime,
          },
        });

        res.json({ message: "Score set successfully", player });
      } else {
        res.status(401).json({ message: "Failed to post score" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

export default router;

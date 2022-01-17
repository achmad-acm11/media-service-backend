const express = require("express");
const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const router = express.Router();
const { Media } = require("../models");
const {
  apiResponse,
  apiResponseBadRequest,
  apiResponseNotFound,
} = require("../responses/apiResponse");
const { HOSTNAME } = process.env;

/* Routes Media listing. */
router.get("/", async (req, res, next) => {
  try {
    const media = await Media.findAll({
      attributes: ["id", "image"],
    });

    const mapMedia = media.map((item) => {
      item.image = `${HOSTNAME}${item.image}`;
      return item;
    });

    const response = apiResponse("Success Get Media", "success", 200, mapMedia);
    return res.sendStatus(200, "application/json", response);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!isBase64(image, { mimeRequired: true })) {
      const response = apiResponseBadRequest({
        message: "Invalid base64",
      });
      return res.sendStatus(400, "application/json", response);
    }

    base64Img.img(
      image,
      "./public/images",
      Date.now(),
      async (err, filePath) => {
        if (err) {
          const response = apiResponseBadRequest({
            message: err.message,
          });
          return res.sendStatus(400, "application/json", response);
        }

        const fileName = filePath.split("/").pop();

        const media = await Media.create({
          image: `images/${fileName}`,
        });

        const response = apiResponse("Add image success", "status", 200, {
          id: media.id,
          image: `${HOSTNAME}${media.image}`,
        });

        return res.sendStatus(200, "application/json", response);
      }
    );
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const media = await Media.findByPk(id);

    if (!media) {
      return res.sendStatus(
        404,
        "application/json",
        apiResponseNotFound({
          message: "Image not found",
        })
      );
    }

    await media.destroy();

    const response = apiResponse("Delete image success", "success", 200, {
      message: "Image deleted",
    });
    return res.sendStatus(200, "application/json", response);
  } catch (error) {
    next(error);
  }
});
module.exports = router;

import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/search/:city",
  param("City")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City must be a valid string"),
    RestaurantController.searchRestaurants 
);

export default router;

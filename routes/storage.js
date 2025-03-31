const express = require("express")
const UserRouter = express.Router();
const uploadMiddleware = require("../utils/handleStorage")
const {  createItem } = require("../controllers/storage")


/**
 * Crear Item
 */
UserRouter.patch("/", uploadMiddleware.single("image"), createItem)


module.exports = UserRouter;
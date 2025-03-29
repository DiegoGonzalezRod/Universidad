const storageModel  = require('../models/storage')
const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require('express-validator')
const fs = require("fs")

const PUBLIC_URL = process.env.PUBLIC_URL
const MEDIA_PATH = __dirname + "/../storage"


/**
 * Inserta un registro
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    try {
        const { body, file } = req
        const fileData = { 
            filename: file.filename,
            url: process.env.PUBLIC_URL+"/"+file.filename
        }
        const data = await storageModel.create(fileData)
        res.send(data)
    }catch(err) {
        handleHttpError(res, "ERROR_DETAIL_ITEM")
    }
}


module.exports = {  createItem };
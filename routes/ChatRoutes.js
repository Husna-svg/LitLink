const express = require('express');
const router = express.Router();

const { createChat, getChats } = require('../Controllers/ChatController');
const validateTokenHandler = require('../middleware/validateTokenHandler');

router.route('/createChat/:id').post(validateTokenHandler,createChat);
router.route('/getChats').get(validateTokenHandler,getChats);
//router.route('/getChats').get(validateTokenHandler,getChats);
module.exports = router;
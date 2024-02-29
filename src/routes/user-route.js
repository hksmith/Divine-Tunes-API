const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getUserWithFavMusic);
router.post('/:id/like/:musicId', userController.likeMusic);
router.delete('/:id/dislike/:musicId', userController.dislikeMusic);

module.exports = router;

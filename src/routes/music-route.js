const express = require("express");
const router = express.Router();
const musicController = require("../controllers/musicController");
const upload = require("../middleware/multer");

router.get("/", musicController.getAllMusic);
router.get("/:id", musicController.getMusic);
router.post("/", upload.fields([{name: 'audio', maxCount: 1 }, {name: 'image', maxCount: 1 }]), musicController.addMusic);
router.put("/:id", upload.fields([{name: 'audio', maxCount: 1 }, {name: 'image', maxCount: 1 }]), musicController.updateMusic);
router.delete("/:id", musicController.deleteMusic);

module.exports = router;

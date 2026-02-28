const express = require("express");
const router = express.Router();

const capsuleController =
 require("../controllers/capsuleController");

const authMiddleware =
 require("../middleware/authMiddleware");

router.post(
 "/",
 authMiddleware,
 capsuleController.createCapsule
);

router.get(
 "/",
 authMiddleware,
 capsuleController.getCapsules
);

router.get(
 "/:id",
 authMiddleware,
 capsuleController.getSingleCapsule
);

router.delete(
 "/:id",
 authMiddleware,
 capsuleController.deleteCapsule
);

router.get(
 "/share/:token",
 capsuleController.getSharedCapsule
);

module.exports = router;
const { Router } = require("express");

const ContactController = require("./app/controllers/ContactController");
const CategoryController = require("./app/controllers/CategoryController");

const router = Router();

router.get(
  "/contacts",
  (req, _res, next) => {
    req.appId = "MeuAppId";
    next();
  },
  ContactController.index
);
router.get("/contacts/:id", ContactController.show);
router.delete("/contacts/:id", ContactController.delete);
router.post("/contacts", ContactController.store);
router.put("/contacts/:id", ContactController.update);

router.get("/categories", CategoryController.index);
router.post("/categories", CategoryController.store);

module.exports = router;

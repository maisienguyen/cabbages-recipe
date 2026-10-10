const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
   res.send('this is userRoutes');

   router.post("/register", () => {});
});
module.exports = router;

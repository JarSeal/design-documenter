const router = require('express').Router();

router.get('/', async (request, response) => {
  response.send('ok');
});

module.exports = router;

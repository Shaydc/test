const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/repos/:user/', controllers.getUserReposFromAddressline);
router.get('/repos/:user/:reponame', controllers.getRepoInfoFromAddressline);

module.exports = router;
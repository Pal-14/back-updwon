const express = require('express');
const router = express.Router();
let path = require('path')
const Auth = require("../middlewares/authentification.js");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/get-private-doc/:name', Auth.isAdmin, function (req, res, next) {
  let options = {
    root: path.join(__dirname, '../private/uploads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  let fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})


router.get('/get-public-pic/:name', function (req, res, next) {
  let options = {
    root: path.join(__dirname, '../public/uploads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  let fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})




module.exports = router;

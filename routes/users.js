var express = require('express');
var router = express.Router();

// users
router.get('/', (req, res, next) => {

  var data = {
      title: 'Users',
      content: '2ページ目を追加してみた',
      link: {href:'/', text:'TOPへ'},
  };    
           
  res.render('users', data);
});

module.exports = router;
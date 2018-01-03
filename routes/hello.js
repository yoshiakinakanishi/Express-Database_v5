var express = require('express');
var router = express.Router();
    
var sqlite3 = require('sqlite3'); // ★追加

// データベースオブジェクトの取得
// 自分で作ったデータベース名を引数に指定
var db = new sqlite3.Database('mydb.sqlite3');

// GETアクセスの処理
router.get('/', (req, res, next) => {
   // データベースのシリアライズ
   db.serialize(() => {
       // レコードをすべて取り出す
       db.all("select * from mydata", (err, rows) => {
          // データベースアクセス完了時の処理
          if (!err) {
              var data = {
                  title: 'データベースのデータを表示する',
                  content: rows // 取得したレコードデータ
              };
              res.render('hello/index', data);
          }
       });   
   });
});

// ---------------------------------------------------------------

// hello/addなので、hello.jsに/addへのGETとPOSTの処理を用意する
// 記述する場所はmodule.exports = router;の手前に
router.get('/add', (req, res, next) => {
   var data = {
       title: 'Hello/Add',
       content: 'あたらしいレコードを入力：'
   }
   res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
   var nm = req.body.name;
   var ml = req.body.mail;
   var ag = req.body.age;

   db.run('insert into mydata (name, mail, age) values (?, ?, ?)', nm, ml, ag);
   
   res.redirect('/hello');
});

// ---------------------------------------------------------------

// hello/showなので、このhello.jsに/showに対するGET処理を用意する（helloがエントリールートとなる）
// POSTはフォーム送信をする際に利用する（GETはデータを取得してアクセスするときに利用する）

router.get('/show', (req, res, next) => {
   var id = req.query.id;
   db.serialize(() => {
       var q ="select * from mydata where id = ?";
       db.get(q, [id], (err, row) => {
           if (!err) {
               var data = {
                   title: 'Hello/show',
                   content: 'id = ' + id + ' のレコード：',
                   mydata: row
               }
               res.render('hello/show', data);
           }
       });
   });
});

// ---------------------------------------------------------------

// editの処理をする

router.get('/edit', (req, res, next) => {
   var id = req.query.id;
   db.serialize(() => {
      var q = "select * from mydata where id = ?";
      db.get(q, [id], (err, row) => {
          if (!err) {
              var data = {
                  title: 'hello/edit',
                  content: 'id = ' + id + 'のレコードを編集：',
                  mydata: row
              }
              res.render('hello/edit', data);
          }
      })
   });
});

router.post('/edit', (req, res, next) => {
   var id = req.body.id;
   var nm = req.body.name;
   var ml = req.body.mail;
   var ag = req.body.age;
   var q = "update mydata set name = ?, mail = ?, age = ? where id = ?";
   db.run(q, nm, ml, ag, id);
   res.redirect('/hello');
});

// ---------------------------------------------------------------

// /deleteの処理をする

router.get('/delete', (req, res, next) => {
    var id = req.query.id;
    db.serialize(() => {
        var q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'Hello/Delete',
                    content: 'id =' + id + 'のレコード削除：',
                    mydata: row
                }
                res.render('hello/delete', data); // パスの指定に注意（/hello/deleteは誤り）
            }
        });
    });
});

router.post('/delete', (req, res, next) => {
   var id = req.body.id;
   var q = "delete from mydata where id = ?";
   db.run(q, id);
   res.redirect('/hello');
});

module.exports = router;
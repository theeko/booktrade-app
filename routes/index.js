var mongoose = require('mongoose');
var User = mongoose.model('User');
var Book = mongoose.model('Book');
var Profile = mongoose.model('Profile');
var Messages = mongoose.model("Messages");
var express = require('express');
var jwt = require('express-jwt');
var passport = require('passport');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/getoffers/:username",function(req, res, next) {
   Messages.find({ purposer: req.params.username}, function(err, msgs) {
       if(err){ next(err); }
       console.log(msgs);
       console.log(req.params.username);
       res.json(msgs);
   });
});

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function (err){
        if(err){ return next(err); }

        return res.json({token: user.generateJWT()});
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields'});
    }
    
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }
    
        if(user){
          return res.json({token: user.generateJWT()});
        } else {
          return res.status(401).json(info);
        }
    })(req, res, next);
});

router.post("/newbook", auth, function(req,res,next){
  var book = new Book(req.body);
  book.owner = req.payload.username;
  
  book.save(function (err,book) {
    if(err){ return next(err); }
    res.json(book);
  });
  
});

router.get("/thebook/:id", function(req, res, next) {
   Book.find({ _id: req.params.id }, function(err,book){
     if(err){ next(err); }
     res.json(book);
   }); 
});

router.post("/booktrade", function(req, res, next) {
  var rb = req.body;
  if(!rb.purposedTo || !rb.purposer || !rb.purposedBookId || !rb.purposerBookId){
    res.send("not enough trading info");
  } else {
  Messages.find({ purposedBookId: req.body.purposedBookId},function(err,msg){
    
    if(err){ next(err); }
    else if(msg && msg.purposerBookId == rb.purposerBookId){ 
    res.send("already in trading passage"); }
    else {
      var message = new Messages(req.body);
      message.save();
      res.send("message created");
    }});
  }
});

router.get("/getmessages/:username", function(req, res, next) {
   Messages.find({ purposedTo: req.params.username}, function(err, msgs) {
     if(err){ next(err); }
     !!msgs[0] ? res.json(msgs) : res.send("no messages");  
   });
});

router.delete("/trademsgdelete/:id", function(req, res, next) {
  Messages.findOne({_id: req.params.id}, function(err, msg) {
    if(err){ next(err); }
    msg.remove(function (err,deleted) {
      if(err){ next(err); }
      res.send("deleted");
    });
  });
});

router.put("/btradeyes", function(req, res, next) {
  console.log("btradeyes router");
  console.log(req.body);
  Book.findOne({ _id: req.body.purposedBookId}, function(err, book) {
    if(err){ next(err); }
    book.owner = req.body.purposer;  
    book.save();
  });
  Book.findOne({ _id: req.body.purposerBookId}, function(err, book) {
    if(err){ next(err); }
    book.owner = req.body.purposedTo;  
    book.save();
  });
  console.log("btradeyes router");
  res.send("ok");
});

router.get("/allbooks", function(req, res, next) {
  Book.find({}, function(err,books){
    if(err){ return next(err); }
    res.json(books);
  }); 
});

router.delete("/deletebook/:id", function (req,res,next) {
  Book.find({_id: req.params.id}, function(err, book) {
    if(err){ return next(err) }
  }).remove(function(err,book){
          if(err){ next(err) }
          res.json(book);
        });
});

router.put("/updateprofile/:username", auth,function(req, res, next) {
  Profile.findOne({ username: req.params.username},function (err,user) {
    if(err){ next(err) }
    
    if(!!user){
      if(!!req.body.fullname) {user.fullname = req.body.fullname }
      if(!!req.body.country) {user.country = req.body.country }
      if(!!req.body.state) {user.state = req.body.state }
      user.save();
      res.json(user);}
    else {
      var prof = new Profile(req.body);
      prof.save(function (err) {
        if(err) { next(err) }
        res.json(prof);
      });
    }
  });
});

router.get("/userbooks/:username",function(req, res, next) {
   Book.find({ owner: req.params.username},function(err,books){
     if(err){ next(err); }
     res.send(books);
   }); 
});

router.get("/userprofile/:username", function(req, res, next) {
   Profile.findOne({ username: req.params.username}, function(err, user) {
       if(err) { next(err) }
       res.json(user);
   }); 
});

module.exports = router;
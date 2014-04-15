var
    gameport = process.env.PORT || 8008,//8008 main //6333 dev
    //gameport = 'stick-battle.com',

    express    = require('express'),

    http       = require('http'),
    app        = express(),
    server     = http.createServer(app);

var version = 1.01;

server.listen(gameport);//gameport);//, 'stick-battle.com');

//set up mongodb
var dburl = '107.170.27.58/mongoapp';
var collections = ['highscores'];
var db = require('mongojs').connect(dburl, collections);

var highscore = function(username, score) {
  this.username = username;
  this.score = score;
}

var testUser = new highscore("Rhys",100);

db.highscores.save(testUser, function(err, savedUser) {
  if(err || !savedUser) {
    console.log("Failed saving a user. err: "+err);
  }else
  console.log("User successfully added. Name: "+ savedUser.username);
});

db.highscores.find(testUser, function(err, highscores) {
  if(err || !highscores.length)
    console.log("User "+ highscore.username +" not found.");
    else highscores.forEach(function (username) {
      console.log("User found! Username: "+username + " score: "+score);
    });
});

console.log('\t Listening on port: ' + gameport );

//By default, we forward the / path to index.html automatically.
app.get('/', function (req, res) {
    console.log('User loading page. Loading %s', __dirname + '/index.html')
    res.sendfile( '/index.html' , { root:__dirname });
});

app.get( '/*' , function( req, res, next ) {

    //This is the current file they have requested
    var file = req.params[0];

    //Send the requesting client the file.
    res.sendfile( __dirname + '/' + file );

}); //app.get

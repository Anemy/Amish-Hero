var
    gameport = process.env.PORT || 6333,//8008 main //6333 dev
    //gameport = 'stick-battle.com',

    express         = require('express'),

    http            = require('http'),
    app             = express(),
    server          = http.createServer(app);

var version = 1.01;

server.listen(gameport);//gameport);//, 'stick-battle.com');

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

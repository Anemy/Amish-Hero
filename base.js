/*
 * Base tester for Rhys
 */

var canvas;
var ctx;

var originalWidth = 800;
var originalHeight = 600;

var gameWidth = 800;
var gameHeight = 600;
var ratio = gameHeight/gameWidth;
var inverseRatio = gameWidth/gameHeight;
var scale = 1.2;//fb default: 1.08571428571

var fps = 25;
var lastTime;

var play = false;
var paused = false;

var floorSize = 0;
var floorGrad = 6;
var cloudX = 0.0;

var mostPoints = 0;
var dogeUnlocked = false;
var cursorX = 0;

//image variables
var heroSpriteSheet;
var dogeSpriteSheet;
var backgroundImage;
var titleScreenImage;
var cloudImage;
var dropImages = [];
var harvestImages = [];
var cursorImage;

//java script b weird
var i = 0;
var k = 0;

var drops = [];
var deltaSum = 0;
var dropSpeed = 200.0;
var numberOfDrops = 50;
var dropSpawnRate = 0;
var dropRate = 0.22;
var drop = function (living, xpos) {
    this.good = false; //default bad drop

    this.scale = 1.0;
    this.width = 30.0;
    this.height = 30.0;

    this.imageID = 0;

    this.x = xpos;
    this.y = -this.height * 2;

    this.alive = living;
}

var hurtAnimation = 0;

var hero;
var lastMovement = 0;
var currentWalkImage = 0;
var lastDirectionRight = true; //which dir facing when not moving
var player = function () {
    this.x = 0.0;
    this.y = 0.0;

    this.left = false;
    this.right = false;

    this.playerSpeed = 350.0;

    this.fed = 1.0; //increases each drop

    //for player size.
    this.scale = 1;
    this.width = 30;
    this.height = 60;

    this.points = 0;

    this.lives = 3;

    this.dogeEnabled = false;
}

var harvMSGs = [];
var numberOfMsg = 10;
var harvestMSGSpeed = 80.0;
var harvestMSG = function (alive, type, x, y) {
    this.type = type;

    this.x = x;
    this.y = y;

    this.life = 100;
    this.alive = alive;
}

var parts = [];
var maxPartSpeed = 80.0;
var minPartSpeed = 20.0;
var partFallSpeed = 30;
var numberOfParts = 150;
var part = function (living, xpos, ypos, xdir, ydir, color) {
    this.width = 8.0;
    this.height = 8.0;

    this.x = xpos;
    this.y = ypos;

    this.xdir = xdir;
    this.ydir = ydir;

    this.alive = living;
    this.life = 100;

    this.colorType = color;

    this.rotation = 0; //anything between 0-360 ctx.rotate(20*Math.PI/180);
    this.rotationVelo = 0;
}

function loadImages() {
    dropImages[0] = new Image();
    dropImages[0].src = "images/AHH-carrot.png";
    dropImages[1] = new Image();
    dropImages[1].src = "images/AHH-corn.png";
    dropImages[2] = new Image();
    dropImages[2].src = "images/AHH-computer.png";
    dropImages[3] = new Image();
    dropImages[3].src = "images/AHH-phone.png";

    //harvestImages
    harvestImages[0] = new Image();
    harvestImages[0].src = "images/harvested1.png";
    harvestImages[1] = new Image();
    harvestImages[1].src = "images/harvested2.png";

    titleScreenImage = new Image();
    titleScreenImage.src = "images/title.png";

    cloudImage = new Image();
    cloudImage.src = "images/CLOUDS.png";

    backgroundImage = new Image();
    backgroundImage.src = "images/Background.png";

    heroSpriteSheet = new Image();
    heroSpriteSheet.src = "images/characterSpriteSheet.png";

    dogeSpriteSheet = new Image();
    dogeSpriteSheet.src = "images/characterSpriteSheet2.png";

    cursorImage = new Image();
    cursorImage.src = "images/cursor.png";
}

function init() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    /*gameWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.getElementsByTagName('body')[0].clientWidth;
    gameHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.getElementsByTagName('body')[0].clientHeight;

    if(gameWidth * ratio > gameHeight) {
        gameWidth = gameHeight * inverseRatio;
    } else {
        gameHeight = gameWidth * ratio;
    }*/

    gameWidth = originalWidth * scale;// - gameWidth/80;
    gameHeight = originalHeight * scale;// - gameHeight/80;

    floorSize = gameHeight/12;

    //scale = gameHeight/originalHeight;

    /*console.log("Canvas width: " + window.innerWidth);
    console.log("Canvas height: " + window.innerHeight);
    console.log("Scaled: " + scale);*/

    canvas.width = gameWidth;
    canvas.height = gameHeight;

    document.body.appendChild(canvas);

    lastTime = Date.now();

    reset_game();

    loadImages();

    document.getElementById("id1").play();

    heroSpriteSheet.onload = function() {
        start_game_loop();
    }
}

function start_game_loop() {
    setInterval(function () { game_loop() }, fps);
}

function reset_game () {
    play = false;
    paused = false;

    dropSpawnRate = 30.0; //100 is top
    dropSpeed = 200;
    dropRate = 0.22;

    hero = new player();
    hero.x = originalWidth/2;
    hero.y = (originalHeight - hero.height/2) - (floorSize);

    drops = [];
    for(i = 0; i < numberOfDrops; i++) {
        drops[i] = new drop(false, -100.0);
    }

    parts = [];
    for(i = 0; i < numberOfParts; i++) {
        parts[i] = new part(false, 0,0,0,0, 0);
    }

    harvMSGs = [];
    for(i = 0; i < numberOfMsg; i++) {
        harvMSGs[i] = new harvestMSG(false, 0,0,0);
    }
}

//half the time returns the val as negative
function getNeg (toNegate) {
    if(Math.random() * 100 > 50)
        return -toNegate;
    else
        return toNegate;
}

function draw_msg() {
    //draw msg
    for(i = 0; i < numberOfMsg; i++) {
        if(harvMSGs[i].alive == true) {
            ctx.globalAlpha = 0.6*(harvMSGs[i].life/100);
            ctx.drawImage(harvestImages[harvMSGs[i].type], scale*harvMSGs[i].x - 37*scale, scale*harvMSGs[i].y - 5*scale, 74*scale, 10*scale);
            //ctx.drawImage(harvestImages[harvMSGs[i].type], harvMSGs[i].x - 37*scale,harvMSGs[i].y - 5*scale, 74*scale, 10*scale);
            ctx.globalAlpha = 1;
        }
    }
}

function draw_parts() {
    //draw particles
    for(i = 0; i < numberOfParts; i++) {
        if(parts[i].alive == true) {
            ctx.globalAlpha = 0.6*(parts[i].life/100);
            if(parts[i].colorType == 0)
                ctx.fillStyle="rgb(211, 84, 0)"; //orangy
            else
                ctx.fillStyle="rgb(241, 196, 15)"; //yellowy
            //ctx.fillStyle = "rgb(39, 174, 96)"; //greeny
            ctx.translate(parts[i].x*scale, parts[i].y*scale);
            ctx.rotate(parts[i].rotation*(Math.PI/180));
            ctx.fillRect((-parts[i].width/2) *scale,(-parts[i].height/2)*scale,parts[i].width*scale,parts[i].height*scale);

            ctx.rotate(-parts[i].rotation*(Math.PI/180));
            ctx.translate(-parts[i].x*scale, -parts[i].y*scale);
            ctx.globalAlpha = 1;
        }
    }
}

function draw_drops() {
    for(i = 0; i < numberOfDrops; i++) {
        if(drops[i].alive) {
        /*            if(drops[i].good)
                ctx.fillStyle = "rgb(39, 174, 96)";
            else
                ctx.fillStyle = "rgb(192, 57, 43)";
            ctx.fillRect((drops[i].x - drops[i].width/2)*scale, (drops[i].y - drops[i].height/2)*scale, hero.width*scale, drops[i].height*scale);
            */
            ctx.drawImage(dropImages[drops[i].imageID], (drops[i].x - drops[i].width)*scale, (drops[i].y - drops[i].height)*scale, (hero.width*2)*scale, (drops[i].height*2)*scale)
        }
    }
}

function draw_hero() {
    if(play) {
        //ctx.font = ("20px Arial");
        ctx.font = ("20px 'Press Start 2P'");
        ctx.fillStyle = "rgb(211, 84, 0)";
        ctx.fillText("Harvest: " + hero.points, 5*scale, gameHeight - 23*scale);

        ctx.fillStyle = "rgb(15, 15, 40)";
        ctx.fillText("Amish Power: " + hero.lives, 5*scale, gameHeight - 3*scale);

        if(!hero.dogeEnabled) {
            if(hero.right == false && hero.left == false) {
                if(lastDirectionRight) {
                    ctx.drawImage(heroSpriteSheet, 0, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                    
                }
                else {
                    ctx.drawImage(heroSpriteSheet, 104, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                }
            }
            else if(hero.right) {
                ctx.drawImage(heroSpriteSheet, 104*currentWalkImage, 0, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
            else if(hero.left) {
                ctx.drawImage(heroSpriteSheet, 104*currentWalkImage, 180, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
        }
        else {
            if(hero.right == false && hero.left == false) {
                if(lastDirectionRight) {
                    ctx.drawImage(dogeSpriteSheet, 0, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                    
                }
                else {
                    ctx.drawImage(dogeSpriteSheet, 104, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                }
            }
            else if(hero.right) {
                ctx.drawImage(dogeSpriteSheet, 104*currentWalkImage, 0, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
            else if(hero.left) {
                ctx.drawImage(dogeSpriteSheet, 104*currentWalkImage, 180, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
        }
    }
    else {
        if(dogeUnlocked == false) {
            ctx.drawImage(heroSpriteSheet, 0, 360, 104, 180, 
                (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                (hero.width*1.5)*scale, (hero.height*1.5)*scale);
        }
        else {
            ctx.drawImage(cursorImage,(hero.x - hero.width*2)*scale + (cursorX*hero.width*3)*scale - 12*scale + hero.width*scale, (hero.y - hero.height)*scale - 16*scale, 14*scale,12*scale);
            ctx.drawImage(heroSpriteSheet, 0, 360, 104, 180, 
                (hero.x + hero.width)*scale, (hero.y - hero.height)*scale,
                (hero.width*1.5)*scale, (hero.height*1.5)*scale);

            ctx.drawImage(dogeSpriteSheet, 0, 360, 104, 180, 
                (hero.x - hero.width*2)*scale, (hero.y - hero.height)*scale,
                (hero.width*1.5)*scale, (hero.height*1.5)*scale);
        }
    }
}

function render() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    //background -> PURP jav
    ctx.fillStyle = "rgb(230, 150, 230)";//light purpe
    ctx.fillStyle = "rgb(236, 240, 241)";//clouds
    ctx.fillStyle = "rgb(63, 161, 211)";//lightish blue
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    ctx.drawImage(cloudImage, cloudX, 0, gameWidth, 164*scale);
    ctx.drawImage(cloudImage, cloudX - gameWidth, 0, gameWidth, 164*scale);

    //console.log("cloudX: "+cloudX);

    draw_parts();

    draw_drops();

    draw_msg();

    ctx.drawImage(backgroundImage, 0, 0, gameWidth, gameHeight);

    /*for(i = 0; i < floorGrad; i++) {
        //ctx.fillStyle = "rgb(39, 174, 96)"; green
        //(150, 75, 0) brown
        var r = 39 + ((150 - 39)/floorGrad)*i;
        var g = 174 - ((174 - 75)/floorGrad)*i;
        var b = 96 - ((96)/floorGrad)*i;
        ctx.fillStyle = "rgb("+ r + ", "+ g + ", "+ b + ")";//floor grad color
        ctx.fillRect(0, gameHeight - (floorGrad-i)*(floorSize/floorGrad), gameWidth, i*(floorSize/floorGrad)); 
    }*/

    draw_hero();

    //hurtAnimation (red screen when hit)
    if(hurtAnimation > 0) {
        if(!paused)
            hurtAnimation--;
        ctx.globalAlpha = 0.6*(hurtAnimation/100);
        ctx.fillStyle="red"; 
        ctx.fillRect(0,0,gameWidth,gameHeight);
        ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "rgb(52, 73, 94)";
    if(paused) {
        //ctx.fillStyle = "rgb(39, 174, 96)";
        ctx.font = ("20px 'Press Start 2P'");
        ctx.fillText("Press \'p\' to unpause!", gameWidth/2 - 150*scale, gameHeight/2 + 25*scale);
    } else if(!play) {
        //ctx.fillStyle = "rgb(39, 174, 96)";
        ctx.font = ("20px 'Press Start 2P'");
        if(mostPoints != 0) {
            ctx.fillText("Your previous best: "+mostPoints, gameWidth/2 - 155*scale, gameHeight - 5*scale);
        }//titleScreenImage
        ctx.drawImage(titleScreenImage, 0, 0, gameWidth, gameHeight);
        //ctx.fillText("Use your arrow keys or \'A\'+\'D\' to stay Amish!", gameWidth/2 - 225*scale, gameHeight/2 - 25*scale);
        //ctx.fillText("Press \'space\' to play!", gameWidth/2 - 120*scale, gameHeight/2 + 25*scale);
    }
}

function game_loop() {
    var currentTime = Date.now();

    var deltaTime = (currentTime - lastTime)/1000;
    if(play && !paused) {
        update(deltaTime);
    }

    updateClouds(deltaTime);

    render();

    lastTime = currentTime;
}

function updateClouds(delta) {
    //updating clouds
    cloudX = cloudX + (10.0*delta);
    if(cloudX > gameWidth)
        cloudX = cloudX - gameWidth;
}

function update(delta) {
    //add new drops
    deltaSum += delta;
    if(deltaSum > dropRate) {
        deltaSum = 0;
        if(Math.random()*100 < dropSpawnRate) {
            for(i = 0; i < numberOfDrops; i++) {
                if(drops[i].alive == false) {
                    drops[i] = new drop(true, Math.random() * gameWidth);
                    if(Math.random()*100 < 50) {
                        drops[i].imageID = 0;
                    }
                    else {
                        drops[i].imageID = 1;
                    }
                    if(Math.random()*100 < 50) {
                        drops[i].good = true;
                    }
                    else {
                        drops[i].imageID += 2;
                    }

                    break;
                }
            }
        }
    }

    //player drop collisions
    for(i = 0; i < numberOfDrops; i++) {
        if(drops[i].alive == true) {
            //check top bound for collision (low enough) y
            if(drops[i].y + drops[i].height/2 > hero.y - hero.height/2 && drops[i].y + drops[i].height*2 < gameHeight - drops[i].height - floorSize) {
                if(drops[i].x + drops[i].width/2 > hero.x - hero.width/2 && drops[i].x - drops[i].width/2 < hero.x + hero.width/2) {
                    //COLLIDE
                    drops[i].alive = false;

                    if(drops[i].good) {
                        document.getElementById("yumyum").play();
                        //drop some particles
                        var numberOfPartsToAdd = 25;
                        for(k = 0; k < numberOfParts; k++) {
                            if(parts[k].alive == false) {
                                numberOfPartsToAdd--;
                                if(numberOfPartsToAdd == 0)
                                    break;
                                parts[k] = new part(true,
                                    hero.x, hero.y,
                                    getNeg(Math.random()*maxPartSpeed),
                                    -(Math.random()*maxPartSpeed + minPartSpeed),
                                    drops[i].imageID);
                                parts[k].rotation = Math.random()*359.0;
                                parts[k].rotationVelo = getNeg(Math.random()*359.0);

                                //console.log("New particle added xv: "+parts[k].xdir + " yv: "+parts[k].ydir);
                            }
                        }
                            
                        //harvMSGs
                        for(k = 0; k < numberOfMsg; k++) {
                            if(harvMSGs[k].alive == false) {
                                harvMSGs[k] = new harvestMSG(true, drops[i].imageID, hero.x, hero.y - hero.height/2);
                                break;
                            }
                        }

                        hero.points += 1;
                        //increase spawn rates.
                        if(dropSpawnRate < 50) {
                            dropSpeed += 5;
                            dropSpawnRate += 2;
                            if(dropRate > 0.15)
                                dropRate -= 0.0125
                        } else if(dropSpawnRate < 75) {
                            dropSpeed += 8;
                            dropSpawnRate += 1.5;
                            if(dropRate > 0.1)
                                dropRate -= 0.005
                        } else if(dropSpawnRate < 99) {
                            dropSpeed += 6;
                            dropSpawnRate += 1;
                            if(dropRate > 0.1)
                                dropRate -= 0.0025
                        } else {
                            dropSpeed += 5;
                            if(dropRate > 0.025)
                                dropRate -= 0.0005
                        }
                    }
                    else {
                        document.getElementById("ouch").play();
                        hero.lives -= 1;
                        if(hero.lives == -1) {
                            if(hero.points > mostPoints) {
                                mostPoints = hero.points;
                                if(mostPoints > 100)
                                    dogeUnlocked = true;
                            }
                            reset_game();
                        }
                        hurtAnimation = 100;
                    }
                } 
            } 
        }
    }

    //update falling drops
    for(i = 0; i < numberOfDrops; i++) {
        if(drops[i].alive == true) {
            drops[i].y += dropSpeed*delta;
            if(drops[i].y > gameHeight + drops[i].height)
                drops[i].alive = false;
        }
    }

    //update particles
    for(i = 0; i < numberOfParts; i++) {
        if(parts[i].alive == true) {
            parts[i].x += parts[i].xdir*delta;
            parts[i].y += parts[i].ydir*delta;
            parts[i].ydir += partFallSpeed*delta;
            parts[i].life -= 25*delta;
            if(parts[i].y > gameHeight + parts[i].height || parts[i].life < 1)
                parts[i].alive = false;

            parts[i].rotation += parts[i].rotationVelo*delta;
            if(parts[i].rotation > 360.0)
                parts[i].rotation -= 360.0;
            else if(parts[i].rotation < 0.0)
                parts[i].rotation += 360.0;
        }
    }

    //harvest messages
    for(k = 0; k < numberOfMsg; k++) {
        if(harvMSGs[k].alive == true) {
            harvMSGs[k].y = harvMSGs[k].y - harvestMSGSpeed*delta;
            harvMSGs[k].life -= 40*delta;
            if(harvMSGs[k].life < 1)
                harvMSGs[k].alive = false;
        }
    }

    //update hero movement
    if(hero.left) {
        lastMovement += delta;
        if(lastMovement > .15) {
            lastMovement = 0;
            currentWalkImage++
        }
        if(currentWalkImage > 5)
            currentWalkImage = 0;
        if(hero.x > hero.width)
            hero.x -= hero.playerSpeed * delta;
    }
    if(hero.right) {
        lastMovement += delta;
        if(lastMovement > .15) {
            lastMovement = 0;
            currentWalkImage++
        }
        if(currentWalkImage > 5)
            currentWalkImage = 0;
        if(hero.x < gameWidth - (hero.width*5.5))
            hero.x += hero.playerSpeed * delta;
    }
}

window.addEventListener('keydown', this.keyPressed , false);

function keyPressed(e) {
    //document.getElementById("p1").innerHTML = "New text!";
    var key = e.keyCode;
    e.preventDefault();

    if(key == 37 || key == 65) { //left key
        if(play) hero.left = true;
        hero.right = false;
    }
    if(key == 39 || key == 68) { //right key
        hero.left = false;
        if(play) hero.right = true;
    }
}

window.addEventListener('keyup', this.keyReleased , false);

function keyReleased(e) {
    var upKey = e.keyCode;
    e.preventDefault();

    if(upKey == 37 || upKey == 65) { //left key
        lastDirectionRight = false
        hero.left = false;
        currentWalkImage = 0;

        if(!play) {
            if(dogeUnlocked) {
                if(cursorX == 1)
                    cursorX = 0;
            }
        }
    }
    if(upKey == 39 || upKey == 68) { //right key
        lastDirectionRight = true;
        hero.right = false;
        currentWalkImage = 0;

        if(!play) {
            if(dogeUnlocked) {
                if(cursorX == 0)
                    cursorX = 1;
            }
        }
    }

    if(upKey == 80)
        paused = !paused;

    if(upKey == 32) {
        if(!play) {
            play = true;
            if(dogeUnlocked) {
                if(cursorX == 1) {
                    hero.dogeEnabled = false;
                    hero.x = hero.x + hero.width*1.5;//javascript:dogeUnlocked=true
                    hero.playerSpeed = 350;
                }
                else {
                    hero.dogeEnabled = true;
                    hero.x = hero.x - hero.width*2;
                    hero.playerSpeed = 450;
                }
            }
        }
    }

    if(upKey == 27)
        reset_game();
}
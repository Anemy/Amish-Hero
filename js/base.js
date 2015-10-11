/*
 * Base tester for Rhys
 */

var canvas;
var ctx;
var input;

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

var muted = false;

//image variables
var heroSpriteSheet;
var dogeSpriteSheet;
var heroLife;
var dogeLife;
var backgroundImage;
var titleScreenImage;
var cloudImage;
var dropImages = [];
var harvestImages = [];
var cursorImage;
var harvest;
var amishPower;
var scoreImage;
var speakerImage;
var muteImage;

//java script b weird
var i = 0;
var k = 0;

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

    sky = new Image();
    sky.src = "images/sky.png";

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


    //UI Stuff
    heroLife = new Image();
    heroLife.src = "images/heroLife.png";

    dogeLife = new Image();
    dogeLife.src = "images/dogeLife.png";

    amishPower = new Image();
    amishPower.src = "images/amishPower.png";

    harvest = new Image();
    harvest.src = "images/harvest.png";

    scoreImage = new Image();
    scoreImage.src = "images/score.png"

    cursorImage = new Image();
    cursorImage.src = "images/cursor.png";

    speakerImage = new Image();
    speakerImage.src = "images/speaker.png";

    muteImage = new Image();
    muteImage.src = "images/speakerMute.png";
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

function render() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    //background -> PURP jav
    //ctx.fillStyle = "rgb(230, 150, 230)";//light purpe
    //ctx.fillStyle = "rgb(236, 240, 241)";//clouds
    //ctx.fillStyle = "rgb(63, 161, 211)";//lightish blue
    //ctx.fillRect(0, 0, gameWidth, gameHeight);
    ctx.drawImage(sky, 0, 0, gameWidth, gameHeight);

    ctx.drawImage(cloudImage, cloudX, 0, gameWidth, 164*scale);
    ctx.drawImage(cloudImage, cloudX - gameWidth, 0, gameWidth, 164*scale);

    //console.log("cloudX: "+cloudX);

    draw_parts(ctx);

    draw_drops(ctx);

    draw_msg(ctx);

    ctx.drawImage(backgroundImage, 0, 0, gameWidth, gameHeight);

    if(muted)
        ctx.drawImage(muteImage, gameWidth - 50, gameHeight - 50, 37, 37);
    else
        ctx.drawImage(speakerImage, gameWidth - 50, gameHeight - 50, 37, 37);

    /*for(i = 0; i < floorGrad; i++) {
        //ctx.fillStyle = "rgb(39, 174, 96)"; green
        //(150, 75, 0) brown
        var r = 39 + ((150 - 39)/floorGrad)*i;
        var g = 174 - ((174 - 75)/floorGrad)*i;
        var b = 96 - ((96)/floorGrad)*i;
        ctx.fillStyle = "rgb("+ r + ", "+ g + ", "+ b + ")";//floor grad color
        ctx.fillRect(0, gameHeight - (floorGrad-i)*(floorSize/floorGrad), gameWidth, i*(floorSize/floorGrad));
    }*/

    draw_hero(ctx);

    //hurtAnimation (red screen when hit)
    if(hurtAnimation > 0) {
        if(!paused)
            hurtAnimation--;
        ctx.globalAlpha = 0.6*(hurtAnimation/100);
        ctx.fillStyle="red";
        ctx.fillRect(0,0,gameWidth,gameHeight);
        ctx.globalAlpha = 1;
    }

    if(muted) {
        document.getElementById("id1").muted = true;
    }
    else {
        document.getElementById("id1").muted = false;
    }

    ctx.fillStyle = "rgb(52, 73, 94)";
    if(paused) {
        //ctx.fillStyle = "rgb(39, 174, 96)";
        ctx.font = ("50px 'Score'");
        ctx.fillText("Press \'p\' to unpause!", gameWidth/2 - 175*scale, gameHeight/2 + 25*scale);
    } else if(!play) {
        //ctx.fillStyle = "rgb(39, 174, 96)";
        ctx.font = ("50px 'Score'");
        if(mostPoints != 0) {
            ctx.fillText("Your previous best: "+mostPoints, gameWidth/2 - 200*scale, gameHeight - 5*scale);
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
    addNewDrops(delta);

    //player drop collisions
    for(i = 0; i < numberOfDrops; i++) {
        if(drops[i].alive == true) {
            //check top bound for collision (low enough) y
            if(drops[i].y + drops[i].height/2 > hero.y - hero.height/2 && drops[i].y + drops[i].height*2 < gameHeight - drops[i].height - floorSize) {
                if(drops[i].x + drops[i].width/2 > hero.x - hero.width/2 && drops[i].x - drops[i].width/2 < hero.x + hero.width/2) {
                    //COLLIDE
                    drops[i].alive = false;

                    if(drops[i].good) {
                        if(!muted)
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
                        if (!muted && hero.lives > 0)
                            document.getElementById("hurt").play();
                        if (!muted && hero.lives == 0)
                            document.getElementById("wilhelm").play();
                        hero.lives -= 1;
                        if(hero.lives == -1) {
                            if(hero.points > mostPoints) {
                                mostPoints = hero.points;
                                if(checkLeaderboard(mostPoints)) {
                                  alert("New High Score!");
                                }
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
    updateDrops(delta);

    updateParts(delta);

    //update harvest messages
    updateMSGs(delta);

    updateHero(delta);
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

    if(upKey == 77)
        muted = !muted;

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

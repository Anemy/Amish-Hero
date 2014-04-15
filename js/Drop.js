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

var addNewDrops = function(delta) {
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
}

var updateDrops = function (delta) {
	for(i = 0; i < numberOfDrops; i++) {
        if(drops[i].alive == true) {
            drops[i].y += dropSpeed*delta;
            if(drops[i].y > gameHeight + drops[i].height)
                drops[i].alive = false;
        }
    }
}

function draw_drops(ctx) {
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
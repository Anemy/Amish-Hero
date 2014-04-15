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

//harvest messages
var updateMSGs = function(delta) {
    for(k = 0; k < numberOfMsg; k++) {
        if(harvMSGs[k].alive == true) {
            harvMSGs[k].y = harvMSGs[k].y - harvestMSGSpeed*delta;
            harvMSGs[k].life -= 40*delta;
            if(harvMSGs[k].life < 1)
                harvMSGs[k].alive = false;
        }
    }
}

function draw_msg(ctx) {
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
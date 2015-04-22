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

function draw_parts(ctx) {
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

var updateParts = function(delta) {
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
}
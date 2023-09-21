let tank;

function setup() {
    createCanvas(400, 400);

    tank = new FoishTank(100, 400, 400);
}

function draw() {
    background('#006994');
    for (let i = 0; i < tank.foishes.length; i++) {
        let foish = tank.foishes[i];
        drawFoish(foish, i);
        // Velocity arrow
        // line(foish.x, foish.y, foish.x + foish.vX * 5, foish.y + foish.vY * 5);
    }

    // line(
    //     tank.bigFoish.x,
    //     tank.bigFoish.y,
    //     tank.bigFoish.x + tank.bigFoish.vX * 5,
    //     tank.bigFoish.y + tank.bigFoish.vY * 5,
    // );

    drawBigFoish(tank.bigFoish);

    tank.step();
}

function drawFoish(foish, i) {
    push();
    // console.log(
    //     `hsl(${Math.round(i / tank.foishes.length) * 30 + 240}, 53%, 70%)`,
    // );
    const c = color(
        `hsl(${Math.round((i / tank.foishes.length) * 100 + 100)}, 53%, 70%)`,
    );
    fill(c);
    noStroke();
    translate(foish.x, foish.y);
    rotate(foish.angleRadians);
    //console.log(foish.velocity);
    // Body
    ellipse(0, 0, foish.velocity * 2.5, 12 - foish.velocity);
    // Tail
    triangle(
        -foish.velocity * 2 + 3,
        0,
        -foish.velocity * 2.5,
        -5,
        -foish.velocity * 2.5,
        5,
    );
    pop();
}


function drawBigFoishSprite(x, y, angleRads)
{
    push();
    fill('#FFFFFF');
    noStroke();
    translate(x, y);
    rotate(angleRads);
    // Fins
    fill('#FFFFFF');
    triangle(20, -5, -25, -30, -25, 30);
    // Body
    fill('#FFFFFF');
    ellipse(0, 0, 70, 40);
    fill('#CCCCCC80');
    ellipse(0, -12, 55, 15);
    ellipse(0, 12, 55, 15);
    fill('#FFFFFF');
    ellipse(10, -12, 20, 10);
    ellipse(10, 12, 20, 10);
    fill('#000000');
    circle(15, -12, 5);
    circle(15, 12, 5);
    // Tail
    fill('#FFFFFF');
    triangle(-20, 0, -60, -15, -60, 15);
    fill('#CCCCCC80');
    triangle(-40, 0, -60, -15, -60, 15);
    triangle(-40, 0, -60, -7, -60, 7);
    pop();
}

function drawBigFoish(foish) {
    drawBigFoishSprite(foish.x, foish.y, foish.angleRadians);
    // Extra ones drawn so the fish I mean foish smoothly travels 
    // across the edges of the canvas.
    drawBigFoishSprite(foish.x + width, foish.y, foish.angleRadians);
    drawBigFoishSprite(foish.x - width, foish.y, foish.angleRadians);
    drawBigFoishSprite(foish.x, foish.y + height, foish.angleRadians);
    drawBigFoishSprite(foish.x, foish.y - height, foish.angleRadians);
}

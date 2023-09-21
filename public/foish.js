// https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/#
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class FoishTank {
    separation = 1;
    alignment = 1;
    cohesion = 0.04;
    neighborhoodRange = 50;
    protectedRange = 20;
    turnFactor = 0;
    foishes = [];
    bigFoish = null;
    bigFoishAvoidance = 3;

    constructor(n, h, w) {
        this.foishes = [];

        for (let i = 0; i < n; i++) {
            this.foishes.push(
                new Foish(
                    randomNumber(0, w),
                    randomNumber(0, h),
                    randomNumber(-11, 11),
                    randomNumber(-11, 11),
                ),
            );
        }

        this.bigFoish = new Foish(
            randomNumber(0, w),
            randomNumber(0, h),
            randomNumber(-1, 1),
            randomNumber(-1, 1),
        );
    }

    step() {
        // Big foish

        let closestFoish = null;

        for (let foish of this.foishes) {
            if (
                closestFoish == null ||
                this.bigFoish.distance(foish) <
                    this.bigFoish.distance(closestFoish)
            ) {
                closestFoish = foish;
            }
        }

        let originalvX = this.bigFoish.vX;
        let originalvY = this.bigFoish.vY;

        if (closestFoish != null) {
            let diff = this.bigFoish.diff(closestFoish);
            if (!isNaN(diff[0]) && !isNaN(diff[1])) {
                this.bigFoish.vX -= diff[0] * 0.01;
                this.bigFoish.vY -= diff[1] * 0.01;
            }
        }

        this.bigFoish.vX = (this.bigFoish.vX + originalvX) / 2;
        this.bigFoish.vY = (this.bigFoish.vY + originalvY) / 2;

        // Rotate bigFoish by swim
        let swimFactor = Math.sin(this.bigFoish.swim / 2.5) * 5;

        if (isNaN(swimFactor)) {
            swimFactor = 0;
        }

        let [newX, newY] = rotateDegrees(
            this.bigFoish.vX,
            this.bigFoish.vY,
            swimFactor,
        );

        this.bigFoish.vX = newX;
        this.bigFoish.vY = newY;

        this.bigFoish.clampVelocity(0.1, 4);

        this.bigFoish.moveFoish();

        this.bigFoish.loopFoish(400, 400);

        this.bigFoish.swim += Math.random() * 0.1 + 0.95;

        for (let i = 0; i < this.foishes.length; i++) {
            let foish = this.foishes[i];
            let neighbors = [];

            for (let neighbor of this.foishes) {
                if (foish.distance(neighbor) <= this.neighborhoodRange) {
                    neighbors.push(neighbor);
                }
            }

            let tooClose = [];

            for (let neighbor of this.foishes) {
                if (foish.distance(neighbor) <= this.protectedRange) {
                    tooClose.push(neighbor);
                }
            }

            // Separation

            let separation = [0, 0];

            for (let neighbor of tooClose) {
                let diff = foish.diff(neighbor);
                let distance = clamp(foish.distance(neighbor), 0.1, 100);
                separation[0] += diff[0] / distance;
                separation[1] += diff[1] / distance;
            }

            foish.vX += separation[0] * this.separation;
            foish.vY += separation[1] * this.separation;

            // Alignment

            let velocityAverage = [0, 0];

            for (let neighbor of neighbors) {
                velocityAverage[0] += neighbor.vX;
                velocityAverage[1] += neighbor.vY;
            }

            if (neighbors.length > 0) {
                velocityAverage[0] /= neighbors.length;
                velocityAverage[1] /= neighbors.length;
            }

            foish.vX += velocityAverage[0] * this.alignment;
            foish.vY += velocityAverage[1] * this.alignment;

            // Cohesion

            let positionAverage = [0, 0];

            for (let neighbor of neighbors) {
                positionAverage[0] += neighbor.x;
                positionAverage[1] += neighbor.y;
            }

            if (neighbors.length > 0) {
                positionAverage[0] /= neighbors.length;
                positionAverage[1] /= neighbors.length;
            }

            let positionDiff = [
                positionAverage[0] - foish.x,
                positionAverage[1] - foish.y,
            ];

            foish.vX += positionDiff[0] * this.cohesion;
            foish.vY += positionDiff[1] * this.cohesion;

            // Avoid bigFoish

            let bigFoishDiff = [
                this.bigFoish.x - foish.x,
                this.bigFoish.y - foish.y,
            ];

            let bigFoishDistance = clamp(
                this.bigFoish.distance(foish),
                0.1,
                100,
            );

            if (bigFoishDistance < 100) {
                foish.vX -=
                    (bigFoishDiff[0] / bigFoishDistance) *
                    this.bigFoishAvoidance;
                foish.vY -=
                    (bigFoishDiff[1] / bigFoishDistance) *
                    this.bigFoishAvoidance;
            }

            // Rotate velocity vector by turnFactor degrees

            let swimFactor =
                Math.sin((foish.swim * this.foishes.length) / (i * 2.5)) * 5;

            if (isNaN(swimFactor)) {
                swimFactor = 0;
            }

            let [newX, newY] = rotateDegrees(
                foish.vX,
                foish.vY,
                this.turnFactor + swimFactor,
            );

            foish.vX = newX;
            foish.vY = newY;

            this.turnFactor += Math.random() * 0.01 - 0.005;

            this.turnFactor = clamp(this.turnFactor, -1, 1);

            // Clamp velocity

            foish.clampVelocity(0.1, (i * 4) / this.foishes.length + 4);

            foish.moveFoish();

            foish.swim += Math.random() * 0.1 + 0.95;

            foish.loopFoish(400, 400);
        }
    }
}

class Foish {
    swim = 0;

    constructor(x, y, vX, vY) {
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
    }

    distance(other) {
        let x = this.x - other.x;
        let y = this.y - other.y;
        return Math.sqrt(x * x + y * y);
    }

    get nextStep() {
        return [this.x + this.vX, this.y + this.vY];
    }

    moveFoish() {
        this.x += this.vX;
        this.y += this.vY;
    }

    diff(other) {
        return [this.x - other.x, this.y - other.y];
    }

    clampVelocity(min, max) {
        let speed = Math.sqrt(this.vX * this.vX + this.vY * this.vY);
        if (speed > max) {
            this.vX *= max / speed;
            this.vY *= max / speed;
        } else if (speed < min) {
            this.vX *= min / speed;
            this.vY *= min / speed;
        }
    }

    loopFoish(h, w) {
        this.x = (this.x + w) % w;
        this.y = (this.y + h) % h;
    }

    get angleRadians() {
        return Math.atan2(this.vY, this.vX);
    }

    get velocity() {
        return Math.sqrt(this.vX * this.vX + this.vY * this.vY);
    }
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function rotateDegrees(x, y, degrees) {
    let radians = (degrees * Math.PI) / 180;
    let sin = Math.sin(radians);
    let cos = Math.cos(radians);
    let newX = x * cos - y * sin;
    let newY = x * sin + y * cos;
    return [newX, newY];
}

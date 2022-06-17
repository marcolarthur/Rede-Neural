class Snake {
  constructor(sketch, x, y, brain) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.color = this.generateColor();
    this.xspeed = sketch.floor(sketch.random(2));
    this.yspeed = this.xspeed == 0 ? 1 : 0;
    // this.xspeed = 0;
    // this.yspeed = 0;
    this.total = 0;
    this.tail = [];
    this.brain = brain;
  }

  update() {
    if (this.total > this.tail.length) {
      this.tail.push([this.x, this.y]);
    } else {
      this.tail.unshift([this.x, this.y]);
      this.tail.pop();
    }
    this.x += this.xspeed * 10;
    this.y += this.yspeed * 10;
  }

  changeDirection(dirString) {
    if (
      (this.xspeed == 1 && dirString == "left") ||
      (this.xspeed == -1 && dirString == "right") ||
      (this.yspeed == 1 && dirString == "up") ||
      (this.yspeed == -1 && dirString == "down")
    ) {
      return;
    }
    switch (dirString) {
      case "up":
        this.xspeed = 0;
        this.yspeed = -1;
        break;
      case "down":
        this.xspeed = 0;
        this.yspeed = 1;
        break;
      case "left":
        this.xspeed = -1;
        this.yspeed = 0;
        break;
      case "right":
        this.xspeed = 1;
        this.yspeed = 0;
        break;
    }
  }

  checkDeath(height, width) {
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      return true;
    }
    for (let i = 0; i < this.tail.length; i++) {
      if (this.tail[i][0] == this.x && this.tail[i][1] == this.y) {
        return true;
      }
    }
  }

  checkEat(food, pixelSize) {
    if (
      Math.abs(this.x - food.x) <= pixelSize &&
      Math.abs(this.y - food.y) <= pixelSize
    ) {
      this.total++;
      this.update();
      return true;
    }
    return false;
  }

  generateColor() {
    let r = this.sketch.floor(this.sketch.random(100));
    let g = this.sketch.floor(this.sketch.random(255));
    let b = this.sketch.floor(this.sketch.random(255));
    if (r > g || r > b) {
      return this.generateColor();
    }
    return this.sketch.color(r, g, b);
  }

  predict(x1, y1, x2, y2) {
    const input = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
    };
    this.brain.net.classify(input, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.changeDirection(result[0].label);
      }
    });
  }
}

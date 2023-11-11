class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = generateColor();
    this.score = 0;
    this.xspeed = 0;
    this.yspeed = 0;
    this.total = 1;
    this.tail = [];
    this.isDead = false;
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  
    if (this.total > this.tail.length) {
      this.tail.push({ x: this.x, y: this.y }); 
    }
  
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1]; 
    }
    if (this.total > 0) {
      this.tail[this.total - 1] = { x: this.x, y: this.y }; 
    }
  }

  changeDirection(dirString) {
    // if (
    //   (this.xspeed == BLOCK_SIZE && dirString == "left") ||
    //   (this.xspeed == -BLOCK_SIZE && dirString == "right") ||
    //   (this.yspeed == BLOCK_SIZE && dirString == "up") ||
    //   (this.yspeed == -BLOCK_SIZE && dirString == "down")
    // ) {
    //   this.die();
    // }
    switch (dirString) {
      case "up":
        this.xspeed = 0;
        this.yspeed = -BLOCK_SIZE;
        break;
      case "down":
        this.xspeed = 0;
        this.yspeed = BLOCK_SIZE;
        break;
      case "left":
        this.xspeed = -BLOCK_SIZE;
        this.yspeed = 0;
        break;
      case "right":
        this.xspeed = BLOCK_SIZE;
        this.yspeed = 0;
        break;
    }
  }

  die() {
    this.color = "gray";
    this.isDead = true;
  }

  grow() {
    this.total++;
    this.score += 10;
  }

  giveScoreForWalk() {
    this.score += 0.01;
  }
}

//generate colors except red tones
function generateColor() {
  let r = floor(random(100));
  let g = floor(random(255));
  let b = floor(random(255));
  if (r > g || r > b) {
    return generateColor();
  }
  return color(r, g, b);
}

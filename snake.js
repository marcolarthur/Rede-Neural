class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = generateColor();
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 1;
    this.tail = [];
    this.isDead = false;
  }


  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    if (this.total > this.tail.length) {
      this.tail.push([this.x, this.y]);
    } else {
      this.tail.unshift([this.x, this.y]);
      this.tail.pop();
    }
  }

  changeDirection(dirString) {
    if (
      (this.xspeed == 1 && dirString == "left") ||
      (this.xspeed == -1 && dirString == "right") ||
      (this.yspeed == 1 && dirString == "up") ||
      (this.yspeed == -1 && dirString == "down")
    ) {
      return "";
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

  die(){
    this.tail = [];
    this.total = 0;
    this.color = 'gray';
    this.isDead = true;
  }

  grow(){
    this.total++;
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

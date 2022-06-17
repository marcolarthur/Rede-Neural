class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = color(255, 0, 0); 
  }

  update(min, max) {
    this.x = floor(random(min, min + max));
    this.y = floor(random(0, max));
  }
}
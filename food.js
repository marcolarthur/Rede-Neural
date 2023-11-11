class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = color(255, 0, 0); 
  }

  update(x, y) {
    this.x = floor(random(BLOCK_SIZE, x - BLOCK_SIZE));
    this.y = floor(random(BLOCK_SIZE, y - BLOCK_SIZE));
  }
}
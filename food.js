class Food {
  constructor(sketch, x, y) {
    this.x = x;
    this.y = y;
    this.sketch = sketch;
    this.color = sketch.color(255, 0, 0);
  }

  update() {
    this.x = this.sketch.floor(this.sketch.random(0, this.sketch.width));
    this.y = this.sketch.floor(this.sketch.random(0, this.sketch.height));
  }
}

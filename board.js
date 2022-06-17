class Board {
  constructor(sketch) {
    sketch.setup = function () {
      sketch.createCanvas(size, size, sketch.WEBGL).position(x, y);
      this.x = x;
      this.y = y;
      this.size = size;
      let randx = floor(random(x, x + size));
      let randy = floor(random(0, y - 10));
      this.snake = new Snake(randx, randy);
      while (
        Math.abs(this.snake.x - randx) < size &&
        Math.abs(this.snake.y - randy) < size
      ) {
        randx = floor(random(x, x + size));
        randy = floor(random(0, y - 10));
      }
      this.food = new Food(randx, randy);
    };
    sketch.draw = function () {
      this.snake.update();
      if (this.snake.checkEat(this.food)) {
        this.food.update(this.x, this.size);
      }
      this.writeOnScreen();
      stroke(255);
      line(this.x, 0, this.x, this.y);
      for (const bodyPart of this.snake.tail) {
        fill(this.snake.color);
        rect(bodyPart[0], bodyPart[1], 10, 10);
      }
      rect(this.snake.x, this.snake.y, 10, 10);
      fill(this.food.color);
      rect(this.food.x, this.food.y, 10, 10);
    };
  }
  writeOnScreen() {
    let div = document.getElementById("scores");
    div.innerHTML = "";
  }
}

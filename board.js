class Board {
  constructor(x, y, xSize, ySize, numOfSnakes) {
    this.x = x;
    this.y = y;
    this.xSize = xSize;
    this.ySize = ySize;
    let randx = floor(random(x + 1, x + xSize));
    let randy = floor(random(1, y + ySize));
    this.snakes = [];
    for (let i = 0; i < numOfSnakes; i++) {
      this.snakes.push(new Snake(randx, randy));
    }
    randx = floor(random(x + 1, x + xSize));
    randy = floor(random(1, y + ySize));
    this.food = new Food(randx, randy);
  }

  update() {
    this.snakes = this.snakes.filter(snake => snake.total > 0);
   
    for (let i = 0; i < this.snakes.length; i++) {
      this.checkEat(this.snakes[i]);
      this.checkDeath(this.snakes[i]);     
    }
  }

  draw() {
    fill(this.food.color);
    rect(this.food.x, this.food.y, 10, 10);
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].update();
      fill(this.snakes[i].color);
      rect(this.snakes[i].x, this.snakes[i].y, 10, 10);
    }
  }

  checkEat(snake) {
    if (snake.x == this.food.x && snake.y == this.food.y) this.food.update(this.x, this.xSize);;
    return;
  }

  checkDeath(snake) {
    const boardLeft = this.x;
    const boardRight = this.x + this.xSize;
    const boardTop = this.y;
    const boardBottom = this.y + this.ySize;

    if (
      snake.x < boardLeft ||
      snake.x > boardRight ||
      snake.y < boardTop ||
      snake.y > boardBottom
    ) {
      snake.die();
    }
  }

  getSnake(i){
    return this.snakes[i];
  }

  getFoodPosition(){
    return [this.food.x, this.food.y];
  }
}

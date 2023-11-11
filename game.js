class Game {
  constructor(x, y, xSize, ySize) {
    this.x = x;
    this.y = y;
    this.xSize = xSize;
    this.ySize = ySize;
    this.frame = 0;
    this.snakes = [];
    this.food = null;
    this.reset();
  }

  reset() {
    this.frame = 0;
    this.snakes = [];
    let randx = floor(random(this.x + 1, this.x + this.xSize));
    let randy = floor(random(1, this.y + this.ySize));
    for (let i = 0; i < 1; i++) {
      this.snakes.push(new Snake(randx, randy));
    }
    randx = floor(random(this.x + 1, this.x + this.xSize));
    randy = floor(random(1, this.y + this.ySize));
    this.food = new Food(randx, randy);
  }

  step(dir) {
    this.frame += 1;
    //this.snakes = this.snakes.filter(snake => snake.total > 0);
    let reward = 0;
    let gameOver = false;
    for (let i = 0; i < this.snakes.length; i++) {    
      this.snakes[i].changeDirection(dir);
      this.snakes[i].update();
      fill(this.food.color);
      rect(this.food.x, this.food.y, 10, 10);
      for (let i = 0; i < this.snakes.length; i++) {
        fill(this.snakes[i].color);
        rect(this.snakes[i].x, this.snakes[i].y, 10, 10);
      }
      if (
        this.checkDeath(this.snakes[i]) || 
        this.frame >  1 + this.snakes[i].tail.length * 150
      ) {
        gameOver = true;
        reward = -10;
        return [reward, gameOver, this.snakes[i].score];
      }
      if (this.checkEat(this.snakes[i])) {
        reward = 10;
      } else {
        this.snakes[i].giveScoreForWalk();
      }
      return [reward, gameOver, this.snakes[i].score];
    }
  }


  checkEat(snake) {
    if (snake.x == this.food.x && snake.y == this.food.y){
      this.food.update(this.x, this.xSize);
      snake.grow();
      return true;
    }
    return false;
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
      return true;
    }
    return false;
  }

  getSnake(i) {
    return this.snakes[i];
  }

  getFoodPosition() {
    return [this.food.x, this.food.y];
  }
}

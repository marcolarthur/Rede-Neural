//this.snakes = this.snakes.filter(snake => snake.total > 0);
const BLOCK_SIZE = 20;
class Game {
  constructor(xSize, ySize, qntd) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.frame = 0;
    this.snakes = [];
    this.food = null;
    this.qntd = qntd;
    this.reset();
  }

  reset() {
    this.frame = 0;
    this.snakes = [];
    let randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE));
    let randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE));
    for (let i = 0; i < this.qntd; i++) {
      randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE));
      randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE));
      this.snakes.push(new Snake(randx, randy));
    }
    randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE));
    randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE));
    this.food = new Food(randx, randy);
  }

  steps(directions) {
    let eated = false;
    let infos = [];
    this.frame += 1;
    for (let i = 0; i < this.snakes.length; i++) {
      let reward = 0;
      let gameOver = false;
      this.render(i, directions[i]);
      if (
        this.checkDeath(this.snakes[i]) ||
        this.frame > this.snakes[i].total * 100 ||
        this.snakes[i].isDead
      ) {
        gameOver = true;
        reward = -BLOCK_SIZE;
        infos.push([reward, gameOver, this.snakes[i].score]);
      }
      if (this.checkEat(this.snakes[i])) {
        eated = true;
        reward = BLOCK_SIZE;
      }
      infos.push([reward, gameOver, this.snakes[i].score]);
    }
    if(eated){
      this.food.update(this.xSize, this.ySize);
    }
    return infos;
  }


  render(i, dir) {
    fill(this.food.color);
    rect(this.food.x, this.food.y, BLOCK_SIZE, BLOCK_SIZE);

    if (this.snakes[i].total > 1) {
      fill(this.snakes[i].color);
      this.renderSnake(i);
    }else{
      fill(25, 25, 25, 100);
      this.renderSnake(i);
    }
    if (!this.snakes[i].isDead) {
      this.snakes[i].changeDirection(dir);
      this.snakes[i].update();
    }
  }

  renderSnake(i){
    rect(this.snakes[i].x, this.snakes[i].y, BLOCK_SIZE, BLOCK_SIZE);
    for(let j = 0; j < this.snakes[i].tail.length; j++){      
      rect(this.snakes[i].tail[j].x, this.snakes[i].tail[j].y, BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  getStates() {
    let states = [];
    for (let i = 0; i < this.snakes.length; i++) {
      const snake = this.snakes[i];
      const normalizedDistanceToFood =
        this.getDistance(snake.x, snake.y, this.food.x, this.food.y) /
        this.getDistance(0, 0, this.xSize, this.ySize);
      states.push([
        snake.x / this.xSize,
        snake.y / this.ySize,
        this.food.x / this.xSize,
        this.food.y / this.ySize,
        normalizedDistanceToFood,
        snake.y / this.ySize,
        (this.ySize - snake.y) / this.ySize,
        snake.x / this.xSize,
        (this.xSize - snake.x) / this.xSize,
      ]);
    }
    return states;
  }

  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  checkEat(snake) {
    const snakeX = floor(snake.x + BLOCK_SIZE / 2);
    const snakeY = floor(snake.y + BLOCK_SIZE / 2);
    const foodX = floor(this.food.x + BLOCK_SIZE / 2);
    const foodY = floor(this.food.y + BLOCK_SIZE / 2);

    if (abs(snakeX - foodX) < BLOCK_SIZE && abs(snakeY - foodY) < BLOCK_SIZE) {  
      snake.grow();
      return true;
    }
    return false;
  }

  checkDeath(snake) {
    if (
      floor(snake.x) < BLOCK_SIZE ||
      floor(snake.x) > this.xSize - BLOCK_SIZE ||
      floor(snake.y) < BLOCK_SIZE ||
      floor(snake.y) > this.ySize - BLOCK_SIZE
    ) {
      snake.die();
      return true;
    }
    return false;
  }
}

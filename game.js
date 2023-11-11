const BLOCK_SIZE = 20; // Constant defining the size of a block in the game

class Game {
  constructor(xSize, ySize, qntd) {
    // Initialize game parameters
    this.xSize = xSize; // Width of the game area
    this.ySize = ySize; // Height of the game area
    this.frame = 0; // Frame count
    this.snake = new Snake(); // Array to store snake
    this.food = null; // Stores the food position
    this.qntd = qntd; // Quantity of snake to start with
    this.reset(); // Initialize the game
  }

  reset() {
    // Reset game state
    this.frame = 0; // Reset frame count
    this.snake = new Snake(); // Reset snake array
    let randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE)); // Random X position for snake or food
    let randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE)); // Random Y position for snake or food

    // Initialize snake in random positions
    for (let i = 0; i < this.qntd; i++) {
      randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE));
      randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE));
      this.snake = new Snake(randx, randy);
    }

    // Initialize food in a random position
    randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE));
    randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE));
    this.food = new Food(randx, randy);
  }

  step(direction) {
    // Game loop for each step
    let info;
    this.frame += 1; // Increment frame count

    let reward = 0; // Reward for the snake's action
    let gameOver = false; // Flag indicating if the game is over for the snake
    this.render(direction); // Render the game for the current snake and its direction

    // Check conditions for game over
    if (
      this.checkDeath(this.snake) ||
      this.frame > this.snake.total * 100 ||
      this.snake.isDead
    ) {
      gameOver = true; // Set game over flag
      reward = -BLOCK_SIZE; // Set negative reward
      info = [reward, gameOver]; // Store game information
    }

    // Check if the snake has eaten food
    if (this.checkEat(this.snake)) {
      reward = BLOCK_SIZE;
      this.food.update(this.xSize, this.ySize);  // Set positive reward
    }

    info = [reward, gameOver]; // Store game information

    console.log(info);
    return info; // Return game information
  }


  render(dir) {
    // Render the game for a specific snake

    // Draw the food
    fill(this.food.color);
    rect(this.food.x, this.food.y, BLOCK_SIZE, BLOCK_SIZE);

    // Render the snake
    if (this.snake.total > 1) {
      fill(this.snake.color); 
    } else {
      fill(25, 25, 25, 100);
    }

    rect(this.snake.x, this.snake.y, BLOCK_SIZE, BLOCK_SIZE);

    // Render the snake's tail segments
    for (let j = 0; j < this.snake.tail.length; j++) {
      rect(this.snake.tail.x, this.snake.tail.y, BLOCK_SIZE, BLOCK_SIZE);
    }

    if (!this.snake.isDead) {
      this.snake.changeDirection(dir); // Change the direction of the snake
      this.snake.update(); // Update the snake's position
    }
  }


  getState() {
    // Retrieve states for each snake
  
    const normalizedDistanceToFood =
      this.getDistance(this.snake.x, this.snake.y, this.food.x, this.food.y) /
      this.getDistance(0, 0, this.xSize, this.ySize);

    // Store state information for the current snake
    return [
      this.snake.x / this.xSize, // Normalized X position of the snake
      this.snake.y / this.ySize, // Normalized Y position of the snake
      this.food.x / this.xSize, // Normalized X position of the food
      this.food.y / this.ySize, // Normalized Y position of the food
      normalizedDistanceToFood, // Normalized distance to the food
      this.snake.y / this.ySize, // Ratio of snake's Y position to game height
      (this.ySize - this.snake.y) / this.ySize, // Inverted ratio of snake's Y position to game height
      this.snake.x / this.xSize, // Ratio of snake's X position to game width
      (this.xSize - this.snake.x) / this.xSize, // Inverted ratio of snake's X position to game width
    ];
}

  getDistance(x1, y1, x2, y2) {
    // Calculate Euclidean distance between two points
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  checkEat(snake) {
    // Check if a snake has eaten the food
    const snakeX = floor(snake.x + BLOCK_SIZE / 2);
    const snakeY = floor(snake.y + BLOCK_SIZE / 2);
    const foodX = floor(this.food.x + BLOCK_SIZE / 2);
    const foodY = floor(this.food.y + BLOCK_SIZE / 2);

    if (abs(snakeX - foodX) < BLOCK_SIZE && abs(snakeY - foodY) < BLOCK_SIZE) {
      snake.grow(); // Increase the snake's size
      return true; // Food eaten
    }
    return false; // Food not eaten
  }

  checkDeath(snake) {
    // Check if the snake has collided with game boundaries
    if (
      floor(snake.x) < BLOCK_SIZE ||
      floor(snake.x) > this.xSize - BLOCK_SIZE ||
      floor(snake.y) < BLOCK_SIZE ||
      floor(snake.y) > this.ySize - BLOCK_SIZE
    ) {
      snake.die(); // Mark the snake as dead
      return true; // Snake has died
    }
    return false; // Snake is alive
  }
}

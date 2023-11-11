const BLOCK_SIZE = 20; // Constant defining the size of a block in the game

class Game {
  constructor(xSize, ySize, qntd) {
    // Initialize game parameters
    this.xSize = xSize; // Width of the game area
    this.ySize = ySize; // Height of the game area
    this.frame = 0; // Frame count
    this.snakes = []; // Array to store snakes
    this.food = null; // Stores the food position
    this.qntd = qntd; // Quantity of snakes to start with
    this.reset(); // Initialize the game
  }

  reset() {
    // Reset game state
    this.frame = 0; // Reset frame count
    this.snakes = []; // Reset snakes array
    let randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE)); // Random X position for snake or food
    let randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE)); // Random Y position for snake or food

    // Initialize snakes in random positions
    for (let i = 0; i < this.qntd; i++) {
      randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE));
      randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE));
      this.snakes.push(new Snake(randx, randy));
    }

    // Initialize food in a random position
    randx = floor(random(BLOCK_SIZE, this.xSize - BLOCK_SIZE));
    randy = floor(random(BLOCK_SIZE, this.ySize - BLOCK_SIZE));
    this.food = new Food(randx, randy);
  }

  steps(directions) {
    // Game loop for each step
    let eated = false; // Flag to check if a snake has eaten food
    let infos = []; // Array to store game information for each snake

    this.frame += 1; // Increment frame count
    for (let i = 0; i < this.snakes.length; i++) {
      let reward = 0; // Reward for the snake's action
      let gameOver = false; // Flag indicating if the game is over for the snake
      this.render(i, directions[i]); // Render the game for the current snake and its direction

      // Check conditions for game over
      if (
        this.checkDeath(this.snakes[i]) ||
        this.frame > this.snakes[i].total * 100 ||
        this.snakes[i].isDead
      ) {
        gameOver = true; // Set game over flag
        reward = -BLOCK_SIZE; // Set negative reward
        infos.push([reward, gameOver, this.snakes[i].score]); // Store game information
      }

      // Check if the snake has eaten food
      if (this.checkEat(this.snakes[i])) {
        eated = true; // Set eaten flag
        reward = BLOCK_SIZE; // Set positive reward
      }

      infos.push([reward, gameOver, this.snakes[i].score]); // Store game information
    }

    if (eated) {
      this.food.update(this.xSize, this.ySize); // Update food position if eaten
    }

    return infos; // Return game information
  }


  render(i, dir) {
    // Render the game for a specific snake

    // Draw the food
    fill(this.food.color);
    rect(this.food.x, this.food.y, BLOCK_SIZE, BLOCK_SIZE);

    // Render the snake
    if (this.snakes[i].total > 1) {
      fill(this.snakes[i].color); // Set snake color
      this.renderSnake(i); // Render the snake body
    } else {
      fill(25, 25, 25, 100); // Set color for a single-block snake
      this.renderSnake(i); // Render the single-block snake
    }

    if (!this.snakes[i].isDead) {
      this.snakes[i].changeDirection(dir); // Change the direction of the snake
      this.snakes[i].update(); // Update the snake's position
    }
  }

  renderSnake(i){
    // Render the snake's body

    // Render the snake's head
    rect(this.snakes[i].x, this.snakes[i].y, BLOCK_SIZE, BLOCK_SIZE);

    // Render the snake's tail segments
    for(let j = 0; j < this.snakes[i].tail.length; j++){      
      rect(this.snakes[i].tail[j].x, this.snakes[i].tail[j].y, BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  getStates() {
    // Retrieve states for each snake
    let states = [];

    for (let i = 0; i < this.snakes.length; i++) {
      const snake = this.snakes[i];
      const normalizedDistanceToFood =
        this.getDistance(snake.x, snake.y, this.food.x, this.food.y) /
        this.getDistance(0, 0, this.xSize, this.ySize);

      // Store state information for the current snake
      states.push([
        snake.x / this.xSize, // Normalized X position of the snake
        snake.y / this.ySize, // Normalized Y position of the snake
        this.food.x / this.xSize, // Normalized X position of the food
        this.food.y / this.ySize, // Normalized Y position of the food
        normalizedDistanceToFood, // Normalized distance to the food
        snake.y / this.ySize, // Ratio of snake's Y position to game height
        (this.ySize - snake.y) / this.ySize, // Inverted ratio of snake's Y position to game height
        snake.x / this.xSize, // Ratio of snake's X position to game width
        (this.xSize - snake.x) / this.xSize, // Inverted ratio of snake's X position to game width
      ]);
    }

    return states; // Return the states for all snakes
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

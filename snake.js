

class Snake {
  constructor(x, y) {
    // Initialize snake properties
    this.x = x; // X position
    this.y = y; // Y position
    this.color = generateColor(); // Snake color
    this.score = 0; // Score of the snake
    this.xspeed = 0; // X-axis speed
    this.yspeed = 0; // Y-axis speed
    this.total = 1; // Total length of the snake
    this.tail = []; // Array to store the tail segments of the snake
    this.isDead = false; // Flag indicating if the snake is dead
  }

  update() {
    // Update the snake's position and tail

    this.x += this.xspeed; // Update X position
    this.y += this.yspeed; // Update Y position

    if (this.total > this.tail.length) {
      this.tail.push({ x: this.x, y: this.y }); // Add a new segment to the tail
    }

    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1]; // Shift tail segments
    }

    if (this.total > 0) {
      this.tail[this.total - 1] = { x: this.x, y: this.y }; // Update tail position
    }
  }

  changeDirection(dirString) {
    // if (
    //   (this.xspeed == BLOCK_SIZE && dirString == "left") ||
    //   (this.xspeed == -BLOCK_SIZE && dirString == "right") ||
    //   (this.yspeed == BLOCK_SIZE && dirString == "up") ||
    //   (this.yspeed == -BLOCK_SIZE && dirString == "down")
    // ) {
    //   this.die();
    // }
    // Change snake direction based on input
    switch (dirString) {
      case "up":
        this.xspeed = 0;
        this.yspeed = -BLOCK_SIZE;
        break;
      case "down":
        this.xspeed = 0;
        this.yspeed = BLOCK_SIZE;
        break;
      case "left":
        this.xspeed = -BLOCK_SIZE;
        this.yspeed = 0;
        break;
      case "right":
        this.xspeed = BLOCK_SIZE;
        this.yspeed = 0;
        break;
    }
  }

  die() {
    // Mark the snake as dead
    this.color = "gray"; // Change color to gray
    this.isDead = true; // Set dead flag
  }

  grow() {
    // Increase snake length and score
    this.total++; // Increment total length
    this.score += 10; // Increase score
  }

  giveScoreForWalk() {
    // Increment score for each step taken
    this.score += 0.01;
  }
}

// Generate a random color for the snake (excluding red tones)
function generateColor() {
  let r = floor(random(100)); // Random value for red component
  let g = floor(random(255)); // Random value for green component
  let b = floor(random(255)); // Random value for blue component

  // Ensure the red component isn't dominant
  if (r > g || r > b) {
    return generateColor(); // Recursively generate color until criteria met
  }

  return color(r, g, b); // Return the generated color
}

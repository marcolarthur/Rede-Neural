class Agent {
  constructor(snake) {
    this.score = 0;
    this.snake = snake;
    this.brain = new brain.NeuralNetwork({
      activation: "sigmoid",
      learningRate: 0.01,
      iterations: 1000,
    });
  }

  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  predict(foodPosition, boardWidth, boardHeight) {
    if (this.snake.isDead) return;
    const distance = this.getDistance(
      this.snake.x,
      this.snake.y,
      foodPosition[0],
      foodPosition[1]
    );

    const normalizedX = this.snake.x / boardWidth;
    const normalizedY = this.snake.y / boardHeight;
    const normalizedFoodX = foodPosition[0] / boardWidth;
    const normalizedFoodY = foodPosition[1] / boardHeight;

    let inputs = [normalizedX, normalizedY, normalizedFoodX, normalizedFoodY];
    let prediction = this.brain.run(inputs);
    let move = "";

    if (prediction[2] < 0.5) {
      move = prediction[0] < 0.5 ? "up" : "down";
    } else {
      move = prediction[0] < 0.5 ? "left" : "right";
    }

    this.snake.changeDirection(move);

    if (this.lastDistance > 0) {
      if (distance > this.lastDistance) {
        this.score -= 0.01;
      }

      if (distance < this.lastDistance) {
        this.score += 0.01;
      }

      if (distance === 0) {
        this.score += 100;
      }
    }
    this.lastDistance = distance;
  }

  trainBrain() {
    let trainingData = [];
    for (let i = 0; i < 100; i++) {
      const input1 = Math.random();
      const input2 = Math.random();
      const input3 = Math.random();
      const input4 = Math.random();

      const deltaX = input3 - input1;
      const deltaY = input4 - input2;

      let outputX = deltaX > 0 ? 1.0 : 0.0;
      let outputY = deltaY > 0 ? 1.0 : 0.0;

      let outputPriority = Math.abs(deltaX) > Math.abs(deltaY) ? 0.0 : 1.0;

      trainingData.push({
        input: [input1, input2, input3, input4],
        output: [outputX, outputY, outputPriority],
      });
    }

    this.brain.train(trainingData);
  }
}

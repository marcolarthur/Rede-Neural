const BATCH_SIZE = 1000;

class Agent {
  constructor() {
    this.n_games = 0;
    this.epsilon = 0;
    this.gamma = 0.9;
    this.score = 0;
    this.memory = [];
    this.brain = new brain.NeuralNetwork({
      activation: "sigmoid",
      learningRate: 0.01,
      iterations: 1000,
    });
  }

  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  getState(food, snake, boardWidth, boardHeight) {
    const distance = this.getDistance(
      snake.x,
      snake.y,
      food.x,
      food.y
    );
  
    const maxPossibleDistance = this.getDistance(0, 0, boardWidth, boardHeight);
    const normalizedDistanceToFood = distance / maxPossibleDistance;
  
    const distanceToTop = snake.y;
    const distanceToBottom = boardHeight - snake.y;
    const distanceToLeft = snake.x;
    const distanceToRight = boardWidth - snake.x;
  
    const normalizedX = snake.x / boardWidth;
    const normalizedY = snake.y / boardHeight;
    const normalizedFoodX = food.x / boardWidth;
    const normalizedFoodY = food.y / boardHeight;
  
    return [
      normalizedX,
      normalizedY,
      normalizedFoodX,
      normalizedFoodY,
      normalizedDistanceToFood,
      distanceToTop / boardHeight,
      distanceToBottom / boardHeight,
      distanceToLeft / boardWidth,
      distanceToRight / boardWidth
    ];
  }
  
  train(){
    const randomTrainingData = Array.from({ length: 1 }, () => ({
      input: Array.from({ length: 9 }, () => Math.random()),
      output: Array.from({ length: 4 }, () => Math.random()),
    }));

    this.brain.train(randomTrainingData);
  }
  getAction(state) {
    this.epsilon = 80 - this.n_games;
    const directions = ['left', 'right', 'up', 'down'];
    let chosenDirection;
  
    if (Math.floor(Math.random() * 200) < this.epsilon) {
      chosenDirection = directions[Math.floor(Math.random() * 4)];
    } else {
      let prediction = this.brain.run(state);
      let moveIndex = prediction.indexOf(Math.max(...prediction));
      chosenDirection = directions[moveIndex];
    }
  
    return chosenDirection;
  }
  
  remember(state, dir, reward, nextState, done){ // Corrected typo 'remeber' to 'remember'
    this.memory.push([state, dir, reward, nextState, done]); // Adjusted pushing the data into memory
  }

  trainLongMemory() {
    if (this.memory.length > BATCH_SIZE) {
      let miniSample = this.memory.sort(() => Math.random() - 0.5).slice(0, BATCH_SIZE);
  
      let states = [];
      let actions = [];
      let rewards = [];
      let nextStates = [];
      let dones = [];
    
      miniSample.forEach((sample) => {
        let [state, action, reward, nextState, done] = sample;
        states.push(state);
        actions.push(action);
        rewards.push(reward);
        nextStates.push(nextState);
        dones.push(done);
      });
  
      this.trainStep(states, actions, rewards, nextStates, dones);
    }
  }

  trainStep(states, actions, rewards, nextStates, dones) {
    const randomTrainingData = Array.from({ length: 1 }, () => ({
      input: Array.from({ length: 9 }, () => Math.random()),
      output: Array.from({ length: 4 }, () => Math.random()),
    }));

    this.brain.train(randomTrainingData);
  }
}

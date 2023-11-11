// Map numerical actions to their corresponding direction strings
const actionMap = {
  0: "left",
  1: "right",
  2: "up",
  3: "down",
};

class Agent {
  constructor() {
    this.Q = {}; // Q-table to store Q-values
    this.alpha = 0.1; // learning rate
    this.gamma = 0.3; // discount factor
    this.epsilon = 0.4; // exploration rate
    this.lastStates = null; // Store the last observed states
    this.lastActions = null; // Store the last chosen actions
    this.record = 0; // Record the highest achieved score
  }

  // Choose actions based on current states, either explore or exploit Q-values
  chooseActions(states) {
    const actions = [];
    for (const state of states) {
      const stateStr = JSON.stringify(state);
      if (Math.random() < this.epsilon || !this.Q[stateStr]) {
        actions.push(floor(random(0, 4))); // Random action if unexplored or based on exploration rate
      } else {
        actions.push(
          Object.keys(this.Q[stateStr]).reduce((a, b) =>
            this.Q[stateStr][a] > this.Q[stateStr][b] ? a : b
          ) // Exploit the Q-values to choose the best action
        );
      }
    }
    this.lastStates = states.map((state) => JSON.stringify(state)); // Store current states
    this.lastActions = actions; // Store chosen actions
    return actions;
  }

  // Update Q-values based on rewards and next states observed
  updateQ(rewards, nextStates) {
    for (let i = 0; i < this.lastStates.length; i++) {
      const currentState = this.lastStates[i];
      const action = this.lastActions[i];
      const reward = rewards[i];
      const nextStateStr = JSON.stringify(nextStates[i]);

      if (!this.Q[currentState]) {
        this.Q[currentState] = { [action]: 0 }; // Initialize Q-value for the state-action pair
      }
      if (!this.Q[nextStateStr]) {
        this.Q[nextStateStr] = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Initialize Q-values for next state
      }

      const oldValue = this.Q[currentState][action] || 0;
      const maxValue = Math.max(...Object.values(this.Q[nextStateStr])); // Calculate maximum Q-value for next state
      this.Q[currentState][action] =
        oldValue + this.alpha * (reward + this.gamma * maxValue - oldValue); // Update Q-value
    }
  }

  // Update the displayed records and top scores on the screen
  writeOnScreen(scores) {
    let div = document.getElementById("div");
    div.innerHTML = `Record score: ${this.record.toFixed(0)}`; // Display the highest recorded score
  
    let sortedScores = scores.slice().sort((a, b) => b - a); // Sort the scores in descending order
    let topScores = sortedScores.slice(0, 20); // Grab the top 20 scores
    
    let div2 = document.getElementById("div2");
    div2.innerHTML = "Top 20: <br>"; // Header for the top scores list
    for (let i = 0; i < topScores.length; i++) {
      div2.innerHTML += `${i + 1}: ${topScores[i].toFixed(0)}<br>`; // Display the top scores
    }
  }

  // Train the agent using the game environment
  train(game) {
    const currentStates = game.getStates(); // Obtain current states from the game
    const actions = this.chooseActions(currentStates).map(
      (num) => actionMap[num] // Map numerical actions to their corresponding directions
    );
    const steps = game.steps(actions); // Take actions in the game and get results
    const rewards = steps.map(([reward, gameOver, score]) => reward); // Extract rewards from the steps
    const nextStates = game.getStates(); // Get the next observed states
    this.updateQ(rewards, nextStates); // Update Q-values based on observed rewards and next states

    const scores = steps.map(([reward, gameOver, score]) => score); // Extract scores from the steps
    const currentMaxScore = Math.max(...scores); // Find the maximum score in the current steps
    if (currentMaxScore > this.record) {
      this.record = currentMaxScore; // Update the record if a new maximum score is achieved
    }
    this.writeOnScreen(scores); // Update the displayed scores on the screen

    const gameOvers = steps.map(([reward, gameOver, score]) => gameOver); // Extract game over statuses
    if (gameOvers.every((gameOver) => gameOver)) {
      game.reset(); // Reset the game if all game overs are observed
    }
  }
}

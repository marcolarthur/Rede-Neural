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
    this.lastStates = null;
    this.lastActions = null;
    this.record = 0;
  }

  chooseActions(states) {
    const actions = [];
    for (const state of states) {
      const stateStr = JSON.stringify(state);
      if (Math.random() < this.epsilon || !this.Q[stateStr]) {
        actions.push(floor(random(0, 4)));
      } else {
        actions.push(
          Object.keys(this.Q[stateStr]).reduce((a, b) =>
            this.Q[stateStr][a] > this.Q[stateStr][b] ? a : b
          )
        );
      }
    }
    this.lastStates = states.map((state) => JSON.stringify(state));
    this.lastActions = actions;
    return actions;
  }

  updateQ(rewards, nextStates) {
    for (let i = 0; i < this.lastStates.length; i++) {
      const currentState = this.lastStates[i];
      const action = this.lastActions[i];
      const reward = rewards[i];
      const nextStateStr = JSON.stringify(nextStates[i]);

      if (!this.Q[currentState]) {
        this.Q[currentState] = { [action]: 0 };
      }
      if (!this.Q[nextStateStr]) {
        this.Q[nextStateStr] = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Assuming 4 directions
      }

      const oldValue = this.Q[currentState][action] || 0;
      const maxValue = Math.max(...Object.values(this.Q[nextStateStr]));
      this.Q[currentState][action] =
        oldValue + this.alpha * (reward + this.gamma * maxValue - oldValue);
    }
  }

  writeOnScreen(scores) {
    let div = document.getElementById("div");
    div.innerHTML = `Record score: ${this.record.toFixed(0)}`;
  
    let sortedScores = scores.slice().sort((a, b) => b - a); // Sort the scores in descending order
    let topScores = sortedScores.slice(0, 20); // Grab the top 10 scores
    
    let div2 = document.getElementById("div2");
    div2.innerHTML = "Top 20: <br>";
    for (let i = 0; i < topScores.length; i++) {
      div2.innerHTML += `${i + 1}: ${topScores[i].toFixed(0)}<br>`;
    }
  }

  train(game) {
    const currentStates = game.getStates();
    const actions = this.chooseActions(currentStates).map(
      (num) => actionMap[num]
    );
    const steps = game.steps(actions);
    const rewards = steps.map(([reward, gameOver, score]) => reward);
    const nextStates = game.getStates();
    this.updateQ(rewards, nextStates);

    const scores = steps.map(([reward, gameOver, score]) => score);
    const currentMaxScore = Math.max(...scores);
    if (currentMaxScore > this.record) {
      this.record = currentMaxScore;
    }
    this.writeOnScreen(scores);

    const gameOvers = steps.map(([reward, gameOver, score]) => gameOver);
    if (gameOvers.every((gameOver) => gameOver)) {
      game.reset();
    }
  }
}
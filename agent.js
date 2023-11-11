
const actionMap = {
  0: "left",
  1: "right",
  2: "up",
  3: "down",
};

class Agent {
  constructor() {
    this.Q = {};
    this.alpha = 0.1;
    this.gamma = 0.3;
    this.epsilon = 0.4;
    this.lastState = null;
    this.lastAction = null;
    this.record = 0;
  }


  chooseAction(state) {
    let action;
    const stateStr = JSON.stringify(state);
    if (Math.random() < this.epsilon || !this.Q[stateStr]) {
      action = floor(random(0, 4));
    } else {
      action =
        Object.keys(this.Q[stateStr]).reduce((a, b) =>
          this.Q[stateStr][a] > this.Q[stateStr][b] ? a : b
        )
    }

    this.lastState = JSON.stringify(state);
    this.lastAction = action;
    return action;
  }


  updateQ(reward, nextState) {

    const nextStateStr = JSON.stringify(nextState);

    if (!this.Q[this.lastState]) {
      this.Q[this.lastState] = { [this.lastAction]: 0 };
    }
    if (!this.Q[nextStateStr]) {
      this.Q[nextStateStr] = { 0: 0, 1: 0, 2: 0, 3: 0 };
    }

    const oldValue = this.Q[this.lastState][this.lastAction] || 0;
    const maxValue = Math.max(...Object.values(this.Q[nextStateStr]));
    this.Q[this.lastState][this.lastAction] =
      oldValue + this.alpha * (reward + this.gamma * maxValue - oldValue);

  }


  writeOnScreen(score, currentState, action, step, reward, nextState) {
    const scoreEl = document.getElementById("score");
    scoreEl.innerHTML = `Score: ${score}`;
    const recordEl = document.getElementById("record");
    recordEl.innerHTML = `Record: ${this.record}`;
    const currentStateEl = document.getElementById("currentState");
    currentStateEl.innerHTML = `Current State: ${currentState}`;
    const actionEl = document.getElementById("action");
    actionEl.innerHTML = `Action: ${action}`;
    const stepEl = document.getElementById("step");
    stepEl.innerHTML = `Step: ${step}`;
    const rewardEl = document.getElementById("reward");
    rewardEl.innerHTML = `Reward: ${reward}`;
    const nextStateEl = document.getElementById("nextState");
    nextStateEl.innerHTML = `Next State: ${nextState}`;
    const qEl = document.getElementById("qTable");
    qEl.innerHTML = `Q-Table: ${JSON.stringify(this.Q[this.lastState])}`;
  }


  train(game) {
    const currentState = game.getState();
    const action = actionMap[this.chooseAction(currentState)];
    const step = game.step(action);
    const reward = step[0];
    const nextState = game.getState();
    this.updateQ(reward, nextState);

    this.writeOnScreen(reward, currentState, action, step[1], reward, nextState);

    const gameOver = step[1];
    if (gameOver) {
      game.reset();
    }
  }
}

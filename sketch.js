let fullWidth = window.innerWidth - 100;
let fullHeight = window.innerHeight - 100;
let game;
let agent;
let record = 0;

function setup() {
  game = new Game(0, 0, fullWidth, fullHeight);
  agent = new Agent();
  agent.train()
  createCanvas(fullWidth, fullHeight);
}

function restart() {
  game.reset();
}

function draw() {
  background(255);
  const stateOld = agent.getState(game.food, game.snakes[0], game.xSize, game.ySize);
  const finalMove = agent.getAction(stateOld);
  const step = game.step(finalMove);
  const stateNew = agent.getState(game.food, game.snakes[0], game.xSize, game.ySize);

  const reward = step[0];
  const gameOver =  step[1];
  const score =  step[2];
  agent.remember(stateOld, finalMove, reward, stateNew, gameOver);

  if (gameOver) {
    game.reset();
    agent.n_games++;
    agent.trainLongMemory();

    if (score > record) {
      record = score;      
    }

    console.log(`Game ${agent.n_games}, Score: ${score.toFixed(1)}, Record: ${record.toFixed(1)}`);
  }
}

function writeOnScreen() {
  let div = document.getElementById("div");
  div.innerHTML = ""; // Clear the previous content.

  // Find the highest score among agents.
  let highestScore = -1;
  for (let i = 0; i < agents.length; i++) {
    if (agents[i].score > highestScore) {
      highestScore = agents[i].score;
    }
  }

  for (let i = 0; i < agents.length; i++) {
    let agentDiv = document.createElement("div"); // Create a new <div> element.
    agentDiv.textContent = i + 1 + ": ";
    agentDiv.textContent += floor(agents[i].score);

    if (agents[i].score === highestScore) {
      agentDiv.textContent += " <<";
    }

    if (agents[i].snake.isDead) {
      agentDiv.textContent += " dead";
    }

    div.appendChild(agentDiv); // Append the agent's <div> to the main div.
  }
}

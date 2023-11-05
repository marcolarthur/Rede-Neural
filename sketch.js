let numOfAgents = 10;
let fullWidth = window.innerWidth - 100;
let fullHeight = window.innerHeight - 100;
let board;
let agents = [];

function setup() {
  board = new Board(0, 0, fullWidth, fullHeight, numOfAgents);
  for (let i = 0; i < numOfAgents; i++) {
    let snake = board.getSnake(i);
    let agent = new Agent(snake);
    agent.trainBrain();
    agents.push(agent);
  }
  createCanvas(fullWidth, fullHeight);
}

function restart() {
  board = new Board(0, 0, fullWidth, fullHeight, numOfAgents);
  agents = [];
  for (let i = 0; i < numOfAgents; i++) {
    let snake = board.getSnake(i);
    let agent = new Agent(snake);
    agent.trainBrain();
    agents.push(agent);
  }
  createCanvas(fullWidth, fullHeight);
}

function draw() {
  writeOnScreen();
  let allSnakesDead = agents.every((agent) => agent.snake.isDead);

  if (allSnakesDead) {
    restart();
  } else {
    background(0);
    board.update();
    board.draw();
    for (let i = 0; i < agents.length; i++) {
      agents[i].predict(board.getFoodPosition(), fullWidth, fullHeight);
    }
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

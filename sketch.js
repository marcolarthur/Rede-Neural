//const state = game.getState(0);
// const move = agent.getAction(state);
//const [gameOver, score] = game.step(move());


let fullWidth = 1000;
let fullHeight = 900;
let game;
let agent;
let qntdAgents = 1000;

function setup() {
  game = new Game(fullWidth, fullHeight, qntdAgents);
  agent = new Agent();
  createCanvas(fullWidth, fullHeight);
  frameRate(15);
}

function restart() {
  game.reset();
}


function draw() {
  background(0);
  agent.train(game);
}

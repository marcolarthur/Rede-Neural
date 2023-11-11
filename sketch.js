// Define variables to set the width and height of the game canvas
let fullWidth = 1000;
let fullHeight = 900;

// Initialize game and agent variables
let game;
let agents = [];
let qntdAgents = 1000; // Number of agents in the game

function setup() {
  // Create a new game with the specified width, height, and number of agents
  game = new Game(fullWidth, fullHeight, qntdAgents);

  // Initialize a single agent
  for (let i = 0; i < qntdAgents; i++) {
    agents.push(new Agent());
  }

  // Create a canvas with the specified width and height
  createCanvas(fullWidth, fullHeight);

  // Set the frame rate of the animation
  frameRate(15);
}

// Function to reset the game
function restart() {
  game.reset(); // Reset the game state
}

function draw() {
  background(0); // Set the background color to black

  for (let i = 0; i < qntdAgents; i++) {
    agents[i].train(game);
  }
}

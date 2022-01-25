class Snake {
  constructor(id) {
    this.id = id;
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 0;
    this.ydir = 0;
    this.len = 0;
    this.energy = 50;
    this.color = color(0, 0, 100);
    this.dna = null;
    this.score = 0;
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    if (this.energy > 0) {
      this.energy -= 1 + Math.floor(this.len * 0.01);
      let head = this.body[this.body.length - 1].copy();
      this.body.shift();
      head.x += this.xdir;
      head.y += this.ydir;
      this.body.push(head);
    }
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x > w - 1) {
      this.body[this.body.length - 1].x = 0;
    }
    if (x < 0) {
      this.body[this.body.length - 1].x = w;
    }
    if (y > h - 1) {
      this.body[this.body.length - 1].y = 0;
    }
    if (y < 0) {
      this.body[this.body.length - 1].y = h;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x == x && part.y == y) {
        this.energy = 0;
        this.body = [];
        this.body[0] = createVector(floor(w / 2), floor(h / 2));
        this.len = 0;
        break;
      }
    }
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x.toFixed(0);
    let y = this.body[this.body.length - 1].y.toFixed(0);
    if (Math.abs(x - pos.x) < 2 && Math.abs(y - pos.y) < 2) {
      this.grow();
      this.score += 1;
      this.energy += 25 + 0.9 * this.score;
      return true;
    }
    return false;
  }

  show(biggest) {
    for (const bd of this.body) {
      if (biggest) {
        this.color.setAlpha(255);
      } else {
        this.color.setAlpha(this.score);
      }
      this.color.setRed(this.energy);
      fill(this.color);
      rect(bd.x, bd.y, 1, 1);
    }
  }
}

let snakes = [];
let rez = 10;
let foods = [];
let w;
let h;
let cont = 0;
let net;
let maxScore = 0;
let idMaxScore = 0;
let popSize = 1000;
let prevScore = 1;
let gen = 1;

function setup() {
  net = new brain.NeuralNetwork({
    activation: "sigmoid", // activation function
    hiddenLayers: [4],
    learningRate: 0.1,
    iterations: 6,
  });
  createCanvas(400, 400);
  w = floor(width / rez);
  h = floor(height / rez);
  //frameRate(5);
  for (let i = 0; i < popSize; i++) {
    let x = floor(random(w));
    let y = floor(random(h));
    let snake = new Snake(i);
    train();
    snake.dna = net.toJSON();
    snakes.push(snake);
    foods.push(createVector(x, y));
  }
}

function writeOnScreen() {
  let div = document.getElementById("scores");
  div.innerHTML =
    "actual best score: " +
    maxScore +
    "<br/>" +
    "best score: " +
    prevScore +
    "<br/>" +
    "generation: " +
    gen +
    "<br/>";
  // for (const snk of snakes) {
  //   div.innerHTML += snk.id + ": " + snk.score + "<br/>";
  // }
}

async function draw() {
  noStroke();
  scale(rez);
  background(220);
  let activeSnakes = snakes.filter((sn) => sn.energy > 0);
  if (activeSnakes.length == 0) {
    if (maxScore > prevScore) {
      prevScore = maxScore;
      maxScore = 0;
      let dna = snakes.find((snake) => snake.id == idMaxScore);
      repopulate(dna);
      idMaxScore = undefined;
    } else {
      repopulate();
    }
    activeSnakes = snakes;
  }
  for await (const snake of activeSnakes) {
    let index = snake.id;
    if (snake.score > maxScore) {
      maxScore = snake.score;
      idMaxScore = snake.id;
    }
    if (snake.id == idMaxScore) {
      snake.show(true);
    } else {
      snake.show(false);
    }
    if (snake.eat(foods[index])) {
      foods[index] = foodLocation();
    }
    fill(snake.color);
    ellipse(foods[index].x, foods[index].y, 1, 1);
    snake.update();
    snake.endGame();
    net.fromJSON(snake.dna);
    let x = net.run([
      snake.body[snake.body.length - 1].x / w,
      snake.body[snake.body.length - 1].y / h,
      foods[index].x / w,
      foods[index].y / h,
    ]);
    let arr = [x.left, x.right, x.down, x.up];
    x = arr.indexOf(Math.max(...arr));
    if (x == 0) {
      snake.setDir(-1, 0);
    }
    if (x == 1) {
      snake.setDir(1, 0);
    }
    if (x == 2) {
      snake.setDir(0, 1);
    }
    if (x == 3) {
      snake.setDir(0, -1);
    }
  }
  writeOnScreen();
}

function repopulate(dna) {
  gen++;
  let tempNet = new brain.NeuralNetwork();
  if (dna != undefined) {
    tempNet.fromJSON(dna.dna);
    for (let i = 0; i < popSize; i++) {
      let snake = new Snake(i);
      snake.dna = tempNet.toJSON();
      // if(i % Math.floor(Math.random() * 2) == 0) {
      //   console.log("Mutate");
      //   for (let l = 1; l < snake.dna.layers.length; l++) {
      //     snake.dna.layers[l].weights.forEach(wei => {
      //       for (let m = 0; m < wei.length; m++) {
      //         wei[m] *= Math.random();
      //       }
      //     });
      //   }
      // }
      snakes[i] = snake;
    }
  } else {
    for (let l = 0; l < foods.length; l++) {
      foods[l] = foodLocation();
    }
  }
  for (const sn of snakes) {
    sn.energy = 50;
    sn.score = 0;
  }
  maxScore = 0;
}

function train() {
  let r = Math.random();
  let r1 = Math.random();
  let r2 = Math.random();
  let r3 = Math.random();
  net.train([
    {
      input: [r, 0, r, 1], // any top to bottom
      output: { down: 1 },
    },
    {
      input: [0, r1, 1, r1], // any left to right
      output: { right: 1 },
    },
    {
      input: [1, r2, 0, r2], // any right to left
      output: { left: 1 },
    },
    {
      input: [r3, 1, r3, 0], // any bottom to top
      output: { up: 1 },
    },
    {
      input: [r, 0.4, r, 0.6], // any top to bottom
      output: { down: 1 },
    },
    {
      input: [0.4, r1, 0.6, r1], // any left to right
      output: { right: 1 },
    },
    {
      input: [0.6, r2, 0.4, r2], // any right to left
      output: { left: 1 },
    },
    {
      input: [r3, 0.6, r3, 0.4], // any bottom to top
      output: { up: 1 },
    },
  ]);
}

function foodLocation() {
  let x = floor(random(w) + 1);
  let y = floor(random(h) + 1);
  return createVector(x, y);
}

class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = generateColor();
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 1;
    this.tail = [];
    this.brain = new brain.NeuralNetwork({
      activation: "sigmoid", // activation function
      hiddenLayers: [4],
      learningRate: 0.01,
      iterations: 1000,
      inputSize: 4,
      outputSize: 1,
    });
  }


  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    if (this.total > this.tail.length) {
      this.tail.push([this.x, this.y]);
    } else {
      this.tail.unshift([this.x, this.y]);
      this.tail.pop();
    }
  }

  changeDirection(dirString) {
    if (
      (this.xspeed == 1 && dirString == "left") ||
      (this.xspeed == -1 && dirString == "right") ||
      (this.yspeed == 1 && dirString == "up") ||
      (this.yspeed == -1 && dirString == "down")
    ) {
      return;
    }
    switch (dirString) {
      case "up":
        this.xspeed = 0;
        this.yspeed = -1;
        break;
      case "down":
        this.xspeed = 0;
        this.yspeed = 1;
        break;
      case "left":
        this.xspeed = -1;
        this.yspeed = 0;
        break;
      case "right":
        this.xspeed = 1;
        this.yspeed = 0;
        break;
    }
  }

  checkDeath() {
    for (const bodyPart of this.tail) {
      if (this.x == bodyPart[0] && this.y == bodyPart[1]) {
        return true;
      }
    }
    return false;
  }

  checkEat(food){
    if(this.x == food.x && this.y == food.y){
      this.total++;
      return true;
    }
    return false;
  }

  trainBrain() {
    let inputs = [];
    let outputs = [];
    let dataSet = loadTable("dataSet.csv", "csv", "header");
    for (let i = 0; i < dataSet.getRowCount(); i++) {
      inputs.push(dataSet.getRow(i).arrays[0]);
      outputs.push(dataSet.getRow(i).arrays[1]);
    }
    this.brain.train(inputs, outputs);
  }
}

//generate colors except red tones
function generateColor() {
    let r = floor(random(100));
    let g = floor(random(255));
    let b = floor(random(255));
    if (r > g || r > b) {
        return generateColor();
    }
    return color(r, g, b);
}

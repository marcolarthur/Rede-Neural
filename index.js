require('./algoritmoGenetico.js')();

var inc = 0;


//criar um neuronio
var neuronio = function(inputs, pesos) {
  //entradas do neuronio
  this.inputs = inputs;
  for (var i = 0; i < inputs.length; i++) {
    gravarAlgoritmo('i', inputs[i], inc);
  }

  //pesos do neuronio
  this.pesos = [];
  let aux;
  if (pesos == undefined) {
    for (var i = 0; i < this.inputs.length; i++) {
      aux = gerarNumeroAleatorio(-1, 1);
      this.pesos.push(aux);
      gravarAlgoritmo('p', aux, inc);
    }
  }else{
    this.pesos = pesos;
  }

  //somatorio das entradas (entrada N * peso N)
  this.somatorio = 0;
  for (var i = 0; i < this.inputs.length; i++) {
    this.somatorio += this.inputs[i] * this.pesos[i];
    gravarAlgoritmo('o', this.somatorio, inc);
  }


  //saida neuronio
  this.output = sigmoide(this.somatorio);

      inc++;
}

//criar uma camada (vetor de neuronios) a partir de um vetor de entradas
var camada = function(inputs, quantidadeNeuronios) {
  this.neuronios = [];
  for (var i = 0; i < quantidadeNeuronios; i++) {
    for (var j = 0; j < inputs.length; j++) {
      this.neuronios.push(new neuronio(inputs[j]))
    }
  }
}

//criar uma nova camada a partir de uma camada anterior
function criarNovaCamada(camadaParametro) {
  let saidasCamadaBase = [];
  let vetorEntradasProxCamada = [];
  for (var i = 0; i < camadaParametro.neuronios.length; i++) {
    saidasCamadaBase.push(camadaParametro.neuronios[i].output);
  }
  vetorEntradasProxCamada.push(saidasCamadaBase);
  return new camada(vetorEntradasProxCamada, saidasCamadaBase.length);
}

//função ativadora do neuronio
function sigmoide(x) {
    return 1 / ( 1 + Math.pow(Math.E, -x));
}

//gera um numero aleatorio entre o MIN e o MAX (MIN e MAX inclusos)
function gerarNumeroAleatorio(min, max) {
  return Math.random() * (max - min + 1) + min;
}

//gera uma saida da rede de tamanho "quantidadeCamadas" a partir de um vetor de entradas
function gerarSaidaRede(vetorEntradas, quantidadeCamadas) {
  //Printa no terminal as entradas
  console.log("Entradas: " + vetorEntradas);
  let entradaFinal = [];
  entradaFinal.push(vetorEntradas);

  //cria uma camada base para rede ser construida
  let camadaBase = new camada(entradaFinal, 3);

  //cria um vetor redeNeural para ser preenchido com camadas (vetor de neuronios)
  let redeNeural = [];
  redeNeural.push(camadaBase); //coloca a camada base dentro da rede

  //preenche a redeNeural com camadas
  for (var i = 1; i < quantidadeCamadas; i++) {
    redeNeural.push(criarNovaCamada(redeNeural[i-1]));
  }

  //extrai a saida da ultima camada da rede
  let saidaRedeNeural = [];
  for (var i = 0; i < redeNeural[redeNeural.length-1].neuronios.length; i++) {
    saidaRedeNeural.push(redeNeural[redeNeural.length-1].neuronios[i].output);
  }

  //cria um ultimo neuronio para gerar apenas uma saida
  let ultimoNeuronio = new neuronio(saidaRedeNeural);

  let saidaFinal = [];

  //define para qual direção a saida final sera setada a partir da saida do ultimo neuronio
  if (ultimoNeuronio.output < 0.25) {
    saidaFinal.push("UP");
  }else if (ultimoNeuronio.output > 0.25 && ultimoNeuronio.output < 0.5) {
    saidaFinal.push("DOWN");
  }else if (ultimoNeuronio.output > 0.5 && ultimoNeuronio.output < 0.75) {
    saidaFinal.push("LEFT");
  }else if (ultimoNeuronio.output > 0.75) {
    saidaFinal.push("RIGHT");
  }else {
    saidaFinal.push("INVALIDO");
  }
  console.log("Saida: " + saidaFinal);
  return saidaFinal;
}

let entradaSnake = [1,2,3];
console.log(gerarSaidaRede(entradaSnake)); 


module.exports = function () {
  this.gerarOutput = function (vet) {
    let entradaSnake = [1,2,3];
    entradaSnake.push(vet)
    return gerarSaidaRede(entradaSnake);
  }
}

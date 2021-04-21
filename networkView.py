import numpy as np
import random
import math
from NeuralNetwork import Network

n_inputs, hidden_layers_length, n_neurons, n_outputs = 2, 5, 4, 2
network = Network(n_inputs, hidden_layers_length, n_neurons, n_outputs)


print("\ninputlayer: \n" + str(network.inputLayer.weights))
for i in range(hidden_layers_length):
    print("\nhiddenLayers" + str(i+1) +":\n" + str(network.hiddenLayers[i].weights))
print("\noutputLayer: \n" + str(network.outputLayer.weights))
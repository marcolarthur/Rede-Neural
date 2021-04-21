import numpy as np
import random


class Network(object):
    def __init__(self, n_inputs, hidden_layers_length, n_neurons, n_outputs):
        self.inputLayer = Layer(n_inputs, n_inputs)
        self.hiddenLayers = []
        for i in range(hidden_layers_length):
            if i == 0:
                layer = Layer(n_inputs, n_neurons)
                self.hiddenLayers.append(layer)
            elif i == hidden_layers_length - 1:
                layer = Layer(n_neurons, n_outputs)
                self.hiddenLayers.append(layer)
            else:
                layer = Layer(n_neurons, n_neurons)
                self.hiddenLayers.append(layer)
        self.outputLayer = Layer(n_outputs, n_outputs)

    def train(self, inputs, targets, n_iterarions):
        for i in range(n_iterarions):
            rnd_index = random.randint(0, len(inputs)-1)
            predict = self.forward(inputs[rnd_index])
            if(i % 100 == 0):
                print('\nPredict , Target: ')
                print((predict, targets[rnd_index]))
                print('\nDistancia: ')
                print(targets[rnd_index] - predict)
            self.backprop(inputs[rnd_index], targets[rnd_index], 0.2)
        with open("inW.csv", 'w') as in_weight_file:
            np.savetxt(in_weight_file, self.inputLayer.weights, fmt='%.3f')
        for i in range(len(self.hiddenLayers)):
            with open("hiddenW" + str(i) + ".csv", 'w') as hidden_weight_file:
                np.savetxt(hidden_weight_file, self.hiddenLayers[i].weights, fmt='%.3f')
        with open("outW.csv", 'w') as out_weight_file:
            np.savetxt(out_weight_file, self.outputLayer.weights, fmt='%.3f')


    def forward(self, inputs):
        self.inputLayer.forward(inputs)
        self.inputLayer.active()
        for i in range(len(self.hiddenLayers)):
            if i == 0:
                self.hiddenLayers[i].forward(self.inputLayer.output)
            else:
                self.hiddenLayers[i-1].active()
                self.hiddenLayers[i].forward(self.hiddenLayers[i-1].output)
        self.hiddenLayers[-1].active()
        self.outputLayer.forward(self.hiddenLayers[-1].output)
        self.outputLayer.active(activation_type='softmax')
        return self.outputLayer.output

    def backprop(self, inputs, target, learning_rate):
        output_errors = (np.array(target).reshape(1, 2) - self.outputLayer.output)
        output_gradient = self.outputLayer.output * (1 - self.outputLayer.output)
        output_gradient = output_gradient * output_errors * learning_rate
        delta_output = output_gradient * np.transpose(self.hiddenLayers[-1].output)
        hiddenLayer_errors = []
        hidden_gradients = []
        hidden_deltas = []
        cont = 0
        for i in reversed(range(len(self.hiddenLayers))):
            hidden_gradient = self.hiddenLayers[i].output * (1 - self.hiddenLayers[i].output)
            if i == (len(self.hiddenLayers) - 1):
                hiddenLayer_errors.append(np.dot(output_errors, np.transpose(self.outputLayer.weights)))
                hidden_gradient = hidden_gradient * hiddenLayer_errors[0] * learning_rate
                delta_hidden = np.dot(hidden_gradient, np.transpose(self.hiddenLayers[i-1].output))
                hidden_deltas.append(delta_hidden)
                hidden_gradients.append(hidden_gradient)
            else:
                hiddenLayer_weights_transpose = np.transpose(self.hiddenLayers[i+1].weights)
                hiddenLayer_errors.append(np.dot(hiddenLayer_weights_transpose, hiddenLayer_errors[cont-1]))
                hidden_gradient = hidden_gradient * hiddenLayer_errors[cont-1] * learning_rate
                delta_hidden = hidden_gradient * np.transpose(self.hiddenLayers[i-1].output)
                hidden_deltas.append(delta_hidden)   
                hidden_gradients.append(hidden_gradient)             
            cont+=1
        inputLayer_errors = np.transpose(self.hiddenLayers[0].weights) * hiddenLayer_errors[-1]
        input_gradient = self.inputLayer.output * (1 - self.inputLayer.output)
        input_gradient = input_gradient * inputLayer_errors * learning_rate
        delta_input = input_gradient * np.transpose(inputs)
        cont = 0
        for i in reversed(range(len(self.hiddenLayers))):
            self.hiddenLayers[i].weights = self.hiddenLayers[i].weights + hidden_deltas[cont]
            self.hiddenLayers[i].biases = self.hiddenLayers[i].biases + hidden_gradients[cont]
            cont+=1
        self.outputLayer.weights += delta_output
        self.inputLayer.weights += delta_input
        self.outputLayer.biases += output_gradient
        self.inputLayer.biases += input_gradient
            

class Layer:
    def __init__(self, n_inputs, n_neurons):
        self.weights = 0.10 * np.random.randn(n_inputs, n_neurons)
        self.biases = np.ones((1, n_neurons))
    def forward(self, inputs):
        self.output = np.dot(inputs, self.weights) + self.biases        
    def active(self, activation_type='relu'):
        if(activation_type == 'softmax'):
            exp_values = np.exp(self.output - np.max(self.output, axis=1, keepdims=True))
            self.output = exp_values / np.sum(exp_values, axis=1, keepdims=True)    
        else:
            self.output = np.maximum(0, self.output)
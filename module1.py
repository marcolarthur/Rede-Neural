from sklearn import linear_model, model_selection, metrics, neural_network
import pandas as pd
import numpy as np

norm = 0.01 / 6
with open('dataset2.csv', 'r') as dataset_file:
    dataset = np.loadtxt(dataset_file).reshape(8,3)
X = dataset[0:, :2]
X = X
targets = dataset[0:, 2:]



x_train, x_test, y_train, y_test = model_selection.train_test_split(X, targets, train_size=4, test_size=4)
print(x_train)
print(x_test)
print(y_train)
print(y_test)

regr = neural_network.MLPRegressor(max_iter=5000,  activation='relu')
regr.fit(x_train, y_train)

# Validação
regr.predict(x_test[:4])

# Acurácia
print(regr.score(x_test, y_test))


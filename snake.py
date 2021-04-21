import pygame
import time
import random
from NeuralNetwork import Network
import numpy as np
from sklearn import linear_model, model_selection, metrics, neural_network

pygame.init()

white = (255, 255, 255)
yellow = (255, 255, 102)
black = (0, 0, 0)
red = (213, 50, 80)
green = (0, 255, 0)
blue = (50, 153, 213)
 
dis_width = 600
dis_height = 400
 
dis = pygame.display.set_mode((dis_width, dis_height))
pygame.display.set_caption('Snake Game by Edureka')
 
clock = pygame.time.Clock()
 
snake_block = 10
snake_speed = 15
norm = 0.01 / 6
 
font_style = pygame.font.SysFont("bahnschrift", 25)
score_font = pygame.font.SysFont("comicsansms", 35)


n_inputs, hidden_layers_length, n_neurons, n_outputs = 4, 5, 4, 2

network = Network(n_inputs, hidden_layers_length, n_neurons, n_outputs)
with open('dataset.csv', 'r') as dataset_file:
    dataset = np.loadtxt(dataset_file).reshape(16,6)
X = dataset[0:, :4]
X = X * norm
targets = dataset[0:, 4:]
network.train(X, targets, 100)


 
def Your_score(score):
    value = score_font.render("Your Score: " + str(score), True, yellow)
    dis.blit(value, [0, 0])
 
 
def our_snake(snake_block, snake_list):
    for x in snake_list:
        pygame.draw.rect(dis, black, [x[0], x[1], snake_block, snake_block])
 
 
def message(msg, color):
    mesg = font_style.render(msg, True, color)
    dis.blit(mesg, [dis_width / 6, dis_height / 3])
 
 
def gameLoop():
    game_over = False
 
    x1 = dis_width / 2
    y1 = dis_height / 2
 
    x1_change = 0
    y1_change = 0
 
    snake_List = []
    Length_of_snake = 1

    x1_change = -snake_block
 
    foodx = round(random.randrange(0, dis_width - snake_block) / 10.0) * 10.0
    foody = round(random.randrange(0, dis_height - snake_block) / 10.0) * 10.0
    
    while not game_over:

        network.train(X, targets, 100)
        
        move = network.forward(np.array([x1 * norm, y1 * norm, foodx * norm, foody * norm]))[0]
        # print(move)
        moveY = round(move[0] * 2) / 2
        moveX = round(move[1] * 2) / 2

        if moveX == 0.0:
            x1_change = -snake_block
        if moveX == 1.0:
            x1_change = snake_block
        if moveY == 0.0:
            y1_change = -snake_block
        if moveY == 1.0:
            y1_change = snake_block

        if x1 >= dis_width or x1 < 0 or y1 >= dis_height or y1 < 0:
            x1 = round(random.randrange(0, dis_width) / 10.0) * 10.0
            y1 = round(random.randrange(0, dis_height) / 10.0) * 10.0
        x1 += x1_change
        y1 += y1_change
        dis.fill(blue)
        pygame.draw.rect(dis, green, [foodx, foody, snake_block, snake_block])
        snake_Head = []
        snake_Head.append(x1)
        snake_Head.append(y1)
        snake_List.append(snake_Head)
        if len(snake_List) > Length_of_snake:
            del snake_List[0]

        our_snake(snake_block, snake_List)
        Your_score(Length_of_snake - 1)
 
        pygame.display.update()
 
        if x1 == foodx and y1 == foody:
            foodx = round(random.randrange(0, dis_width - snake_block) / 10.0) * 10.0
            foody = round(random.randrange(0, dis_height - snake_block) / 10.0) * 10.0
            Length_of_snake += 1
 
        clock.tick(snake_speed)
 
    quit()
 
 
gameLoop()
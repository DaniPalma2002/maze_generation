import numpy as np
from tkinter import *

# the maze will be a list of nodes
# each node will have a list of walls

MAZE_SIZE = 10

class node:
    def __init__(self):
        self.state = 0
        self.wall = np.array([1,1,1,1]) # [top, right, bottom, left]

    def __repr__(self) -> str:
        return f'({self.state}|{self.wall})'


def gui_print(maze):
    maze = maze.reshape(MAZE_SIZE, MAZE_SIZE)
    win = Tk()
    text = Text(win)
    text.pack()

    for i in maze:
        for j in i:
            text.insert(END, j)
        text.insert(END, '\n')

    win.mainloop()





if __name__ == "__main__":
    maze = np.ndarray(shape=(MAZE_SIZE*MAZE_SIZE,),dtype=object) # type: np.ndarray
    for i in range(len(maze)):
        maze[i] = node()

    gui_print(maze)


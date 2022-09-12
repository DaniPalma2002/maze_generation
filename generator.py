from telnetlib import STATUS
import numpy as np

# the maze will be a list of nodes
# each node will have a list of walls

MAZE_SIZE = 10

class node:
    def __init__(self):
        self.state = 0
        self.wall = np.array([1,1,1,1]) # [top, right, bottom, left]

    def __repr__(self) -> str:
        return f'({self.state}|{self.wall})'




if __name__ == "__main__":
    maze = np.ndarray(shape=(MAZE_SIZE*MAZE_SIZE,),dtype=object) # type: np.ndarray
    for i in range(len(maze)):
        maze[i] = node()

    print(maze)


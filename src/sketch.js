// Daniel Pereira
// Growing Tree algorithm

const CELL_SIZE = 20; // px
const ROWS = 10;
const COLS  = 10;
var grid = []; // matrix
var queue = []; // backtracking queue
var current; // current cell being visited

function setup() {
    createCanvas(COLS*CELL_SIZE, ROWS*CELL_SIZE);

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var node = new Node(j, i);
            grid.push(node);
        }
    }
    current = grid[get_random_int(0, grid.length)]
    console.log(current.neighbours())
    //console.log(current.neighbours)
    
    
}

// function that loops
function draw() {
    background(50);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    current.state = 1
}


function Node(i, j) {
    this.i = i;
    this.j = j;
    this.state = 0 // if is visited
    this.wall = [1,1,1,1] // top, right, bottom, left
    this.grid_place = this.j * ROWS + this.i


    this.show = function() {
        var x = this.i * CELL_SIZE;
        var y = this.j * CELL_SIZE;
        stroke(200);
        //strokeWeight(1);
        var padding = CELL_SIZE*1
        //rect(x, y, CELL_SIZE, CELL_SIZE);
        if (this.wall[0] == 1) line(x, y, x + padding, y); // top
        if (this.wall[1] == 1) line(x + padding, y, x + padding, y + padding); // right 
        if (this.wall[2] == 1) line(x, y + padding, x + padding, y + padding); // bottom
        if (this.wall[3] == 1) line(x, y, x, y + padding); // left
        if (this.state == 1)  {
            //circle(x + padding/2, y + padding/2, 5)
            //noStroke()
            fill(10, 41, 66)
            rect(x, y, padding, padding)
        }
    }

    this.neighbours = function() {
        n_col = [this.grid_place-COLS, this.grid_place+COLS];
        n_col = n_col.filter(item => (item > 0  && grid[item].i == this.i && grid[item].state == 0))
        n_row = [this.grid_place-1, this.grid_place+1]
        n_row = n_row.filter(item => (item > 0  && grid[item].j == this.j && grid[item].state == 0))
        return n_col.concat(n_row)
    }

}

function choose_element_of_queue(bias, grid) {
    return 0
}

// return int random between min (inclusive) and max (exclusive)
function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Daniel Pereira
// Growing Tree algorithm

const CELL_SIZE = 30; // px
const ROWS = 20;
const COLS  = 20;
var grid = [];

function setup() {
    createCanvas(COLS*CELL_SIZE, ROWS*CELL_SIZE);

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var node = new Node(j, i);
            grid.push(node);
        }
    }
}

function draw() {
    background(150);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }
}


function Node(i, j) {
    this.i = i;
    this.j = j;
    this.state = 0 // if is visited
    this.wall = [1,1,1,1] // top, right, bottom, left

    this.show = function() {
        var x = this.i * CELL_SIZE;
        var y = this.j * CELL_SIZE;
        stroke(50);
        strokeWeight(1.5);
        var padding = CELL_SIZE*0.95
        //rect(x, y, CELL_SIZE, CELL_SIZE);
        if (this.wall[0] == 1) line(x, y, x + padding, y); // top
        if (this.wall[1] == 1) line(x + padding, y, x + padding, y + padding); // right 
        if (this.wall[2] == 1) line(x, y + padding, x + padding, y + padding); // bottom
        if (this.wall[3] == 1) line(x, y, x, y + padding); // left
    }

}
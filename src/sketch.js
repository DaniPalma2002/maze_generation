// Daniel Pereira
// Growing Tree algorithm

const CELL_SIZE = 20; // px
const ROWS = 10;
const COLS  = 10;
var grid = []; // matrix
var queue = []; // backtracking queue
var current; // current cell being visited
var bias_list = ['N', 'R', 'O']; // N - Recursive backtracker - newest
                                // R - Prim - random
                                // O - Oldest

function setup() {
    createCanvas(COLS*CELL_SIZE, ROWS*CELL_SIZE);
    frameRate(1)

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var node = new Node(j, i);
            grid.push(node);
        }
    }
    // choose first node
    current = grid[/*get_random_int(0, grid.length)*/0]
    //console.log(grid[10].neighbours())
    queue.push(current.grid_place)
    current.state = 1
    

    //next_node = choose_node(bias)
    
    
}

// function that loops
function draw() {
    //background(50);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    carve_path();

    
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

        var n_col = [this.grid_place-COLS, this.grid_place+COLS];
        //console.log('col1', n_col)
        n_col = n_col.filter(item => (item > 0  && item < grid.length))
        var n_col2 = []
        for (var i = 0; i < n_col.length; i++) {
            index = n_col[i]
            if (grid[index].i == this.i && grid[index].state == 0)
                n_col2.push(index)
        }
        //console.log('col2', n_col)

        n_row = [this.grid_place-1, this.grid_place+1]
        n_row = n_row.filter(item => (item > 0  && item < grid.length))
        //grid[item].j == this.j && grid[item].state == 0
        n_row2 = []
        for (var i = 0; i < n_row.length; i++) {
            index = n_row[i]
            if (grid[index].j == this.j && grid[index].state == 0)
                n_row2.push(index)
        }



        a = n_col.concat(n_row)
        //console.log('a' , a)
        return shuffle_array(a)
    }

}

function choose_element_of_queue(bias) {
    if (bias == 'N') return (queue.length - 1)
}

// return int random between min (inclusive) and max (exclusive)
function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function shuffle_array(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}


function carve_path() {
    
    index = choose_element_of_queue(bias_list[0]) // index of queue
    //console.log(index)
    current = queue[index]
    console.log(current)
    n = grid[current].neighbours() 
    console.log(n)
    if (!(n.length === 0)) {
        next_node = n[0]
        //console.log(grid[next_node].neighbours())
        grid[next_node].state = 1
        queue.push(next_node)
    }
    else {
        queue.splice(index, 1)
    }
    console.log('----')
}

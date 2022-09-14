// Daniel Pereira
// Growing Tree algorithm

const CELL_SIZE = 20; // px
const ROWS = 50;
const COLS  = 50;
var grid = []; // matrix
var queue = []; // backtracking queue
var current; // current cell being visited
var next_node;
var bias_list = ['N', 'R', 'O']; // N - Recursive backtracker - newest
                                // R - Prim - random
                                // O - Oldest

function setup() {
    createCanvas(COLS*CELL_SIZE, ROWS*CELL_SIZE);
    //frameRate(10)

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var node = new Node(j, i);
            grid.push(node);
        }
    }

    // choose first node
    current = grid[/*get_random_int(0, grid.length)*/0].grid_place
    //console.log(grid[10].neighbours())
    queue.push(current)
    grid[current].state = 1
    //grid[current].wall[1] = 0
    //current.wall[1] = 0
    

    //next_node = choose_node(bias)
    
    
}

// function that loops
function draw() {
    background(0);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    //grid[1].wall[1] = 0
    if (queue.length === 0) noLoop()
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
        strokeWeight(1.5);
        var padding = CELL_SIZE*1
        //rect(x, y, CELL_SIZE, CELL_SIZE);
        if (this.wall[0] == 1) line(x, y, x + padding, y); // top
        if (this.wall[1] == 1) line(x + padding, y, x + padding, y + padding); // right 
        if (this.wall[2] == 1) line(x, y + padding, x + padding, y + padding); // bottom
        if (this.wall[3] == 1) line(x, y, x, y + padding); // left
        /*if (this.state == 1)  {
            //circle(x + padding/2, y + padding/2, 5)
            
            fill(10, 41, 66)
            circle(x, y)
            //rect(x, y, padding, padding)
        }*/
        //console.log(this.wall)
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



        a = n_col2.concat(n_row2)
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
    
    var index = choose_element_of_queue(bias_list[0]) // index of queue
    //console.log(index)
    if (queue.length == 0) return
    current = queue[index]
    //console.log('curr',current)
    //console.log('queue',queue.length)
    n = grid[current].neighbours() 
    //console.log('state',grid[current].state)
    //console.log(n)
    if (!(n.length === 0)) {
        next_node = n[0]
        //console.log('n [0] state',grid[next_node].state)
        grid[next_node].state = 1
        //grid[next_node].wall[1] = 0
        var curr_wall, next_wall;
        [curr_wall, next_wall] = remove_walls(current, next_node)
        if (!(curr_wall == 0 && next_wall == 0)) {
            grid[current].wall[curr_wall] = 0
            grid[next_node].wall[next_wall] = 0
        }
        queue.push(next_node)
        //return [curr_wall, next_wall]
    }
    else {
        //console.log('remove', index)
        queue.splice(index, 1)
        //return []
        //console.log('queue rem',queue.length)
    }
    //console.log('----')
}


function keyPressed() {
    noLoop();
}

function remove_walls(curr, next) {
    // find what walls to remove between current and next_node
    //console.log('curr, next', current, next_node)
    if (curr == next-1) { // right
        //console.log('yes')
        return [1, 3]

    }
    else if (curr == next+1) { // left
        return [3, 1]
    }
    else if (curr - COLS == next) { // top
        return [0, 2]
    }
    else if (curr + COLS == next) { // left
        return [2, 0]
    }
    return [0, 0]
    
}
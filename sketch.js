// Daniel Pereira
// Growing Tree algorithm

var CELL_SIZE = 20; // px
var ROWS = 10;
var COLS  = 10;
var grid = []; // matrix
var queue = []; // backtracking queue
var current; // current cell being visited
var next_node;
var bias_list = ['N', 'R', 'O', 'M', 'N/R(75/25)']; 
    // N - Recursive backtracker - newest
    // R - Prim - random
    // O - Oldest
    // M - Middle
    // N/R(75/25) Newest/Random, 75/25 split
var bias = bias_list[0]

var theme = [255, 10, 2] // background, stroke color, stroke weight


document.getElementById("submit").onclick = function() {
    var row_input = int(document.getElementById("row_input").value)
    var col_input = int(document.getElementById("col_input").value)
    var url = URL_add_parameter(location.href, 'rows', row_input.toString())
    url = URL_add_parameter(url, 'cols', col_input.toString())
    console.log(url)
    window.location = url
}


function setup() {
    
    // get params from url
    var url = window.location.search;
    //console.log(url)
    var urlParams = new URLSearchParams(url)
    var row_param = urlParams.get('rows')
    var col_param = urlParams.get('cols')
    //console.log(row_param == null)
    if (!(row_param == null)) ROWS = int(row_param)
    if (!(col_param == null)) COLS = int(col_param)
    //console.log(ROWS, COLS)
    createCanvas(COLS*CELL_SIZE, ROWS*CELL_SIZE);
    

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var node = new Node(j, i);
            grid.push(node);
        }
    }

    // choose first node
    current = grid[floor(random(grid.length))].grid_place
    queue.push(current)
    grid[current].state = 1

}

// function that loops
function draw() {
    background(theme[0]);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    
    if (queue.length === 0) {
        noLoop()
        choose_start_and_end()
    }
    carve_path();
    
    
}

//------------------------------------------------------------------------------


function Node(i, j) {
    this.i = i;
    this.j = j;
    this.state = 0 // if is visited
    this.wall = [1,1,1,1] // top, right, bottom, left
    this.grid_place = this.j * COLS + this.i //index in grid
    this.number_of_neighbours = 0

    this.show = function() {
        var x = this.i * CELL_SIZE;
        var y = this.j * CELL_SIZE;
        stroke(theme[1]);
        strokeWeight(theme[2]);
        var padding = CELL_SIZE*1
        if (this.wall[0] == 1) line(x, y, x + padding, y); // top
        if (this.wall[1] == 1) line(x + padding, y, x + padding, y + padding); // right 
        if (this.wall[2] == 1) line(x, y + padding, x + padding, y + padding); // bottom
        if (this.wall[3] == 1) line(x, y, x, y + padding); // left
        /*if (this.state == 1)  {
        }*/
    }

    this.neighbours = function() {
        // first check if is a valid index and then check if neighbour is in the same 
        // col/row and has not been visited

        var n_col = [this.grid_place-COLS, this.grid_place+COLS];
        n_col = n_col.filter(item => (item >= 0  && item < grid.length))
        n_col = n_col.filter(item => (grid[item].i == this.i && grid[item].state == 0))

        var n_row = [this.grid_place-1, this.grid_place+1]
        n_row = n_row.filter(item => (item >= 0  && item < grid.length))
        n_row = n_row.filter(item => (grid[item].j == this.j && grid[item].state == 0))
   
        a = n_col.concat(n_row)
        this.number_of_neighbours = a.length
        // no unvisited neighbours
        if (a.length === 0) return -1

        rand = floor(random(0, a.length))
        return a[rand]
    }

    this.number_of_walls = function() {
        var count = 0
        var arr = this.wall
        arr.forEach(i => (i === 1 && count++))
        return count
    }

}

function choose_element_of_queue() {
    if (bias == 'N') return (queue.length - 1)
    else if (bias == 'R') return floor(random(queue.length))
    else if (bias == 'O') return 0
    else if (bias == 'M') return floor((queue.length-1)/2)
    else if (bias == 'N/R(75/25)') {
        rnd = floor(random(1, 5))
        if (rnd == 1) return floor(random(queue.length))
        else return (queue.length - 1)
    }
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
    
    var index = choose_element_of_queue(bias) // index of queue
    
    if (queue.length == 0) return
    current = queue[index]
    //console.log(current)
    n = grid[current].neighbours()
    
    if (!(n == -1)) {
        
        next_node = n;
        
        grid[next_node].state = 1
        var curr_wall, next_wall;
        [curr_wall, next_wall] = remove_walls(current, next_node)
        if (!(curr_wall == 0 && next_wall == 0)) {
            grid[current].wall[curr_wall] = 0
            grid[next_node].wall[next_wall] = 0
        }
        queue.push(next_node)
        
    }
    else {
        // no unvisited neighbours, remove from queue
        if (bias == bias_list[0]) {
            queue.pop()
        } 
        queue.splice(index, 1)
    }
}


function keyPressed() {
    if (keyCode === ESCAPE) noLoop();
}

function remove_walls(curr, next) {
    // find what walls to remove between current and next_node
    if (curr == next-1) { // right
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
    // protection measure, not supposed to happen
    return [0, 0]
    
}

function URL_add_parameter(url, param, value){
    var hash       = {};
    var parser     = document.createElement('a');

    parser.href    = url;

    var parameters = parser.search.split(/\?|&/);

    for(var i=0; i < parameters.length; i++) {
        if(!parameters[i])
            continue;

        var ary      = parameters[i].split('=');
        hash[ary[0]] = ary[1];
    }

    hash[param] = value;

    var list = [];  
    Object.keys(hash).forEach(function (key) {
        list.push(key + '=' + hash[key]);
    });

    parser.search = '?' + list.join('&');
    return parser.href;
}

function choose_start_and_end() {
    //let start = 0
    let end = grid.length-1
    //let n_flag = false
    fill(0, 255, 0)
    noStroke()
    ellipse(CELL_SIZE/2, CELL_SIZE/2, CELL_SIZE/2)

    // find a dead end
    for (var k=grid.length-1; k >= 0; k--) {
        //console.log(grid[k].number_of_walls(), k)
        if (grid[k].i > floor(COLS/1.7) && grid[k].j > floor(ROWS/1.7)) {
            //console.log('b')
            if (grid[k].number_of_walls() == 3) {
                //console.log('c', k)
                fill(255, 0, 0)
                let end_i = grid[k].i * CELL_SIZE
                let end_j = grid[k].j * CELL_SIZE
                ellipse(end_i + CELL_SIZE/2, end_j + CELL_SIZE/2, CELL_SIZE/2)
                //n_flag = true
                return
            }
        }
    }
    //if (!n_flag){
    let end_i = grid[end].i * CELL_SIZE
    let end_j = grid[end].j * CELL_SIZE

    fill(255, 0, 0)
    //console.log('a')
    ellipse(end_i + CELL_SIZE/2, end_j + CELL_SIZE/2, CELL_SIZE/2)
    //} 
}
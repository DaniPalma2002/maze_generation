// Daniel Pereira
// Growing Tree algorithm
const CELL_SIZE = 15; // px
const ROWS = Math.round(window.innerHeight / CELL_SIZE);
const COLS = Math.round(window.innerWidth / CELL_SIZE);
const grid = []; // matrix
const queue = []; // backtracking queue

let current; // current cell being visited
let next_node;

const bias_list = [
	"Recursive Backtracker(newest)",
	"Prim(random)",
	"Oldest",
	"Middle",
	"Newest/Random(75/25)",
];
// neighbour - Recursive backtracker - newest
// R - Prim - random
// O - Oldest
// M - Middle
// neighbour/R(75/25) Newest/Random, 75/25 split
let bias = bias_list[0];

const theme = [200, 10, 1.5]; // background, stroke color, stroke weight

function setup() {
	frameRate(120);

	createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);

	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLS; j++) {
			let node = new Node(j, i);
			grid.push(node);
		}
	}

	// choose first node
	current = grid[floor(random(grid.length))].grid_place;
	queue.push(current);
	grid[current].state = 1;

}

// function that loops
function draw() {
	background(theme[0]);
	// draw maze
	for (let i = 0; i < grid.length; i++) {
		if (grid[i].update == true)
			grid[i].show();
	}
	// while generating maze
	if (queue.length !== 0) carve_path();

	if (queue.length === 0) {
		noLoop()
	}
}

//------------------------------------------------------------------------------

class Node {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.state = 0; // if is visited
		this.wall = [1, 1, 1, 1]; // top, right, bottom, left
		this.grid_place = this.j * COLS + this.i; //index in grid
		this.number_of_neighbours = 0;
		this.update = false;

		this.show = function () {
			let x = this.i * CELL_SIZE;
			let y = this.j * CELL_SIZE;
			stroke(0,50,100);
			strokeWeight(10);
			let padding = CELL_SIZE * 1;
			if (this.wall[0] == 1)
				line(x, y, x + padding, y); // top
			if (this.wall[1] == 1)
				line(x + padding, y, x + padding, y + padding); // right
			if (this.wall[2] == 1)
				line(x, y + padding, x + padding, y + padding); // bottom
			if (this.wall[3] == 1)
				line(x, y, x, y + padding); // left
		};

		this.neighbours = function () {
			// return a random unvisited neighbour
			let n_col = [this.grid_place - COLS, this.grid_place + COLS]
				.filter((item) => item >= 0 && item < grid.length 
						&& grid[item].i == this.i && grid[item].state == 0);	

			let n_row = [this.grid_place - 1, this.grid_place + 1]
				.filter((item) => item >= 0 && item < grid.length
						&& grid[item].j == this.j && grid[item].state == 0);		

			let a = n_col.concat(n_row);

			this.number_of_neighbours = a.length;
			// no unvisited neighbours
			if (a.length === 0)
				return -1;

			let rand = floor(random(0, a.length));
			return a[rand];
		};
	}
}

function choose_element_of_queue() {
	switch (bias) {
	case bias_list[0]: return queue.length - 1;
	case bias_list[1]: return floor(random(queue.length));
	case bias_list[2]: return 0;
	case bias_list[3]: return floor((queue.length - 1) / 2);
	case bias_list[4]: 
		if (floor(random(1, 5)) == 1) 
			return floor(random(queue.length));
		else 
			return queue.length - 1;
	}
}

function carve_path() {
	let index = choose_element_of_queue(bias); // index of queue

	if (queue.length == 0) return;
	current = queue[index];
	neighbour = grid[current].neighbours();

	if (!(neighbour == -1)) {
		grid[neighbour].state = 1;
		let curr_wall, next_wall;
		[curr_wall, next_wall] = remove_walls(current, neighbour);
		if (!(curr_wall == 0 && next_wall == 0)) {
			grid[current].wall[curr_wall] = 0;
			grid[neighbour].wall[next_wall] = 0;
			grid[current].update = true;
			grid[neighbour].update = true;
		}
		
		queue.push(neighbour);
	} else {
		// no unvisited neighbours, remove from queue
		if (bias == bias_list[0]) {
			queue.pop();
		} else {
			queue.splice(index, 1);
		}
	}
}

function remove_walls(curr, next) {
	// find what walls to remove between current and next_node
	if (curr == next - 1) {
		// right
		return [1, 3];
	} else if (curr == next + 1) {
		// left
		return [3, 1];
	} else if (curr - COLS == next) {
		// top
		return [0, 2];
	} else if (curr + COLS == next) {
		// left
		return [2, 0];
	}
	// protection measure, not supposed to happen
	return [0, 0];
}

function keyPressed() {
	// if keycode escape -> noLoop
	if (keyCode === 27) {
		noLoop();
	}
	// if keycode space -> reset
	if (keyCode === 32) {
		setup();
	}
}


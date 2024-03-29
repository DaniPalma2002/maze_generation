// Daniel Pereira
// Growing Tree algorithm

var CELL_SIZE = 20; // px
var ROWS = 10;
var COLS = 10;
var grid = []; // matrix
var queue = []; // backtracking queue

var current; // current cell being visited
var next_node;

var manual_current; // current cell manually visited
var manual_prev;
var forwards = true; // flag for manual maze solving

var bias_list = [
	"Recursive Backtracker(newest)",
	"Prim(random)",
	"Oldest",
	"Middle",
	"Newest/Random(75/25)",
];
// N - Recursive backtracker - newest
// R - Prim - random
// O - Oldest
// M - Middle
// N/R(75/25) Newest/Random, 75/25 split
var bias = bias_list[0];

var theme = [255, 10, 1.5]; // background, stroke color, stroke weight

var end; // destination of maze
var is_generated = false; // flag to check if can start solving the maze

var dropdown = document.getElementById("alg_sel");
for (var i = 0; i < bias_list.length; i++) {
	var opt = bias_list[i];
	var el = document.createElement("option");
	el.textContent = opt;
	el.value = i;
	dropdown.appendChild(el);
}

// when click button to generate maze
document.getElementById("submit").onclick = function () {
	var row_input = document.getElementById("row_input").value;
	var col_input = document.getElementById("col_input").value;
	var cell_input = document.getElementById("cell_input").value;
	var wall_input = document.getElementById("wall_input").value;
	var alg_input = document.getElementById("alg_sel");
	var alg_value = alg_input.value;

	if (
		check_valid_input(row_input) &&
		check_valid_input(col_input) &&
		check_valid_input(cell_input) &&
		check_valid_input(wall_input)
	) {
		row_input = int(row_input);
		col_input = int(col_input);
		cell_input = int(cell_input);
		wall_input = int(wall_input);
		var url = URL_add_parameter(
			location.href,
			"rows",
			row_input.toString()
		);
		url = URL_add_parameter(url, "cols", col_input.toString());
		url = URL_add_parameter(url, "cell", cell_input.toString());
		url = URL_add_parameter(url, "wall", wall_input.toString());
		url = URL_add_parameter(url, "alg", alg_value.toString());
		window.location = url;
	}
};
// click enter to click button
var row_input = document.getElementById("row_input");
row_input.addEventListener("keyup", () => {
	if (keyCode === 13) {
		submit.click();
	}
});
var col_input = document.getElementById("col_input");
col_input.addEventListener("keyup", () => {
	if (keyCode === 13) {
		submit.click();
	}
});
var cell_input = document.getElementById("cell_input");
cell_input.addEventListener("keyup", () => {
	if (keyCode === 13) {
		submit.click();
	}
});
var wall_input = document.getElementById("wall_input");
wall_input.addEventListener("keyup", () => {
	if (keyCode === 13) {
		submit.click();
	}
});

function setup() {
	// get params from url
	var url = window.location.search;
	var urlParams = new URLSearchParams(url);
	var row_param = urlParams.get("rows");
	var col_param = urlParams.get("cols");
	var cell_param = urlParams.get("cell");
	var wall_param = urlParams.get("wall");
	var alg_param = urlParams.get("alg");
	if (!(row_param == null)) {
		ROWS = int(row_param);
		document.getElementById("row_input").value = row_param;
	}
	if (!(col_param == null)) {
		COLS = int(col_param);
		document.getElementById("col_input").value = col_param;
	}
	if (!(cell_param == null)) {
		CELL_SIZE = int(cell_param);
		document.getElementById("cell_input").value = cell_param;
	}
	if (!(wall_param == null)) {
		theme[2] = int(wall_param);
		document.getElementById("wall_input").value = wall_param;
	}
	if (!(alg_param == null)) {
		bias = bias_list[int(alg_param)];
		dropdown.value = int(alg_param);
	}
	//bias = bias_list[int(alg_param)]
	//dropdown.value = int(alg_param)

	createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);

	for (var i = 0; i < ROWS; i++) {
		for (var j = 0; j < COLS; j++) {
			var node = new Node(j, i);
			grid.push(node);
		}
	}

	// choose first node
	current = grid[floor(random(grid.length))].grid_place;
	queue.push(current);
	grid[current].state = 1;

	manual_current = grid[0];
	manual_current.manual_visited = 1;
}

// function that loops
function draw() {
	background(theme[0]);
	// draw maze
	for (var i = 0; i < grid.length; i++) {
		grid[i].show();
	}

	// while generating maze
	if (queue.length !== 0) carve_path();

	if (queue.length === 0) {
		//noLoop()
		is_generated = true;
		choose_start_and_end();
	}

	// solving the maze
	if (is_generated === true) {
		//console.log(manual_current.grid_place, end)
		// check win
		if (check_win()) {
			console.log("end");
			noLoop();
			/*for (var i = 0; i < grid.length; i++)
                console.log(i, grid[i].prev_neigh_for_line().grid_place)*/
		}
		automatic_manual_solver();
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
		// used to solve maze after generated
		this.manual_visited = 0;

		this.show = function () {
			var x = this.i * CELL_SIZE;
			var y = this.j * CELL_SIZE;
			stroke(theme[1]);
			strokeWeight(theme[2]);
			var padding = CELL_SIZE * 1;
			if (this.wall[0] == 1)
				line(x, y, x + padding, y); // top
			if (this.wall[1] == 1)
				line(x + padding, y, x + padding, y + padding); // right
			if (this.wall[2] == 1)
				line(x, y + padding, x + padding, y + padding); // bottom
			if (this.wall[3] == 1)
				line(x, y, x, y + padding); // left
			if (this.manual_visited == 1 && this.grid_place !== 0) {
				//fill(0,255,255)
				let prev_neigh = this.prev_neigh_for_line();
				console.log(prev_neigh);
				for (let neigh in prev_neigh) {
					let x1 = neigh.i * CELL_SIZE;
					let y1 = neigh.j * CELL_SIZE;
					fill(0, 0, 255);
					line(
						x1 + CELL_SIZE / 2,
						y1 + CELL_SIZE / 2,
						this.i * CELL_SIZE + CELL_SIZE / 2,
						this.j * CELL_SIZE + CELL_SIZE / 2
					);
				}
				circle(x + CELL_SIZE / 2, y + CELL_SIZE / 2, 10);
				if (this.grid_place == manual_current.grid_place) {
					fill(0, 0, 255);
					circle(x + CELL_SIZE / 2, y + CELL_SIZE / 2, 10);
				}
			}
		};

		this.neighbours = function () {
			// first check if is a valid index and then check if neighbour is in the same
			// col/row and has not been visited
			var n_col = [this.grid_place - COLS, this.grid_place + COLS];
			n_col = n_col.filter((item) => item >= 0 && item < grid.length);
			n_col = n_col.filter(
				(item) => grid[item].i == this.i && grid[item].state == 0
			);

			var n_row = [this.grid_place - 1, this.grid_place + 1];
			n_row = n_row.filter((item) => item >= 0 && item < grid.length);
			n_row = n_row.filter(
				(item) => grid[item].j == this.j && grid[item].state == 0
			);

			a = n_col.concat(n_row);

			this.number_of_neighbours = a.length;
			// no unvisited neighbours
			if (a.length === 0)
				return -1;

			rand = floor(random(0, a.length));
			return a[rand];
		};

		this.all_neighbours_with_path = function () {
			var a = [];
			if (this.wall[0] == 0)
				a.push(this.grid_place - COLS);
			if (this.wall[1] == 0)
				a.push(this.grid_place + 1);
			if (this.wall[2] == 0)
				a.push(this.grid_place + COLS);
			if (this.wall[3] == 0)
				a.push(this.grid_place - 1);

			return a;
		};

		this.prev_neigh_for_line = function () {
			var a = this.all_neighbours_with_path();

			for (var i = 0; i < a.length; i++) {
				if (grid[a[i]].manual_visited == 0) {
					//console.log(this.grid_place, i)
					a.splice(i, 1);
				}
			}
			return a;
		};

		this.number_of_walls = function () {
			var count = 0;
			var arr = this.wall;
			arr.forEach((i) => i === 1 && count++);
			return count;
		};
		// places with multiple possible paths
		this.is_stop_node = function () {
			return (
				this.number_of_walls() === 3 ||
				this.number_of_walls() === 1 ||
				this.number_of_walls() === 0
			);
		};

		this.index_to_wall_pos = function (index) {
			if (index == 0)
				// top
				return this.grid_place - COLS;
			if (index == 1)
				// right
				return this.grid_place + 1;
			if (index == 2)
				// bottom
				return this.grid_place + COLS;
			if (index == 3)
				// left
				return this.grid_place - 1;
		};
	}
}

function choose_element_of_queue() {
	if (bias == bias_list[0]) return queue.length - 1;
	else if (bias == bias_list[1]) return floor(random(queue.length));
	else if (bias == bias_list[2]) return 0;
	else if (bias == bias_list[3]) return floor((queue.length - 1) / 2);
	else if (bias == bias_list[4]) {
		rnd = floor(random(1, 5));
		if (rnd == 1) return floor(random(queue.length));
		else return queue.length - 1;
	}
}

// return int random between min (inclusive) and max (exclusive)
function get_random_int(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle_array(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

function carve_path() {
	var index = choose_element_of_queue(bias); // index of queue

	if (queue.length == 0) return;
	current = queue[index];
	//console.log(current)
	n = grid[current].neighbours();

	if (!(n == -1)) {
		next_node = n;

		grid[next_node].state = 1;
		var curr_wall, next_wall;
		[curr_wall, next_wall] = remove_walls(current, next_node);
		if (!(curr_wall == 0 && next_wall == 0)) {
			grid[current].wall[curr_wall] = 0;
			grid[next_node].wall[next_wall] = 0;
		}
		queue.push(next_node);
	} else {
		// no unvisited neighbours, remove from queue
		if (bias == bias_list[0]) {
			queue.pop();
		}
		queue.splice(index, 1);
	}
}

function keyPressed() {
	if (keyCode === ESCAPE) noLoop();
	if (
		is_generated === true &&
		(manual_current.is_stop_node() || manual_current.grid_place == 0)
	) {
		if (keyCode === UP_ARROW) solve_maze(0);
		if (keyCode === DOWN_ARROW) solve_maze(2);
		if (keyCode === RIGHT_ARROW) solve_maze(1);
		if (keyCode === LEFT_ARROW) solve_maze(3);
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

function URL_add_parameter(url, param, value) {
	var hash = {};
	var parser = document.createElement("a");

	parser.href = url;

	var parameters = parser.search.split(/\?|&/);

	for (var i = 0; i < parameters.length; i++) {
		if (!parameters[i]) continue;

		var ary = parameters[i].split("=");
		hash[ary[0]] = ary[1];
	}

	hash[param] = value;

	var list = [];
	Object.keys(hash).forEach(function (key) {
		list.push(key + "=" + hash[key]);
	});

	parser.search = "?" + list.join("&");
	return parser.href;
}

function choose_start_and_end() {
	end = grid.length - 1;
	fill(0, 255, 0);
	noStroke();
	ellipse(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2);

	// find a dead end
	for (var k = grid.length - 1; k >= 0; k--) {
		if (grid[k].i > floor(COLS / 1.7) && grid[k].j > floor(ROWS / 1.7)) {
			if (grid[k].number_of_walls() == 3) {
				fill(255, 0, 0);
				let end_i = grid[k].i * CELL_SIZE;
				let end_j = grid[k].j * CELL_SIZE;
				end = k;
				ellipse(
					end_i + CELL_SIZE / 2,
					end_j + CELL_SIZE / 2,
					CELL_SIZE / 2
				);
				return;
			}
		}
	}
	let end_i = grid[end].i * CELL_SIZE;
	let end_j = grid[end].j * CELL_SIZE;

	fill(255, 0, 0);
	//console.log('a')
	ellipse(end_i + CELL_SIZE / 2, end_j + CELL_SIZE / 2, CELL_SIZE / 2);
	//}
}

function check_valid_input(str) {
	if (str === "") {
		return false;
	}
	if (!isNaN(str)) {
		return true;
	}
	return false;
}

function bias_index() {
	for (var i = 0; i < bias_list.length; i++)
		if (bias_list[i] === bias) return i;
}

function solve_maze(index) {
	if (manual_current.wall[index] === 0) {
		let manual_next = grid[manual_current.index_to_wall_pos(index)];

		// go back
		if (manual_next.manual_visited == 1) {
			manual_current.manual_visited = 0;
			forwards = false;
		}

		manual_prev = manual_current;

		manual_current = manual_next;

		// go to unvisited cells
		if (manual_current.manual_visited == 0) {
			manual_current.manual_visited = 1;
			forwards = true;
		}
	}
}

function automatic_manual_solver() {
	//console.log(manual_current.grid_place)
	if (manual_current.grid_place == 0) {
		if (manual_current.all_neighbours_with_path().length == 1) {
			manual_prev = manual_current;
			manual_current = grid[manual_prev.all_neighbours_with_path()[0]];
			manual_current.manual_visited = 1;
		}
	} else {
		let n = manual_current.all_neighbours_with_path();
		// its a straight path
		if (n.length === 2) {
			manual_prev = manual_current;
			for (let i of n) {
				if (grid[i].manual_visited == 0 && forwards) {
					manual_current = grid[i];
					manual_current.manual_visited = 1;
				} else if (grid[i].manual_visited == 1 && !forwards) {
					manual_prev.manual_visited = 0;
					manual_current = grid[i];
				}
			}
		}
	}
}

function check_win() {
	if (manual_current.grid_place === end) return true;
}

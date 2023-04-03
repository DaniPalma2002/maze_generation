function user_input() {
	//createCanvas(100, 100)
	background(255);

	main_text = createDiv("insert data");
	main_text.id("main_text");
	main_text.position(10, 10);

	start_button = createButton("START");
	start_button.mouseReleased(start_test);
	start_button.position(
		width / 2 - start_button.size().width / 2,
		height / 2 - start_button.size().height / 2
	);
}

function start_test() {
	main_text.remove();
	start_button.remove();
}

var fs = require("fs");
var path = require("path");

// our news folder
var newsFolder = __dirname + "/news/";

// an array to hold our text files
var newsFiles = [];

// read our news directory using readdir
fs.readdir(newsFolder, "utf8", (err, files) => {
	// section - 1 - getting the files
	// for each file in the folder, check if it is a text file and save it to our array
	files.filter((file) => {
		if(path.extname(file).toLowerCase() == ".txt") {
			newsFiles.push(file);
		}
	});

	// section - 2 - reading the files and displaying an output to the console
	// for each file in our array, read its contents and print each line to the console
	newsFiles.forEach((file) => {
		fs.readFile(`${newsFolder}${file}`, "utf8", (err, data) => {
			data.split("\n").forEach((line) => {
				console.log(line);
			});
		});
	});	
	
});

const express = require("express");
const app = express();
var fs = require('fs');
function get_json(file) {
	file = file.split("by");
	var recent = "";
	var data = {};
	for (var i = 0; i < file.length; i++) {
		var line = file[i].trim();
		if(line.endsWith(":")) {
			data[line] = [];
			recent = line;
		} else {
			data[recent].push(line);
		}
	}
	return data;
}	
app.use(express.static('public'));
console.log('web service started');
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let files, folder, file, contents, info, description;
	let review = [];
	let to_send = {};
	to_send["list"] = [];
	let title = req.query.title;
	let mode = req.query.mode;
	if(title == undefined || mode == "videos") {
		files = fs.readdirSync("./videos");
		for(var i = 0; i < parseInt(files.length); i++){
			folder = files[i].trim();
			folder = "./videos/" + folder;
			contents = fs.readdirSync(folder);
			for(var j = 0; j < parseInt(contents.length); j++) {
				if(contents[j] == "info.txt") {
					info = fs.readFileSync(folder + "/" + contents[j], 'utf8');
					info = info.split("\n");
					let videos = {};
					videos["title"] = info[0].trim();
					console.log(videos["title"] + "");
					videos["folder"] = folder.split("/")[2];
					to_send["list"].push(videos);
					break;
				}
			}
		}
	}
	else {
		let j = 0;
		files = fs.readdirSync("./videos");
		for(var i = 0; i < files.length; i++){
			folder = files[i].trim();
			if(folder.includes(title)) {
				break;
			}
		}
		folder = "./videos/" + folder + "/";
		file = fs.readdirSync(folder);
		for(var i = 0; i < file.length; i++) {
			if(file[i] == "info.txt") {
				info = fs.readFileSync(folder + file[i], 'utf8') + "";
			}
			else if(file[i] == "description.txt") {
				description = fs.readFileSync(folder + file[i], 'utf8') + "";
			}
			else if(file[i].includes("comment")) {
				review.push(fs.readFileSync(folder + file[i], 'utf8') + "");
			}
			else {
				continue;
			}
		}
		if(mode == "info") {
			infoSplit = info.split("\n");
			to_send["title"] = infoSplit[0];
			to_send["author"] = infoSplit[1];
			to_send["stars"] = infoSplit[2];
		}
		else if(mode == "description") {
			to_send["desc"] = description + "";
		}
		else if(mode == "comments") {
			to_send["comments"] = [];
			for(let i = 0; i < review.length; i++) {
				reviewSplit = review[i].split("\n");
				let sendingTemp = {}
				sendingTemp["name"] = reviewSplit[0];
				sendingTemp["stars"] = reviewSplit[1];
				sendingTemp["review"] = reviewSplit[2];
				to_send["comments"].push(sendingTemp);
			}
		}
	}
	res.json(to_send);
	// go through all files and build JSON and send it back
})
app.listen(3000);
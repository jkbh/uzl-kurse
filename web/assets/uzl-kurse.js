config = {
	locateFile: filename => `assets/${filename}`
}
// The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
// We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
initSqlJs(config).then(function(SQL) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'assets/test.db', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
		var uInt8Array = new Uint8Array(this.response);
		var db = new SQL.Database(uInt8Array);
		var major_rows = db.exec("SELECT id, name FROM major ORDER BY name")[0].values;
		// const major_select = document.getElementById("majors");
		//
		// for (const row of major_rows) {
		// 	const option = document.createElement("option")
		// 	const text = document.createTextNode(row[1])
		// 	option.setAttribute("value", row[0]);
		// 	option.appendChild(text)
		// 	major_select.appendChild(option);
		// }

		const table = document.getElementById("mainTable")
		var allCourses = db.exec("SELECT url, number, name, duration, turnus, points FROM course ORDER BY number")[0].values
		for (const course of allCourses) {
			const courseElement = makeCourseTableRow(course)
			table.appendChild(courseElement)
		}
	};
	xhr.send();
});


function makeCourseTableRow(course) {
	const rowElement = document.createElement("tr")
	let [url, number, name, ...rest] = course

	rowElement.appendChild(makeTdWithText(number))

	const nameElement = document.createElement("td")
	const textElement = document.createElement("a")
	textElement.innerHTML = name
	const moodleElement = document.createElement("a")
	moodleElement.setAttribute("href", url)
	moodleElement.innerHTML = "Moodle"
	nameElement.append(textElement)
	nameElement.append(moodleElement)
	rowElement.appendChild(nameElement)

	for (prop of rest) {
		rowElement.appendChild(makeTdWithText(prop))
	}

	return rowElement
}

function makeTdWithText(text) {
	const td = document.createElement("td")
	td.innerHTML = text
	return td
}

function filterColumn(inputId, tdIndex) {
	let input = document.getElementById(inputId)
	let filter = input.value.toUpperCase();
	let table = document.getElementById("mainTable")
	let rows = Array.from(table.getElementsByTagName("tr")).slice(2)
	for (const row of rows) {
		let text = row.getElementsByTagName("td")[tdIndex].innerText.toUpperCase()
		if (text.indexOf(filter) > -1) {
			row.style.display = ""
		} else {
			row.style.display = "none"
		}

	}

}

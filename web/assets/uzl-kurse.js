config = {
	locateFile: filename => `assets/${filename}`
}
// The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
// We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
initSqlJs(config).then(function(SQL) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'assets/courses.sqlite', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function() {
		const uInt8Array = new Uint8Array(this.response);
		const db = new SQL.Database(uInt8Array);
		const table = document.getElementById("mainTable")
		db.each("SELECT url, number, name, duration, turnus, points FROM course ORDER BY number",
			function(course) {
				const courseElement = makeCourseTableRow(course)
				table.appendChild(courseElement)
			})
	}
	xhr.send();
});

function makeCourseTableRow(course) {
	const template = document.querySelector("#courserow")
	const row = template.content.cloneNode(true)
	td = row.querySelectorAll("td")
	td[0].textContent = course.number
	td[1].querySelector(".nameText").textContent = course.name
	td[1].querySelector(".uzlLink").href = course.url
	if (course.urlUnivis) {
		td[1].querySelector(".univisLink").href = course.urlUnivis
	} else {
		td[1].querySelector(".univisLink").style.display = "none"
	}
	td[2].textContent = course.duration
	td[3].textContent = course.turnus
	td[4].textContent = course.points

	return row
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

config = {
	locateFile: filename => `assets/${filename}`
}
// The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
// We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
let db;
initSqlJs(config).then(function(SQL) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'assets/courses.sqlite', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function() {
		const uInt8Array = new Uint8Array(this.response);
		db = new SQL.Database(uInt8Array);
		loadMajorOptions()
	}
	xhr.send();
});

function loadMajorOptions() {
	const majorSelect = document.querySelector("#majorSelect")
	const template = document.querySelector("#majorOptionTemplate")
	db.each("SELECT id, name FROM major", function(major) {
		const clone = template.content.cloneNode(true)
		const option = clone.querySelector("option")
		option.value = major.id
		option.textContent = major.name
		majorSelect.appendChild(option)
	})
}

function reloadCourses(major_id) {
	const query = ` 
	SELECT DISTINCT
	course.url AS url,
	course.name AS name,
	course.number AS number,
	course.duration AS duration,
	course.turnus AS turnus,
	course.points AS points,
	link.category,
	link.area,
	link.semester
	FROM course
	INNER JOIN major_has_course as link ON course.id=link.course_id
	INNER JOIN major ON link.major_id=major.id
	WHERE major.id=?
	;
	`
	const tbody = document.querySelector("#mainTable tbody")
	tbody.innerHTML = ""
	db.each(query, params = [major_id], callback = function(course) {
		const courseElement = makeCourseTableRow(course)
		tbody.appendChild(courseElement)
		console.log(course)
	})
}


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
	td[2].textContent = course.category
	td[3].textContent = course.area
	td[4].textContent = course.semester
	td[5].textContent = course.turnus
	td[6].textContent = course.duration
	td[7].textContent = course.points

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

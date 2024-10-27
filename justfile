scrape:
	./.venv/bin/python src/main.py
debug: 
	LOGLEVEL="DEBUG" ./.venv/bin/python src/main.py
serve:
	python3 -m http.server -d web
reset_db:
	rm courses.sqlite 
	sqlite3 courses.sqlite < schema.sql

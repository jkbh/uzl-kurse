scrape:
	./.venv/bin/python src/main.py
serve:
	python3 -m http.server -d web
reset_db:
	rm test.db
	sqlite3 test.db < schema.sql

import logging

from scrape import scrape_courses
from insert import insert_all


def main():
    logging.basicConfig(level=logging.DEBUG)
    courses = scrape_courses()
    insert_all(courses)


if __name__ == "__main__":
    main()

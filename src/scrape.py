from dataclasses import dataclass
import logging
from requests_cache import CachedSession
from lxml import html
import re

logger = logging.getLogger(__name__)

START_URL = "https://www.uni-luebeck.de/studium/studiengaenge/informatik/master/modulhandbuch/modulhandbuch-ab-ws-201920.html"
ID_REGEX = re.compile(r"[A-Z]{2}\d{4}(?>[- ][TSÜP])?")


@dataclass
class Study:
    major: str
    category: str
    area: str
    semester: str


@dataclass
class Course:
    url: str
    id: str
    name: str
    duration: int
    turnus: str
    points: int
    studies: list[Study]
    parts: list[str]


def scrape_index(content):
    parsed = html.fromstring(content)
    parsed.make_links_absolute("www.uni-luebeck.de")

    link_elements = parsed.cssselect("ul.module_list a[href]")

    for element in link_elements:
        yield element.get("href")


def scrape_course(content, url):
    parsed = html.fromstring(content)
    data_container = parsed.cssselect("div.mainarticles")[0]

    id = ID_REGEX.search(data_container.cssselect("h1")[0].text_content()).group()
    name = data_container.cssselect("h2")[0].text_content().strip()

    rows = parsed.cssselect("tr")
    duration, turnus, points = rows[0].cssselect("td")

    duration = re.search(r"\d", duration.text_content()).group().strip()
    turnus = turnus.text_content().split(":")[1].strip(" ").strip()
    points = re.search(r"\d{1,2}", points.text_content()).group().strip()

    study_elements = rows[1].cssselect("li")
    studies = []
    for study in study_elements:
        major_category, remaining = study.text_content().split(",", 1)
        major, category = major_category.split("(")
        area, semester = remaining.rsplit(",", 1)
        studies.append(
            Study(major.strip(), category.strip(" ()"), area.strip(), semester.strip())
        )

    part_texts = [
        elem.text_content()
        for elem in rows[2].cssselect("td table td")[0].cssselect("li")
    ]
    part_matches = [ID_REGEX.search(text) for text in part_texts]
    part_ids = [match.group().strip() for match in part_matches if match]

    return Course(url, id, name, duration, turnus, points, studies, part_ids)


def scrape_courses():
    session = CachedSession()
    res = session.get(START_URL)
    urls = scrape_index(res.content)
    courses = []
    for url in urls:
        res = session.get(url)
        logger.debug(f"scraping {url}")
        course = scrape_course(res.content, url)
        logger.debug("scraping done")
        courses.append(course)
    return courses

import csv
import random
from typing import List

from flask import Flask, render_template, url_for

app = Flask(__name__)

GRID_WIDTH = 5


def get_table_ids():
    ids: List[str] = []
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for x in range(GRID_WIDTH):
        letter = alphabet[x]
        for y in range(GRID_WIDTH):
            ids.append(letter + str(y + 1))
    return ids


def get_random_entries(entries: List[str], sub_entries_size=GRID_WIDTH ** 2) -> List[str]:
    """
    Get a randomized sublist of a provided string list.
    :param entries: collection to filter and randomize
    :param sub_entries_size: how many to keep
    :return:
    """
    random.seed()
    sample = random.sample(entries, sub_entries_size)
    sample[sub_entries_size // 2] = "X"
    return sample


def import_entries() -> List[str]:
    """
    Import the entries from grid_entries.csv into a list of strings.
    :return: list of string containing entries.
    """
    entries = []
    with open("grid_entries.csv") as csvfile:
        for row in csv.reader(csvfile):
            for entry in row:
                entries.append(entry)
        return entries


@app.route('/play')
def play():
    url_for('static', filename='grid.css')
    url_for('static', filename='play.js')
    entries = import_entries()
    sub_entries = get_random_entries(entries)
    return render_template("play.html", values=zip(get_table_ids(), sub_entries), width=GRID_WIDTH)


if __name__ == '__main__':
    app.run()

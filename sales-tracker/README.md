# Sales Tracker

A lightweight sales/deal tracker with a CLI and a SQLite backend. No external
dependencies — Python 3.10+ standard library only.

Track deals through a simple pipeline (`lead → won / lost`), and get quick
revenue and pipeline summaries.

## Quickstart

```bash
cd sales-tracker

# Add a deal (starts as a lead)
python -m sales_tracker add "Acme Corp" "Annual license" 12000

# Mark it won or lost
python -m sales_tracker won 1
python -m sales_tracker lost 2

# List deals (optionally filter by status)
python -m sales_tracker list
python -m sales_tracker list --status lead

# Revenue + pipeline summary
python -m sales_tracker summary
```

Data is stored in `sales.db` in the current directory. Override with the
`SALES_TRACKER_DB` environment variable.

## Running tests

```bash
python -m unittest discover tests
```

## Project layout

```
sales_tracker/
  db.py        # SQLite storage layer
  cli.py       # argparse CLI
  __main__.py  # `python -m sales_tracker` entry point
tests/
  test_db.py
```

## Moving to its own repository

This project is self-contained. Once a dedicated repo exists:

```bash
cp -r sales-tracker /path/to/new-repo && cd /path/to/new-repo
git init && git add . && git commit -m "Initial sales tracker scaffold"
git remote add origin git@github.com:<owner>/sales-tracker.git
git push -u origin main
```

"""SQLite storage layer for the sales tracker."""

import os
import sqlite3
from datetime import date

STATUSES = ("lead", "won", "lost")

_SCHEMA = """
CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'won', 'lost')),
    created_on TEXT NOT NULL,
    closed_on TEXT
);
"""


def default_db_path() -> str:
    return os.environ.get("SALES_TRACKER_DB", "sales.db")


def connect(db_path: str | None = None) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path or default_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute(_SCHEMA)
    conn.commit()
    return conn


def add_deal(conn: sqlite3.Connection, customer: str, description: str, amount: float) -> int:
    cur = conn.execute(
        "INSERT INTO deals (customer, description, amount, created_on) VALUES (?, ?, ?, ?)",
        (customer, description, amount, date.today().isoformat()),
    )
    conn.commit()
    return cur.lastrowid


def set_status(conn: sqlite3.Connection, deal_id: int, status: str) -> None:
    if status not in STATUSES:
        raise ValueError(f"status must be one of {STATUSES}, got {status!r}")
    closed_on = date.today().isoformat() if status in ("won", "lost") else None
    cur = conn.execute(
        "UPDATE deals SET status = ?, closed_on = ? WHERE id = ?",
        (status, closed_on, deal_id),
    )
    conn.commit()
    if cur.rowcount == 0:
        raise LookupError(f"no deal with id {deal_id}")


def list_deals(conn: sqlite3.Connection, status: str | None = None) -> list[sqlite3.Row]:
    if status is None:
        return conn.execute("SELECT * FROM deals ORDER BY id").fetchall()
    if status not in STATUSES:
        raise ValueError(f"status must be one of {STATUSES}, got {status!r}")
    return conn.execute("SELECT * FROM deals WHERE status = ? ORDER BY id", (status,)).fetchall()


def summary(conn: sqlite3.Connection) -> dict:
    row = conn.execute(
        """
        SELECT
            COUNT(*)                                              AS total_deals,
            COALESCE(SUM(CASE WHEN status = 'won'  THEN amount END), 0) AS revenue_won,
            COALESCE(SUM(CASE WHEN status = 'lead' THEN amount END), 0) AS pipeline_open,
            COALESCE(SUM(CASE WHEN status = 'lost' THEN amount END), 0) AS revenue_lost,
            SUM(status = 'lead') AS open_leads,
            SUM(status = 'won')  AS deals_won,
            SUM(status = 'lost') AS deals_lost
        FROM deals
        """
    ).fetchone()
    result = dict(row)
    for key in ("open_leads", "deals_won", "deals_lost"):
        result[key] = result[key] or 0
    return result

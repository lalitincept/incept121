"""Command-line interface for the sales tracker."""

import argparse
import sys

from . import db


def _format_deal(row) -> str:
    closed = f"  closed {row['closed_on']}" if row["closed_on"] else ""
    return (
        f"#{row['id']:<4} [{row['status']:<4}] {row['customer']} — {row['description']} "
        f"(${row['amount']:,.2f})  opened {row['created_on']}{closed}"
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="sales_tracker", description="Track sales deals.")
    parser.add_argument("--db", help="path to the SQLite database (default: sales.db)")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="record a new deal (starts as a lead)")
    add.add_argument("customer")
    add.add_argument("description")
    add.add_argument("amount", type=float)

    for status in ("won", "lost"):
        p = sub.add_parser(status, help=f"mark a deal as {status}")
        p.add_argument("deal_id", type=int)

    reopen = sub.add_parser("reopen", help="move a deal back to lead")
    reopen.add_argument("deal_id", type=int)

    lst = sub.add_parser("list", help="list deals")
    lst.add_argument("--status", choices=db.STATUSES)

    sub.add_parser("summary", help="show revenue and pipeline totals")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    conn = db.connect(args.db)
    try:
        if args.command == "add":
            deal_id = db.add_deal(conn, args.customer, args.description, args.amount)
            print(f"Added deal #{deal_id}: {args.customer} — {args.description} (${args.amount:,.2f})")
        elif args.command in ("won", "lost"):
            db.set_status(conn, args.deal_id, args.command)
            print(f"Deal #{args.deal_id} marked {args.command}.")
        elif args.command == "reopen":
            db.set_status(conn, args.deal_id, "lead")
            print(f"Deal #{args.deal_id} moved back to lead.")
        elif args.command == "list":
            deals = db.list_deals(conn, args.status)
            if not deals:
                print("No deals found.")
            for row in deals:
                print(_format_deal(row))
        elif args.command == "summary":
            s = db.summary(conn)
            print(f"Deals:        {s['total_deals']} total "
                  f"({s['open_leads']} open, {s['deals_won']} won, {s['deals_lost']} lost)")
            print(f"Revenue won:  ${s['revenue_won']:,.2f}")
            print(f"Open pipeline: ${s['pipeline_open']:,.2f}")
            print(f"Lost:         ${s['revenue_lost']:,.2f}")
    except (ValueError, LookupError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    finally:
        conn.close()
    return 0

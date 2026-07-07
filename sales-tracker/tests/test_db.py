import unittest

from sales_tracker import db


class SalesTrackerDbTests(unittest.TestCase):
    def setUp(self):
        self.conn = db.connect(":memory:")

    def tearDown(self):
        self.conn.close()

    def test_add_and_list(self):
        deal_id = db.add_deal(self.conn, "Acme", "Annual license", 12000)
        deals = db.list_deals(self.conn)
        self.assertEqual(len(deals), 1)
        self.assertEqual(deals[0]["id"], deal_id)
        self.assertEqual(deals[0]["status"], "lead")

    def test_status_transitions(self):
        deal_id = db.add_deal(self.conn, "Acme", "Annual license", 12000)
        db.set_status(self.conn, deal_id, "won")
        deal = db.list_deals(self.conn, "won")[0]
        self.assertEqual(deal["status"], "won")
        self.assertIsNotNone(deal["closed_on"])

        db.set_status(self.conn, deal_id, "lead")
        deal = db.list_deals(self.conn, "lead")[0]
        self.assertIsNone(deal["closed_on"])

    def test_set_status_validates(self):
        deal_id = db.add_deal(self.conn, "Acme", "License", 100)
        with self.assertRaises(ValueError):
            db.set_status(self.conn, deal_id, "pending")
        with self.assertRaises(LookupError):
            db.set_status(self.conn, 999, "won")

    def test_summary(self):
        a = db.add_deal(self.conn, "Acme", "License", 1000)
        db.add_deal(self.conn, "Beta", "Support", 500)
        c = db.add_deal(self.conn, "Gamma", "Consulting", 250)
        db.set_status(self.conn, a, "won")
        db.set_status(self.conn, c, "lost")

        s = db.summary(self.conn)
        self.assertEqual(s["total_deals"], 3)
        self.assertEqual(s["revenue_won"], 1000)
        self.assertEqual(s["pipeline_open"], 500)
        self.assertEqual(s["revenue_lost"], 250)
        self.assertEqual(s["open_leads"], 1)
        self.assertEqual(s["deals_won"], 1)
        self.assertEqual(s["deals_lost"], 1)

    def test_summary_empty(self):
        s = db.summary(self.conn)
        self.assertEqual(s["total_deals"], 0)
        self.assertEqual(s["revenue_won"], 0)
        self.assertEqual(s["open_leads"], 0)


if __name__ == "__main__":
    unittest.main()

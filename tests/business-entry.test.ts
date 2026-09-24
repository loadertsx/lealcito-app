import { Database } from "bun:sqlite";
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const migrations = [
	"../database/migrations/20260921233921_loyalty_schema/migration.sql",
	"../database/migrations/20260923233653_business_customers/migration.sql",
	"../database/migrations/20260923233703_backfill_business_customers/migration.sql",
];

function apply(db: Database, path: string) {
	db.exec(readFileSync(new URL(path, import.meta.url), "utf8"));
}

function newDb() {
	const db = new Database(":memory:");
	db.exec("PRAGMA foreign_keys = ON");
	apply(db, migrations[0]);
	return db;
}

test("existing members are entered at their original joined time", () => {
	const db = newDb();
	try {
		db.exec(`
			INSERT INTO users (id, email) VALUES ('user-a', 'legacy@example.invalid');
			INSERT INTO businesses (id, name, slug, timezone)
			VALUES ('biz-a', 'Café', 'cafe', 'America/Argentina/Buenos_Aires');
			INSERT INTO memberships (id, business_id, name, description)
			VALUES ('plan-a', 'biz-a', 'Plan', 'Beneficios');
			INSERT INTO business_memberships (id, user_id, business_id, membership_id, status, joined_at)
			VALUES ('member-a', 'user-a', 'biz-a', 'plan-a', 'suspended', 1234567890000);
		`);
		apply(db, migrations[1]);
		apply(db, migrations[2]);
		const entry = db
			.query(
				"SELECT entered_at FROM business_customers WHERE user_id = 'user-a' AND business_id = 'biz-a'",
			)
			.get() as { entered_at: number } | null;
		expect(entry?.entered_at).toBe(1234567890000);
		const member = db
			.query(
				"SELECT status FROM business_memberships WHERE user_id = 'user-a' AND business_id = 'biz-a'",
			)
			.get() as { status: string } | null;
		expect(member?.status).toBe("suspended");
	} finally {
		db.close();
	}
});

test("entry is idempotent, scoped by user and business, and grants no membership", () => {
	const db = newDb();
	try {
		apply(db, migrations[1]);
		apply(db, migrations[2]);
		db.exec(`
			INSERT INTO users (id, email) VALUES ('user-a', 'a@example.invalid');
			INSERT INTO users (id, email) VALUES ('user-b', 'b@example.invalid');
			INSERT INTO businesses (id, name, slug, timezone)
			VALUES ('biz-a', 'A', 'a', 'America/Argentina/Buenos_Aires'),
			       ('biz-b', 'B', 'b', 'America/Argentina/Buenos_Aires');
		`);
		const enter =
			db.query(`INSERT INTO business_customers (user_id, business_id)
			VALUES (?, ?) ON CONFLICT DO NOTHING`);
		enter.run("user-a", "biz-a");
		enter.run("user-a", "biz-a");
		enter.run("user-a", "biz-b");
		const entries = db
			.query(
				"SELECT business_id FROM business_customers WHERE user_id = ? ORDER BY business_id",
			)
			.all("user-a") as { business_id: string }[];
		expect(entries.map((entry) => entry.business_id)).toEqual([
			"biz-a",
			"biz-b",
		]);
		expect(
			db
				.query(
					"SELECT count(*) AS total FROM business_customers WHERE user_id = ?",
				)
				.get("user-b"),
		).toEqual({ total: 0 });
		expect(
			db.query("SELECT count(*) AS total FROM business_memberships").get(),
		).toEqual({ total: 0 });
		expect(
			db.query("SELECT count(*) AS total FROM business_staff").get(),
		).toEqual({ total: 0 });
		expect(() => enter.run("user-a", "missing-business")).toThrow();
	} finally {
		db.close();
	}
});

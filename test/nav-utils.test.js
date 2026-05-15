import test from "node:test";
import assert from "node:assert/strict";
import { NAV_SECTIONS } from "../src/nav-config.js";
import { filterNavByRole, getActiveIds, isActivePath } from "../src/nav-utils.js";

test("filterNavByRole keeps admin-only items for admin", () => {
  const sections = filterNavByRole(NAV_SECTIONS, "admin");
  const paths = sections.flatMap((section) => section.items.map((item) => item.path));
  assert(paths.includes("#/compliance/audit"));
  assert(paths.includes("#/settings/team"));
});

test("filterNavByRole removes admin-only items for support", () => {
  const sections = filterNavByRole(NAV_SECTIONS, "support");
  const paths = sections.flatMap((section) => section.items.map((item) => item.path));
  assert(!paths.includes("#/compliance/audit"));
  assert(!paths.includes("#/settings/team"));
});

test("isActivePath matches exact and nested routes", () => {
  assert.equal(isActivePath("#/operations/payments", "#/operations/payments"), true);
  assert.equal(isActivePath("#/operations/payments/reviews", "#/operations/payments"), true);
  assert.equal(isActivePath("#/operations/payments-extra", "#/operations/payments"), false);
});

test("getActiveIds includes parent item when a child route is active", () => {
  const sections = filterNavByRole(NAV_SECTIONS, "admin");
  const ids = getActiveIds(sections.flatMap((section) => section.items), "#/operations/payments/reviews");
  assert(ids.has("payments"));
  assert(ids.has("reviews"));
});

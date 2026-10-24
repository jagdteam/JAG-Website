import assert from "node:assert/strict";
import test from "node:test";

import { matchedTerms, searchTerms } from "../../../../../public/projects/clicr/demo/search.js";

const bm = {
  doc_len: Array(10).fill(10),
  postings: {
    route: [[0, 3], [2, 1]],
    decorator: [[0, 1]],
    "url for": [[0, 2]],
    url: [[0, 2], [1, 1]],
    for: [[0, 1], [1, 1]],
    the: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]],
  },
};

test("ordered by idf x tf", () => assert.deepEqual(matchedTerms("route decorator", bm, 0), ["route", "decorator"]));
test("whole token drops its parts", () => assert.deepEqual(matchedTerms("url_for", bm, 0), ["url_for"]));
test("parts shown when the whole token missed", () => assert.deepEqual(matchedTerms("url_for", bm, 1), ["url", "for"]));
test("idf-floor terms dropped", () => assert.deepEqual(matchedTerms("the route", bm, 0), ["route"]));
test("prototype words", () => assert.deepEqual(matchedTerms("constructor __proto__ toString", bm, 0), []));
test("chunk with no hit", () => assert.deepEqual(matchedTerms("route", bm, 9), []));
test("existing exports unchanged", () => assert.equal(searchTerms("getUserById"), "getuserbyid get user by id"));

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleText = await readFile(path.join(repoDir, "WLOC.sgmodule"), "utf8");

function getRulePattern(name) {
  const line = moduleText
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(name + " ="));
  assert.ok(line, name + " rule is missing");

  const match = line.match(/pattern="([^"]+)"/);
  assert.ok(match, name + " pattern is missing");
  return new RegExp(match[1]);
}

const wlocPattern = getRulePattern("Apple WLOC");
const settingsPattern = getRulePattern("WLOC Settings");
const supportedHosts = [
  "gs-loc.apple.com",
  "gs-loc-cn.apple.com",
  "gsp-ssl.ls.apple.com",
  "bluedot.is.autonavi.com",
  "bluedot.is.autonavi.com.gds.alibabadns.com",
];

test("module matches every supported WLOC host", () => {
  for (const host of supportedHosts) {
    assert.match("https://" + host + "/clls/wloc", wlocPattern);
    assert.match("https://" + host + "/clls/wloc?request=1", wlocPattern);
  }
});

test("WLOC rule does not match unrelated paths or hostnames", () => {
  assert.doesNotMatch(
    "https://gsp-ssl.ls.apple.com/clls/wloc-test",
    wlocPattern,
  );
  assert.doesNotMatch(
    "https://evil-gsp-ssl.ls.apple.com/clls/wloc",
    wlocPattern,
  );
  assert.doesNotMatch(
    "https://bluedot.is.autonavi.com/other",
    wlocPattern,
  );
});

test("settings rule remains scoped to the original hosts", () => {
  assert.match(
    "https://gs-loc.apple.com/wloc-settings/save?action=query",
    settingsPattern,
  );
  assert.match(
    "https://gs-loc-cn.apple.com/wloc-settings/save",
    settingsPattern,
  );
  assert.doesNotMatch(
    "https://gsp-ssl.ls.apple.com/wloc-settings/save",
    settingsPattern,
  );
  assert.doesNotMatch(
    "https://bluedot.is.autonavi.com/wloc-settings/save",
    settingsPattern,
  );
});

test("module uses the independent repository scripts", () => {
  assert.match(
    moduleText,
    /raw\.githubusercontent\.com\/Emokui\/wloc\/main\/dist\/wloc\.js/,
  );
  assert.match(
    moduleText,
    /raw\.githubusercontent\.com\/Emokui\/wloc\/main\/dist\/wloc-settings\.js/,
  );
});

test("MITM list contains only the exact supported hosts", () => {
  const mitmLine = moduleText
    .split(/\r?\n/)
    .find((entry) => entry.startsWith("hostname ="));
  assert.ok(mitmLine, "MITM hostname line is missing");

  for (const host of supportedHosts) {
    assert.ok(mitmLine.includes(host), host + " is missing from MITM list");
  }
  assert.doesNotMatch(mitmLine, /\*/);
});

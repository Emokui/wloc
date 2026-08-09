import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = await readFile(path.join(repoDir, "dist/wloc.js"), "utf8");
const storeKey = "emokui_wloc_settings_v1";

function loadScript({
  argument = "longitude=113.94114&latitude=22.544577&accuracy=25&randomRadius=40",
  initial = null,
  randomValues = [0.25, 0.5],
} = {}) {
  let donePayload;
  const store = new Map();
  if (initial !== null) store.set(storeKey, JSON.stringify(initial));
  let randomIndex = 0;
  const math = Object.create(Math);
  math.random = () => randomValues[randomIndex++ % randomValues.length];

  const context = vm.createContext({
    $argument: argument,
    $persistentStore: {
      read(key) {
        return store.has(key) ? store.get(key) : null;
      },
    },
    $done(value) {
      donePayload = value;
    },
    console: { log() {} },
    Math: math,
  });

  vm.runInContext(script, context);
  return { context, donePayload };
}

test("location script reads a saved randomRadius and validates coordinates", () => {
  const { context } = loadScript({
    argument: "longitude=113.94114&latitude=22.544577&accuracy=25&randomRadius=40",
    initial: {
      longitude: -73.9857,
      latitude: 40.7484,
      accuracy: 30,
      randomRadius: 80,
    },
  });

  const settings = context.Pe();
  assert.equal(settings.longitude, -73.9857);
  assert.equal(settings.latitude, 40.7484);
  assert.equal(settings.accuracy, 30);
  assert.equal(settings.randomRadius, 80);
});

test("invalid saved randomRadius falls back to the module value", () => {
  const { context } = loadScript({
    argument: "longitude=113.94114&latitude=22.544577&accuracy=25&randomRadius=40",
    initial: {
      longitude: 121.5,
      latitude: 31.2,
      accuracy: 25,
      randomRadius: 5001,
    },
  });

  assert.equal(context.Pe().randomRadius, 40);
});

test("invalid coordinates are disabled instead of being patched", () => {
  const { context } = loadScript({
    argument: "longitude=181&latitude=91&accuracy=25&randomRadius=40",
  });

  const settings = context.Pe();
  assert.equal(settings.longitude, null);
  assert.equal(settings.latitude, null);
});

test("saved zero coordinates remain valid in the location script", () => {
  const { context } = loadScript({
    initial: {
      longitude: 0,
      latitude: 0,
      accuracy: 25,
      randomRadius: 0,
    },
  });

  assert.equal(context.Pe().longitude, 0);
  assert.equal(context.Pe().latitude, 0);
});

test("randomRadius zero leaves the target unchanged", () => {
  const { context } = loadScript();
  const target = { longitude: 113.94114, latitude: 22.544577, randomRadius: 0 };

  assert.strictEqual(context.qe(target), target);
});

test("randomRadius stays within the configured distance", () => {
  const { context } = loadScript({ randomValues: [0.25, 0.5] });
  const target = { longitude: 0, latitude: 0, randomRadius: 100 };
  const result = context.qe(target);

  assert.equal(result.randomDistance, 50);
  assert.notEqual(result.longitude, target.longitude);
  assert.notEqual(result.latitude, target.latitude);
  const distanceInMeters = Math.hypot(result.longitude * 111320, result.latitude * 111320);
  assert.ok(distanceInMeters <= 100.001);
});

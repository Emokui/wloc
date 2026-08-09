import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = await readFile(path.join(repoDir, "dist/wloc-settings.js"), "utf8");
const storeKey = "emokui_wloc_settings_v1";

function createHarness({
  argument = "longitude=113.94114&latitude=22.544577&accuracy=25&randomRadius=40",
  initial = null,
} = {}) {
  const store = new Map();
  if (initial !== null) store.set(storeKey, JSON.stringify(initial));

  return {
    run(query) {
      let payload;
      const context = vm.createContext({
        $argument: argument,
        $request: {
          url: `https://gs-loc.apple.com/wloc-settings/save${query}`,
        },
        $persistentStore: {
          read(key) {
            return store.has(key) ? store.get(key) : null;
          },
          write(value, key) {
            if (value === "") store.delete(key);
            else store.set(key, value);
            return true;
          },
        },
        $done(value) {
          payload = value;
        },
        console: { log() {} },
      });

      vm.runInContext(script, context);
      assert.ok(payload?.response?.body, "settings script did not return a response");
      return {
        body: JSON.parse(payload.response.body),
        stored: store.has(storeKey) ? JSON.parse(store.get(storeKey)) : null,
      };
    },
  };
}

test("save persists randomRadius and returns it to the page", () => {
  const harness = createHarness();
  const result = harness.run("?lon=121.5654&lat=25.0330&acc=18&randomRadius=125");

  assert.deepEqual(result.body, {
    success: true,
    longitude: 121.5654,
    latitude: 25.033,
    accuracy: 18,
    randomRadius: 125,
  });
  assert.deepEqual(result.stored, {
    longitude: 121.5654,
    latitude: 25.033,
    accuracy: 18,
    randomRadius: 125,
  });
});

test("query prefers saved coordinates and saved radius", () => {
  const harness = createHarness({
    initial: {
      longitude: -73.9857,
      latitude: 40.7484,
      accuracy: 30,
      randomRadius: 80,
    },
  });
  const result = harness.run("?action=query");

  assert.deepEqual(result.body, {
    success: true,
    longitude: -73.9857,
    latitude: 40.7484,
    accuracy: 30,
    randomRadius: 80,
  });
});

test("zero longitude and latitude are valid saved coordinates", () => {
  for (const [longitude, latitude] of [[0, 0], [0, 22.5], [113.9, 0]]) {
    const harness = createHarness();
    const saved = harness.run(`?lon=${longitude}&lat=${latitude}&randomRadius=0`);

    assert.deepEqual(saved.body, {
      success: true,
      longitude,
      latitude,
      accuracy: 25,
      randomRadius: 0,
    });
    assert.deepEqual(harness.run("?action=query").body, saved.body);
  }
});

test("old saved settings without randomRadius fall back to the module value", () => {
  const harness = createHarness({
    argument: "longitude=113.94114&latitude=22.544577&accuracy=25&randomRadius=40",
    initial: {
      longitude: 121.5,
      latitude: 31.2,
      accuracy: 25,
    },
  });
  const result = harness.run("?action=query");

  assert.equal(result.body.success, true);
  assert.equal(result.body.longitude, 121.5);
  assert.equal(result.body.latitude, 31.2);
  assert.equal(result.body.randomRadius, 40);
});

test("invalid saved coordinates do not override valid module coordinates", () => {
  const harness = createHarness({
    argument: "longitude=113.94114&latitude=22.544577&accuracy=25&randomRadius=40",
    initial: {
      longitude: 181,
      latitude: 91,
      accuracy: 25,
      randomRadius: 200,
    },
  });
  const result = harness.run("?action=query");

  assert.deepEqual(result.body, {
    success: true,
    longitude: 113.94114,
    latitude: 22.544577,
    accuracy: 25,
    randomRadius: 40,
  });
});

test("save rejects invalid coordinates and random radius", () => {
  const harness = createHarness();

  assert.equal(harness.run("?lon=181&lat=22.5&randomRadius=10").body.success, false);
  assert.equal(harness.run("?lon=113.9&lat=91&randomRadius=10").body.success, false);
  assert.equal(harness.run("?lon=113.9&lat=22.5&randomRadius=-1").body.success, false);
  assert.equal(harness.run("?lon=113.9&lat=22.5&randomRadius=5001").body.success, false);
});

test("zero and maximum random radius are accepted", () => {
  const harness = createHarness();

  assert.equal(harness.run("?lon=113.9&lat=22.5&randomRadius=0").body.randomRadius, 0);
  assert.equal(harness.run("?lon=113.9&lat=22.5&randomRadius=5000").body.randomRadius, 5000);
});

test("clear removes saved settings and query falls back to module parameters", () => {
  const harness = createHarness({
    initial: {
      longitude: 121.5,
      latitude: 31.2,
      accuracy: 30,
      randomRadius: 80,
    },
  });

  assert.equal(harness.run("?action=clear").body.success, true);
  assert.deepEqual(harness.run("?action=query").body, {
    success: true,
    longitude: 113.94114,
    latitude: 22.544577,
    accuracy: 25,
    randomRadius: 40,
  });
});

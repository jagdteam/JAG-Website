import test from "node:test";
import assert from "node:assert/strict";
import { isCapable } from "../../../../../public/projects/clicr/demo/capability.js";

const good = { gpuAdapter: true, deviceMemory: 8, saveData: false, effectiveType: "4g", battery: { charging: true, level: 0.2 }, width: 1440, coarsePointer: false };

test("isCapable: a plugged-in desktop with a GPU, 8 GB and a fast link is capable", () => {
  assert.equal(isCapable(good), true);
});

test("isCapable: no GPU adapter is not capable", () => {
  assert.equal(isCapable({ ...good, gpuAdapter: false }), false);
  assert.equal(isCapable({ ...good, gpuAdapter: undefined }), false);
});

test("isCapable: deviceMemory must be reported and at least 8", () => {
  assert.equal(isCapable({ ...good, deviceMemory: 4 }), false);
  assert.equal(isCapable({ ...good, deviceMemory: 7.9 }), false);
  assert.equal(isCapable({ ...good, deviceMemory: undefined }), false);
  assert.equal(isCapable({ ...good, deviceMemory: 16 }), true);
});

test("isCapable: data saver is not capable", () => {
  assert.equal(isCapable({ ...good, saveData: true }), false);
  assert.equal(isCapable({ ...good, saveData: undefined }), true);
});

test("isCapable: effectiveType must be 4g when reported, absent is fine", () => {
  for (const t of ["3g", "2g", "slow-2g"]) assert.equal(isCapable({ ...good, effectiveType: t }), false, t);
  assert.equal(isCapable({ ...good, effectiveType: undefined }), true);
});

test("isCapable: battery needs charging or level >= 0.5; no battery API is fine", () => {
  assert.equal(isCapable({ ...good, battery: { charging: false, level: 0.49 } }), false);
  assert.equal(isCapable({ ...good, battery: { charging: false, level: 0.5 } }), true);
  assert.equal(isCapable({ ...good, battery: { charging: true, level: 0.1 } }), true);
  assert.equal(isCapable({ ...good, battery: null }), true);
});

test("isCapable: phone width (< 720) and coarse pointers are not capable", () => {
  assert.equal(isCapable({ ...good, width: 719 }), false);
  assert.equal(isCapable({ ...good, width: 720 }), true);
  assert.equal(isCapable({ ...good, coarsePointer: true }), false);
  assert.equal(isCapable({ ...good, width: undefined }), false);
});

test("isCapable: conservative defaults for an empty or missing probe", () => {
  assert.equal(isCapable({}), false);
  assert.equal(isCapable(null), false);
  assert.equal(isCapable(undefined), false);
});

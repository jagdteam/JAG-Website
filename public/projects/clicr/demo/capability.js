// DOM-free rule for the CliCR demo: may this device write the answer on its own (WebLLM) without being asked?
// The page probes the browser into a plain object and calls isCapable; every missing value means "not capable".

/**
 * probe: {gpuAdapter, deviceMemory, saveData, effectiveType, battery, width, coarsePointer}
 *  - gpuAdapter: true when navigator.gpu.requestAdapter() returned an adapter
 *  - deviceMemory: navigator.deviceMemory in GB (undefined when the browser does not report it)
 *  - saveData / effectiveType: navigator.connection values (undefined when not reported)
 *  - battery: {charging, level} from getBattery(), or null when the browser has none
 *  - width: window.innerWidth; coarsePointer: matchMedia("(pointer: coarse)").matches
 */
export function isCapable(probe) {
  const p = probe ?? {};
  if (p.gpuAdapter !== true) return false;
  if (!(p.deviceMemory >= 8)) return false; // missing or small: no
  if (p.saveData === true) return false;
  if (p.effectiveType != null && p.effectiveType !== "4g") return false; // only checked when reported
  if (p.battery && !p.battery.charging && !(p.battery.level >= 0.5)) return false;
  if (!(p.width >= 720)) return false; // phone width, or an unknown width
  if (p.coarsePointer === true) return false;
  return true;
}

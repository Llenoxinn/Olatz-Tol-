let fn = null

export function setExportFn(f) { fn = f }
export function clearExportFn() { fn = null }
export function getExportFn() { return fn }

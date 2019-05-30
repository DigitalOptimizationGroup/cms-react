export function isArgsEqual(a, b) {
  // This is NOT a safe shallow equal check if the keys between the two
  // can ever change, however as a perf optimization we're making the assumption
  // that it should not happen. If it does, their code won't work anyway.
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

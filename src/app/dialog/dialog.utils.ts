function _undefinedToNull<T>(obj: T): unknown {
  if (obj === undefined) {
    return null;
  }

  if (typeof obj === 'object') {
    if (obj instanceof Map) {
      obj.forEach((value, key) => obj.set(key, _undefinedToNull(value)));
    } else {
      for (const key in obj) {
        obj[key] = _undefinedToNull(obj[key]) as any;
      }
    }
  }

  return obj;
}

export function undefinedToNull<T>(obj: T) {
  return _undefinedToNull(structuredClone(obj));
}

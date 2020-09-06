export namespace EnumUtils {

  /**
   * Returns the collection of enums.
   * @param enums An enumeration type.
   */
  export function keys(enums) {
    return Object.keys(enums);
  }

  /**
   * Returns the collection of enums' value.
   * @param enums An enumeration type.
   */
  export function values(enums) {
    return Object.values(enums);
  }

  /**
   * Returns the collection of enum key-value pairs.
   * @param enums An enumeration type.
   */
  export function pairs(enums) {
    const pair = [];
    keys(enums).forEach(key => {
      pair.push({
        key: key,
        value: enums[key],
      });
    });
    return pair;
  }

  /**
   * Returns an enum matching the value.
   * @param enums An enumeration type.
   * @param value An enum value.
   */
  export function getEnum(enums, value: string) {
    for (const pair of pairs(enums)) {
      if (pair.value === value) {
        return pair.key;
      }
    }
  }
}

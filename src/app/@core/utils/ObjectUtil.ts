export class ObjectUtil {
  static isEmpty(input: any) {
    return input === undefined || input === null || input === '' || input === 'null' || input === 'undefined';
  }

  public static setUndefinedIfNull(input: any): any {
    return this.isEmpty(input) ? undefined : input;
  }

  public static setInputOrElseNext(input: any, next: any): any {
    return this.isEmpty(input) ? next : input;
  }
}

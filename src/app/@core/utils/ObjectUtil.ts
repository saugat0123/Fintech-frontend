export class ObjectUtil {
  static isEmpty(input: any) {
    return input === undefined || input === null || input === '' || input === 'null' || input === 'undefined' || input === 'Infinity';
  }

  public static setUndefinedIfNull(input: any): any {
    return this.isEmpty(input) ? undefined : input;
  }

  public static setInputOrElseNext(input: any, next: any): any {
    return this.isEmpty(input) ? next : input;
  }

  public static separateFirstDash(input: any){
    let value = [];
    if (this.isEmpty(input)){
      return undefined;
    }
    value = input.split('-');
    return value[0] ? value[0] : undefined;
  }
}

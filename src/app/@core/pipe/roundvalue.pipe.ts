import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundvalue'
})
export class RoundvaluePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return parseFloat(value).toFixed(3);
  }

}

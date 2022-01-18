import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nepaliNumber'
})
export class NepaliNumberPipe implements PipeTransform {
  mapPreetiNumber = new Map([
    [0, ')'], // ०
    [1, '!'], // १
    [2, '@'], // २
    [3, '#'], // ३
    [4, '$'], // ४
    [5, '%'], // ५
    [6, '^'], // ६
    [7, '&'], // ७
    [8, '*'], // ८
    [9, '('], // ९
    [10, '!)'], // १०
    [11, '!!'], // ११
    [12, '!@'], // १२
    [13, '!#'], // १३
    [14, '!$'], // १४
    [15, '!%'], // १५
    [16, '!^'], // १६
    [17, '!&'], // १७
    [18, '!*'], // १८
    [19, '!('], // १९
    [20, '!)'], // २०
    [21, '@!'], // २१
    [22, '@@'], // २२
    [23, '@#'], // २३
    [24, '@$'], // २४
    [25, '@%'], // २५
    [26, '@^'], // २६
    [27, '@&'], // २७
    [28, '@*'], // २८
    [29, '@('], // २९
    [30, '@)'], // ३०
  ]);

  mapUnicodeNumber = new Map([
    [0, '०'], // ०
    [1, '१'], // १
    [2, '२'], // २
    [3, '३'], // ३
    [4, '४'], // ४
    [5, '५'], // ५
    [6, '६'], // ६
    [7, '७'], // ७
    [8, '८'], // ८
    [9, '९'], // ९
    [10, '१०'], // १०
    [11, '११'], // ११
    [12, '१२'], // १२
    [13, '१३'], // १३
    [14, '१४'], // १४
    [15, '१५'], // १५
    [16, '१६'], // १६
    [17, '१७'], // १७
    [18, '१८'], // १८
    [19, '१९'], // १९
    [20, '२०'], // २०
    [21, '२१'], // २१
    [22, '२२'], // २२
    [23, '२३'], // २३
    [24, '२४'], // २४
    [25, '२५'], // २५
    [26, '२६'], // २६
    [27, '२७'], // २७
    [28, '२८'], // २८
    [29, '२९'], // २९
    [30, '३०'], // ३०
  ]);


  transform(value: number, mapType: string = 'unicode'): string {
    if (mapType === 'unicode') {
      let finalValue = '';
      for (let i = 0; i < value.toString().length; i++) {
        // tslint:disable-next-line:radix
        finalValue += this.mapUnicodeNumber.get(parseInt(value.toString()[i]));
      }
      return finalValue;
    } else if (mapType === 'preeti') {
      let finalValue = '';
      for (let i = 0; i < value.toString().length; i++) {
        // tslint:disable-next-line:radix
        finalValue += this.mapPreetiNumber.get(parseInt(value.toString()[i]));
      }
      return finalValue;
    } else {
      return null;
    }
  }

}

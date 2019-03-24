/*import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'Detail', pure: false})*/
export class Detail{ /*implements PipeTransform*/
    /*transform(obj: Object, args: any[] = null): any{
        let a = [];
        Object.keys(obj).forEach(key => {
            a.push({
                value: obj[key],
                key: key
            });
        });
        return a;
    }*/
    /*
    transform(value: any, args: any[] = null): any {
        return Object.keys(value);
    }*/

     id: number;
     cycle: string;
}

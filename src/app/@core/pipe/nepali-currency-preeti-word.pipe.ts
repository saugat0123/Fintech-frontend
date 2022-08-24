import {Pipe, PipeTransform} from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
    name: 'nepaliCurrencyPreetiWord'
})
export class NepaliCurrencyPreetiWordPipe implements PipeTransform {
    units = [
        ';\'Go',
        'Ps',
        'b\'O',
        'tLg',
        'rf/',
        'kfFr',
        '5',
        ';ft',
        'cf7',
        'gf}',
        'b;'
    ];

    teens = [
        ';\'Go',
        'Ps',
        'b\'O',
        'tLg',
        'rf/',
        'kfFr',
        '5',
        ';ft',
        'cf7',
        'gf}',
        'b;',
        'P3f/',
        'afx|',
        't]x|',
        'rf}w',
        'kG„',
        ';f]x|',
        ';q',
        'c7fx|',
        'pGgfO;',
        'aL;',
        'PsfO;',
        'afO;',
        't]O;',
        'rf}aL;',
        'krL;',
        '5AaL;',
        ';QfO;',
        'c¶fO;',
        'pgGtL;',
        'tL;',
        'PstL;',
        'aQL;',
        't]QL;',
        'rf}tL;',
        'k}tL;',
        '5QL;',
        ';/tL;',
        'c/tL;',
        'pggrfnL;',
        'rfnL;',
        'PsrfnL;',
        'aofln;',
        'tL/rfnL;',
        'rf}jfln;',
        'k}+tfln;',
        '5ofln;',
        ';/rfnL;',
        'c/rfnL;',
        'pggrf;',
        'krf;',
        'PsfpGg',
        'afpGg',
        'qkGg',
        'rf}jGg',
        'kRkGg',
        '5kGg',
        ';GtfpGg',
        'cG7fpFGg',
        'pgfGG;f7L',
        ';f7L',
        'Ps;f7L',
        'af;f7L',
        'tL/;f7L',
        'rf}+;f7L',
        'k};f7L',
        '5};7L',
        ';T;¶L',
        'c;{¶L',
        'pgG;Q/L',
        ';t/L',
        'PsxQ/',
        'axQ/',
        'lqxQ/',
        'rf}xQ/',
        'krxQ/',
        '5xQ/',
        ';TxQ/',
        'c7\\xQ/',
        'pgf:;L',
        'c:;L',
        'Psf;L',
        'aof;L',
        'qLof;L',
        'rf}/f;L',
        'krf;L',
        '5of;L',
        ';tf;L',
        'c7f;L',
        'pgfGgAa',
        'gAa]',
        'PsfGgAa',
        'aofGgAa',
        'lqofGgAa',
        'rf}/fGgAa]',
        'k+rfGgAa',
        '5ofGgAa',
        ';GtfG‍gAa]',
        'cG7fGgAa',
        'pgfG;o'
    ];

    tens = [
        '',
        'b;',
        'aL;',
        'tL;',
        'rfnL;',
        'krf;',
        ';f7L',
        ';t/L',
        'c:;L',
        'gAa'
    ];
    numbersObject: { [x: string]: string } = {
        1: '१',
        2: '२',
        3: '३',
        4: '४',
        5: '५',
        6: '६',
        7: '७',
        8: '८',
        9: '९',
        0: '०',
        '.': '.',
        ',': ','
    };
    decimalTens;
    decimalWords;

    transform(value: any, ...args: any[]): any {
        if (ObjectUtil.isEmpty(value)) {
            return '';
        }
        return this.numberIntoWordsNepali(value);
    }


    numberIntoWordsNepaliPaisa(e) {
        let a = '';
        if (isNaN(e) || '' === e) {
            return 'N/A';
        }
        let t = '';
        const r = 0;

        const n = Math.floor(e % 100).toString();
        if (('' + e).length > 2) {
            a = ('' + e).substring(('' + e).length - 3, ('' + e).length - 2);
        }
        let i = Math.floor(e % 1e5).toString();
        (i = '' + i), (i = i.substring(0, i.length - 3));
        let o = Math.floor(e % 1e7).toString();
        (o = '' + o), (o = o.substring(0, o.length - 5));
        let s = Math.floor(e % 1e9).toString();
        (s = '' + s), (s = s.substring(0, s.length - 7));
        let l = Math.floor(e % 1e11).toString();
        (l = '' + l), (l = l.substring(0, l.length - 9));
        let u = Math.floor(e % 1e13).toString();

        return (
            (u = '' + u),
                (u = u.substring(0, u.length - 11)),
            Number(u) > 0 && (t += this.teens[u] + ' v/a'),
            Number(l) > 0 && (t += ' ' + this.teens[l] + ' c/a'),
            Number(s) > 0 && (t += ' ' + this.teens[s] + ' s/f]8'),
            Number(o) > 0 && (t += ' ' + this.teens[o] + ' nfv'),
            Number(i) > 0 && (t += ' ' + this.teens[i] + ' xhf/'),
            Number(a) > 0 && (t += ' ' + this.teens[a] + ' ;o'),
            Number(n) > 0 && (t += ' ' + this.teens[n]),
            '' !== t.trim() && (t += ' पैसा'),
            r > 0 && (t += ('' !== t.trim() ? ', ' : '') + this.decimalWords),
                t
        );
    }

    numberIntoWordsNepali(e) {
        let paisa = '';
        if (isNaN(e) || '' === e) {
            return 'N/A';
        }
        let t = '';
        const r = 0;
        const afterDecimal = e.toString().split('.');
        if (afterDecimal.length > 1) {
            paisa = this.numberIntoWordsNepaliPaisa(afterDecimal[1]);
        }
        let a = '';
        e = afterDecimal[0];
        const n = Math.floor(e % 100).toString();
        if (('' + e).length > 2) {
            a = ('' + e).substring(('' + e).length - 3, ('' + e).length - 2);
        }
        let i = Math.floor(e % 1e5).toString();
        (i = '' + i), (i = i.substring(0, i.length - 3));
        let o = Math.floor(e % 1e7).toString();
        (o = '' + o), (o = o.substring(0, o.length - 5));
        let s = Math.floor(e % 1e9).toString();
        (s = '' + s), (s = s.substring(0, s.length - 7));
        let l = Math.floor(e % 1e11).toString();
        (l = '' + l), (l = l.substring(0, l.length - 9));
        let u = Math.floor(e % 1e13).toString();

        const finalNep = ((u = '' + u),
            (u = u.substring(0, u.length - 11)),
        Number(u) > 0 && (t += this.teens[u] + ' v/a'),
        Number(l) > 0 && (t += ' ' + this.teens[l] + ' c/a'),
        Number(s) > 0 && (t += ' ' + this.teens[s] + ' s/f]8'),
        Number(o) > 0 && (t += ' ' + this.teens[o] + ' nfv'),
        Number(i) > 0 && (t += ' ' + this.teens[i] + ' xhf/'),
        Number(a) > 0 && (t += ' ' + this.teens[a] + ' ;o'),
        Number(n) > 0 && (t += ' ' + this.teens[n]),
        '' !== t.trim() && (t += ' ?k}+of'),
        r > 0 && (t += ('' !== t.trim() ? ', ' : '') + this.decimalWords),
            t);
        return finalNep + paisa;
    }

}

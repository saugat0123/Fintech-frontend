import {Pipe, PipeTransform} from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
    name: 'nepaliPercentWord'
})
export class NepaliPercentWordPipe implements PipeTransform {
    units = [
        'सुन्य',
        'एक',
        'दुई',
        'तीन',
        'चार',
        'पाँच',
        'छ',
        'सात',
        'आठ',
        'नौ',
        'दस'
    ];

    teens = [
        'सुन्य',
        'एक',
        'दुई',
        'तीन',
        'चार',
        'पाँच',
        'छ',
        'सात',
        'आठ',
        'नौ',
        'दस',
        'एघार',
        'बाह्र',
        'तेह्र',
        'चौध',
        'पन्ध्र',
        'सोह्र',
        'सत्र',
        'अठाह्र',
        'उन्नाइस',
        'बीस',
        'एकाइस',
        'बाइस',
        'तेइस',
        'चौबीस',
        'पचीस',
        'छब्बीस',
        'सत्ताइस',
        'अठ्ठाइस',
        'उनन्तीस',
        'तीस',
        'एकतीस',
        'बतीस',
        'तेतीस',
        'चौतीस',
        'पैतीस',
        'छतीस',
        'सरतीस',
        'अरतीस',
        'उननचालीस',
        'चालीस',
        'एकचालीस',
        'बयालिस',
        'तीरचालीस',
        'चौवालिस',
        'पैंतालिस',
        'छयालिस',
        'सरचालीस',
        'अरचालीस',
        'उननचास',
        'पचास',
        'एकाउन्न',
        'बाउन्न',
        'त्रिपन्न',
        'चौवन्न',
        'पच्पन्न',
        'छपन्न',
        'सन्ताउन्न',
        'अन्ठाउँन्न',
        'उनान्न्साठी ',
        'साठी',
        'एकसाठी',
        'बासाठी',
        'तीरसाठी',
        'चौंसाठी',
        'पैसाठी',
        'छैसठी',
        'सत्सठ्ठी',
        'अर्सठ्ठी',
        'उनन्सत्तरी',
        'सतरी',
        'एकहत्तर',
        'बहत्तर',
        'त्रिहत्तर',
        'चौहत्तर',
        'पचहत्तर',
        'छहत्तर',
        'सत्हत्तर',
        'अठ्हत्तर',
        'उनास्सी',
        'अस्सी',
        'एकासी',
        'बयासी',
        'त्रीयासी',
        'चौरासी',
        'पचासी',
        'छयासी',
        'सतासी',
        'अठासी',
        'उनान्नब्बे',
        'नब्बे',
        'एकान्नब्बे',
        'बयान्नब्बे',
        'त्रियान्नब्बे',
        'चौरान्नब्बे',
        'पंचान्नब्बे',
        'छयान्नब्बे',
        'सन्तान्‍नब्बे',
        'अन्ठान्नब्बे',
        'उनान्सय'
    ];

    tens = [
        '',
        'दस',
        'बीस',
        'तीस',
        'चालीस',
        'पचास',
        'साठी',
        'सतरी',
        'अस्सी',
        'नब्बे'
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
        ',': ',',
        '=': '.'
    };
    decimalTens;
    decimalWords;

    transform(value: any, ...args: any[]): any {
        if (!ObjectUtil.isEmpty(value)) {
            return this.numberIntoWordsNepali(value);
        }
    }


    numberIntoWordsNepaliPaisa(e) {
        console.log(e);
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
            Number(u) > 0 && (t += this.teens[u] + ' खरब'),
            Number(l) > 0 && (t += ' ' + this.teens[l] + ' अरब'),
            Number(s) > 0 && (t += ' ' + this.teens[s] + ' करोड'),
            Number(o) > 0 && (t += ' ' + this.teens[o] + ' लाख'),
            Number(i) > 0 && (t += ' ' + this.teens[i] + ' हजार'),
            Number(a) > 0 && (t += ' ' + this.teens[a] + ' सय'),
            Number(n) > 0 && (t += ' ' + this.teens[n]),
            '' !== t.trim() && (t += ''),
            r > 0 && (t += ('' !== t.trim() ? ', ' : '') + this.decimalWords),
                t
        );
    }

    numberIntoWordsNepali(e) {
        console.log(e);
        let paisa = '';
        if (isNaN(e) || '' === e) {
            return 'N/A';
        }
        let t = '';
        const r = 0;
        const afterDecimal = e.toString().split('.');
        if (afterDecimal.length > 1) {
            paisa = ' ' + 'दसमलब' + this.numberIntoWordsNepaliPaisa(afterDecimal[1]);
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
        Number(u) > 0 && (t += this.teens[u] + ' खरब'),
        Number(l) > 0 && (t += ' ' + this.teens[l] + ' अरब'),
        Number(s) > 0 && (t += ' ' + this.teens[s] + ' करोड'),
        Number(o) > 0 && (t += ' ' + this.teens[o] + ' लाख'),
        Number(i) > 0 && (t += ' ' + this.teens[i] + ' हजार'),
        Number(a) > 0 && (t += ' ' + this.teens[a] + ' सय'),
        Number(n) > 0 && (t += ' ' + this.teens[n]),
        '' !== t.trim() && (t += ''),
        r > 0 && (t += ('' !== t.trim() ? ', ' : '') + this.decimalWords),
            t);
        console.log(finalNep);
        if (finalNep === null  || finalNep === '0' || finalNep === '') {
            return 'सुन्य' + paisa;
        } else {
            return finalNep + paisa;
        }
    }

}

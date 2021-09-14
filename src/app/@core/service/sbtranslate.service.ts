import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FormGroup} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class SbTranslateService {

    apiKey = environment.GOOGLE_TRANSLATE_API_KEY;
    translateURL = 'https://translation.googleapis.com/language/translate/v2?key=' + this.apiKey;
    translateTarget = 'ne';
    translateRes = '';
    translatedValues: any = {};
    private spinner: boolean;

    constructor(readonly http: HttpClient) {
    }

    async translate(q: any) {
        return await this.http.post('' + this.translateURL, {
            'q': q,
            'target': this.translateTarget
        }).toPromise().then((res: any) => {
            return res.data.translations;
            this.spinner = false;
        }, error => {
            console.error(error);
            this.spinner = false;
        });
    }

    async translateForm(form: FormGroup) {
        const allValues = [];
        const allKeys = [];
        for (const d of Object.entries(form.controls)) {
            if (d[1].value !== null) {
                allKeys.push(d[0]);
                allValues.push(d[1].value.toString());
            }
        }
        (await this.translate(allValues)).forEach((f, index) => {
            this.translatedValues[allKeys[index]] = f.translatedText;
        });
        return this.translatedValues;
    }

}

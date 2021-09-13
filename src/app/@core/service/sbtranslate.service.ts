import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class SbTranslateService {

    apiKey = environment.GOOGLE_TRANSLATE_API_KEY;
    translateURL = 'https://translation.googleapis.com/language/translate/v2?key=' + this.apiKey;
    translateTarget = 'ne';
    translateRes = '';

    constructor(readonly http: HttpClient) {
    }

    async translate(q: any) {
        return await this.http.post('' + this.translateURL, {
            'q': q,
            'target': this.translateTarget
        }).toPromise().then((res: any) => {
            return res.data.translations;
        });
    }

}

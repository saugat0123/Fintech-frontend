import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BaseService} from "../BaseService";
import {ApiUtils} from "../utils/api/ApiUtils";

@Injectable({providedIn: 'root'})
export class SbTranslateService extends BaseService<String> {
    static API = 'api/translate';
    translateRes = '';
    translatedValues: any = {};
    private spinner: boolean;

    constructor(readonly http: HttpClient) {
        super(http);
    }

    async translate(q: any) {
        this.spinner=true;
        const req = ApiUtils.getRequest(`${SbTranslateService.API}`)
        return  this.http.post(req.url, q, {headers: req.header}).toPromise().then((res: any) => {
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

    protected getApi(): string {
        return SbTranslateService.API;
    }

}

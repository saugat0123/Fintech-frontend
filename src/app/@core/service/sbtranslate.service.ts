import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {BaseService} from '../BaseService';
import {ApiUtils} from '../utils/api/ApiUtils';
import { ObjectUtil } from '../utils/ObjectUtil';

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
        this.translatedValues = {};
        this.spinner = true;
        const req = ApiUtils.getRequest(`${SbTranslateService.API}`);
        return  this.http.post(req.url, q, {headers: req.header}).toPromise().then((res: any) => {
            return res.data.translations;
            this.spinner = false;
        }, error => {
            console.error(error);
            this.spinner = false;
        });
    }

    async translateForm(form: FormGroup, formArrayData?, index?) {
        if (!ObjectUtil.isEmpty(form.get(`${formArrayData}`)) && formArrayData) {
            const allValues = [];
            const allKeys = [];
            // to map form array values that located inside the formControl
            const formArrayDataArrays: FormArray = form.get(`${formArrayData}`) as FormArray;
            let a: any;
            a = formArrayDataArrays.controls;
            for (let i = 0; i < a.length; i++) {
                if (i === index) {
                    const individualData = a[i] as FormGroup;
                    for (const d of Object.entries(individualData.controls)) {
                        if (d[1].value && d[1].value !== undefined) {
                            allKeys.push(d[0]);
                            allValues.push(d[1].value.toString());
                        }
                    }
                }
            }
            const translatedAllValues = await this.translate(allValues);
            if (!ObjectUtil.isEmpty(translatedAllValues)) {
                translatedAllValues.forEach((f, index) => {
                    this.translatedValues[allKeys[index]] = f.translatedText;
                });
                return this.translatedValues;
            } else {
                return '';
            }
        } else {
            const allValues = [];
            const allKeys = [];
            // to map normal formcontrol values
            for (const d of Object.entries(form.controls)) {
                if (d[1].value !== null && d[0] !== formArrayData && d[1].value !== undefined) {
                    allKeys.push(d[0]);
                    allValues.push(d[1].value.toString());
                }
            }
            const translatedAllValues = await this.translate(allValues);
            if (!ObjectUtil.isEmpty(translatedAllValues)) {
                translatedAllValues.forEach((f, index) => {
                    this.translatedValues[allKeys[index]] = f.translatedText;
                });
                return this.translatedValues;
            } else {
                return '';
            }
        }
    }

    protected getApi(): string {
        return SbTranslateService.API;
    }

}

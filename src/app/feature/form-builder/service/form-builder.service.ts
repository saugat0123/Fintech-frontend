import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FormBuilderService extends BaseService<any> {

    static API = 'v1/forms';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    public getApi(): string {
        return FormBuilderService.API;
    }
}

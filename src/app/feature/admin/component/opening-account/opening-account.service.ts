import {Injectable} from '@angular/core';
import {BaseService} from '../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {OpeningForm} from '../../modal/openingForm';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OpeningAccountService extends BaseService<OpeningForm> {
    static API = 'v1/accountOpening';
    private openingForm: OpeningForm = new OpeningForm();

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return OpeningAccountService.API;
    }

    public getStatus(): Observable<any> {
        const api = `${this.getApi()}/statusCount`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url);
    }

    getByPostOpeningAccount(model, page, size, accountStatus) {
        const api = `${this.getApi()}/list?accountStatus=${accountStatus}?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, model);

    }

    getA(model, page, size, accountStatus) {
        const url: string = this.getApi() + '/list' + '?accountStatus=' + accountStatus + '&page=' + page + '&size=' + size;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model);
    }

    setOpeningForm(openingForm) {
        this.openingForm = openingForm;
    }

    getOpeningForm(): OpeningForm {
        return this.openingForm;
    }

}

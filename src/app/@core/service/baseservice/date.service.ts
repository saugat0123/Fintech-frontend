import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class DateService {
    static API = 'v1/date';

    constructor(private http: HttpClient) {
    }

    getDateInNepali(englishDate: string) {
        const getUrl = ApiUtils.getRequest(`${DateService.API}/nepali-date?date=${englishDate}`);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

}



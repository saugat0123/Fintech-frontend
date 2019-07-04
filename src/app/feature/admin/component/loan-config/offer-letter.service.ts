import {BaseService} from '../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {OfferLetter} from '../../modal/offerLetter';

@Injectable({
    providedIn: 'root'
})
export class OfferLetterService extends BaseService<OfferLetter> {
    static API = 'v1/offer-letter';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    public getApi(): string {
        return OfferLetterService.API;
    }

}

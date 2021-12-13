import { Injectable} from '@angular/core';


export class PendingSearch {
    loanType: any;
    type: any;
}
@Injectable({
    providedIn: 'root'
})
export class PendingService {
    search: PendingSearch = new PendingSearch();

}

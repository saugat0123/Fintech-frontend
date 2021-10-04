import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Proposal} from '../../admin/modal/proposal';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class ProposalService extends BaseService<Proposal> {
    static API = 'v1/proposal';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return ProposalService.API;
    }

    public saveProposal(proposalId, proposal: Proposal) {
        const api = `${this.getApi()}/${proposalId}`;
        const req = ApiUtils.getRequest(api);

        return this.http.put(req.url, proposal, {headers: req.header});
    }
}

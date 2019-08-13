import {LegalStatus} from './legal-status';
import {Capital} from './capital';
import {Swot} from './swot';
import {ManagementTeam} from './management-team';
import {Proprietors} from './proprietors';

export class EntityInfo {
    id: number;
    legalStatus: LegalStatus;
    capital: Capital;
    swot: Swot;
    managementTeamList: Array<ManagementTeam>;
    proprietorsList: Array<Proprietors>;
    companyName: string;
    registrationNumber: string;
    version: number;
}

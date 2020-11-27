import {OfferLetter} from '../../admin/modal/offerLetter';
import {BaseEntity} from '../../../@core/model/base-entity';
import {User} from '../../admin/modal/user';

export class CustomerOfferLetterPath extends BaseEntity {
    path: string;
    pathSigned: string;
    initialInformation: string;
    supportedInformation: string;
    offerLetter: OfferLetter;
    isApproved: Boolean;
    approvedBy: User;
    lastModifiedAt: any;
}

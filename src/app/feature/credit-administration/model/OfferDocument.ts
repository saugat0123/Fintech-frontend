import {BaseEntity} from '../../../@core/model/base-entity';

export class OfferDocument extends BaseEntity{
    docName: string;
    initialInformation: string;
    supportedInformation: string;
    pathSigned: string;
    draftPath: string;
}
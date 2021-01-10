import {BaseEntity} from '../../../@core/model/base-entity';
import {OfferDocType} from './OfferDocType';

export class OfferDocument extends BaseEntity{
    docName: string;
    initialInformation: string;
    supportedInformation: string;
    pathSigned: string;
    draftPath: string;
    offerDocType: OfferDocType;
}
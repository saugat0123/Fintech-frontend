import {OfferLetter} from '../../admin/modal/offerLetter';
import {BaseEntity} from '../../../@core/model/base-entity';

export class CustomerOfferLetterPath extends BaseEntity {
  path: string;
  initialInformation: string;
  supportedInformation: string;
  offerLetter: OfferLetter;
}

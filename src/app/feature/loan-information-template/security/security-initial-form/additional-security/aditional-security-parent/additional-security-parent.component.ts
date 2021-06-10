import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Security} from '../../../../../loan/model/security';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {ShareSecurity} from '../../../../../admin/modal/shareSecurity';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Province} from '../../../../../admin/modal/province';
import {District} from '../../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../../admin/modal/municipality_VDC';
import {Address} from '../../../../../loan/model/address';
import {Guarantor} from '../../../../../loan/model/guarantor';
import {SecurityGuarantee} from '../../../../model/security-guarantee';
import {LandAndBuildingLocation} from '../../../../model/land-and-building-location';
import {VehicleSecurityCoverage} from '../../../../model/vehicle-security-coverage';
import {SecurityCoverageAutoPrivate} from '../../../../model/security-coverage-auto-private';
import {SecurityCoverageAutoCommercial} from '../../../../model/security-coverage-auto-commercial';
import {RoadAccess} from '../../../../../admin/modal/crg/RoadAccess';
import {FacCategory} from '../../../../../admin/modal/crg/fac-category';
import {environment} from '../../../../../../../environments/environment';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '../../../../../../@core/utils';
import {CustomerType} from '../../../../../customer/model/customerType';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerShareData} from '../../../../../admin/modal/CustomerShareData';
import {AdditionalSecurity} from '../../../../../loan/model/additional-security';
import {AdditionalSecurityComponent} from '../additional-security-child/additional-security.component';
import {add} from 'ionicons/icons';

@Component({
  selector: 'app-additional-security-parent',
  templateUrl: './additional-security-parent.component.html',
  styleUrls: ['./additional-security-parent.component.scss']
})
export class AdditionalSecurityParentComponent implements OnInit {
  @Input() additionalSecurityValue: Array<AdditionalSecurity>;
  @Input() calendarType: CalendarType;
  @Input() loanTag: string;
  @Output() additionalSecurityDataEmitter = new EventEmitter();
  @Input() fromProfile;
  @Input() shareSecurity: ShareSecurity;
  @Input() isMicroCustomer: boolean;
  @Input() isContainedApprovedLoan;
  @Input() customerInfoId: number;

  constructor() {
  }

  ngOnInit() {}
}

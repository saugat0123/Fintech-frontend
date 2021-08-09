import {Component, ChangeDetectionStrategy, NgModule} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
@Component({
    selector: 'app-customerprofile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './customerprofile.component.html',
    styleUrls: ['./customerprofile.component.scss']
})

export class CustomerprofileComponent  {
    customerInfo: CustomerInfoData;
}


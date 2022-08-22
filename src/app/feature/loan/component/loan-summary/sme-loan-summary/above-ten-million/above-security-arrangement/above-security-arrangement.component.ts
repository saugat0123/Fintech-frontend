import { Component, OnInit, Input } from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {Security} from '../../../../../model/security';
import {ShareSecurity} from '../../../../../../admin/modal/shareSecurity';

@Component({
  selector: 'app-above-security-arrangement',
  templateUrl: './above-security-arrangement.component.html',
  styleUrls: ['./above-security-arrangement.component.scss']
})
export class AboveSecurityArrangementComponent implements OnInit {
  @Input() security: Security;
  @Input() shareSecurity: ShareSecurity;
  @Input() docStatus;
  formData: Object;

  proposedSecurity1: { owner: string, location: string, plot: string, area: string,
    considerValue: number, marketValue: number, distressValue: number
  } [] = [];
  existingSecurity1: { owner: string, location: string, plot: string, area: string,
    considerValue: number, marketValue: number, distressValue: number
  } [] = [];
  existingAsPropose1: { owner: string, location: string, plot: string, area: string,
    considerValue: number, marketValue: number, distressValue: number
  } [] = [];

  totalMV = 0;
  totalFMV = 0;
  totalDV = 0;
  totalMVEx = 0;
  totalFMVEx = 0;
  totalDVEx = 0;
  totalMVAsPs = 0;
  totalFMVAsPs = 0;
  totalDVAsPs = 0;


  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.security)) {
      this.formData = JSON.parse(this.security.data);
    }
    if (this.formData['selectedArray'] !== undefined) {
      if (this.formData['initialForm'] !== undefined) {
        const landDetail = this.formData['initialForm']['landDetails'];
        landDetail.forEach((d, i) => {
          if (d.forProposed) {
            this.totalMV += Number(d.landConsideredValue);
            this.totalFMV += Number(d.marketValue);
            this.totalDV += Number(d.distressValue);

            this.proposedSecurity1.push({
              owner: d.owner,
              location: d.location,
              plot: d.plotNumber,
              area: d.areaFormat,
              considerValue: d.landConsideredValue,
              marketValue: d.marketValue,
              distressValue: d.distressValue,
            });

          }
          if (d.forExisting) {
            this.totalMVEx += Number(d.landConsideredValue);
            this.totalFMVEx += Number(d.marketValue);
            this.totalDVEx += Number(d.distressValue);
            this.existingSecurity1.push({
              owner: d.owner,
              location: d.location,
              plot: d.plotNumber,
              area: d.areaFormat,
              considerValue: d.landConsideredValue,
              marketValue: d.marketValue,
              distressValue: d.distressValue,
            });

          }
          if (d.existingAsProposed) {
            this.totalMVAsPs += Number(d.landConsideredValue);
            this.totalFMVAsPs += Number(d.marketValue);
            this.totalDVAsPs += Number(d.distressValue);
            this.existingAsPropose1.push({
              owner: d.owner,
              location: d.location,
              plot: d.plotNumber,
              area: d.areaFormat,
              considerValue: d.landConsideredValue,
              marketValue: d.marketValue,
              distressValue: d.distressValue,
            });

          }
        });

        const landBuildings = this.formData['initialForm']['landBuilding'];
        landBuildings.forEach((d, i) => {
          if (d.forProposed) {
            this.totalMV += Number(d.landConsideredValue);
            this.totalFMV += Number(d.marketValue);
            this.totalDV += Number(d.distressValue);

            this.proposedSecurity1.push({
              owner: d.owner,
              location: d.location,
              plot: d.plotNumber,
              area: d.areaFormat,
              considerValue: d.landConsideredValue,
              marketValue: d.marketValue,
              distressValue: d.distressValue,
            });

          }
          if (d.forExisting) {
            this.totalMVEx += Number(d.landConsideredValue);
            this.totalFMVEx += Number(d.marketValue);
            this.totalDVEx += Number(d.distressValue);
            this.existingSecurity1.push({
              owner: d.owner,
              location: d.location,
              plot: d.plotNumber,
              area: d.areaFormat,
              considerValue: d.landConsideredValue,
              marketValue: d.marketValue,
              distressValue: d.distressValue,
            });

          }
          if (d.existingAsProposed) {
            this.totalMVAsPs += Number(d.landConsideredValue);
            this.totalFMVAsPs += Number(d.marketValue);
            this.totalDVAsPs += Number(d.distressValue);
            this.existingAsPropose1.push({
              owner: d.owner,
              location: d.location,
              plot: d.plotNumber,
              area: d.areaFormat,
              considerValue: d.landConsideredValue,
              marketValue: d.marketValue,
              distressValue: d.distressValue,
            });

          }
        });
      }
    }
  }

}

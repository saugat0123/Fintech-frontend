import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';

@Component({
  selector: 'app-remit-loan-view',
  templateUrl: './remit-loan-view.component.html',
  styleUrls: ['./remit-loan-view.component.scss']
})
export class RemitLoanViewComponent implements OnInit {

  constructor( private location: AddressService) { }
@Input() selectedIdData;
  @Input() ref;
  beneficiaryData: any;
  senderData: any;
  data: any;
  proposalData: any;
  agentData: any;
  province;
  district;
  municipality;
  isLoaded = false;

  ngOnInit() {

    try {
      this.agentData = JSON.parse(this.selectedIdData.agentData);
      this.senderData = JSON.parse(this.selectedIdData.senderData);
      this.beneficiaryData = JSON.parse(this.selectedIdData.beneficiaryData);
      this.getAddress();

    } catch (ex) {

    }

  }
  getAddress() {
    this.location.getProvince().subscribe((response: any) => {
      response.detail.forEach(d => {
        if (d.id.toString() === this.beneficiaryData.beneficiaryAddress.benef_permanent_state.toString()) {
          this.province = d;
        }
      });
      if (!ObjectUtil.isEmpty(this.province)) {
        this.location.getDistrictByProvince(this.province).subscribe(
            (res: any) => {
              res.detail.forEach(d => {
                if (d.id.toString() === this.beneficiaryData.beneficiaryAddress.benef_permanent_district.toString()) {
                  this.district = d;
                }
              });
              if (!ObjectUtil.isEmpty(this.district)) {
                this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
                    (resp: any) => {
                      resp.detail.forEach(d => {
                        if (d.id.toString() === this.beneficiaryData.beneficiaryAddress.benef_permanent_municipality.toString()) {
                          this.municipality = d;
                        }
                      });
                      this.isLoaded = true;
                    }
                );
              }
            }
        );
      }
    });
  }

}

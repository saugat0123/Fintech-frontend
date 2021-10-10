import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';

@Component({
    selector: 'app-remit-details',
    templateUrl: './remit-details.component.html',
    styleUrls: ['./remit-details.component.scss']
})
export class RemitDetailsComponent implements OnInit {

    constructor(
        private location: AddressService,
    ) {
    }

    @Input() loanHolder;
    remit: any;
    agentDetails: any;
    beneficiaryDetails: any;
    senderDetails: any;
    documentDetails: any;
    isNull = true;
    newDocDetails = [];
    province;
    district;
    municipality;
    isLoaded = false;
    ngOnInit() {
        this.remit = this.loanHolder.remitCustomer;
        if (this.remit !== null || !ObjectUtil.isEmpty(this.remit)) {
            this.isNull = false;
            this.agentDetails = JSON.parse(this.remit.agentData);
            this.senderDetails = JSON.parse(this.remit.senderData);
            this.beneficiaryDetails = JSON.parse(this.remit.beneficiaryData);
            this.documentDetails = JSON.parse(this.remit.remitFilePathData);
        }
        this.documentDetails.forEach((data, i) => {
            if (data instanceof Array) {
            } else {
                this.newDocDetails.push(data);
            }
        });
        this.getAddress();
    }

    getAddress() {
        this.location.getProvince().subscribe((response: any) => {
            response.detail.forEach(d => {
                if (d.id.toString() === this.beneficiaryDetails.beneficiaryAddress.benef_permanent_state.toString()) {
                    this.province = d;
                }
            });
            if (!ObjectUtil.isEmpty(this.province)) {
                this.location.getDistrictByProvince(this.province).subscribe(
                    (res: any) => {
                        res.detail.forEach(d => {
                            if (d.id.toString() === this.beneficiaryDetails.beneficiaryAddress.benef_permanent_district.toString()) {
                                this.district = d;
                            }
                        });
                        if (!ObjectUtil.isEmpty(this.district)) {
                            this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
                                (resp: any) => {
                                    resp.detail.forEach(d => {
                                        if (d.id.toString() === this.beneficiaryDetails.beneficiaryAddress.benef_permanent_municipality.toString()) {
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
    opendocument(filePath: any) {
        let fileName = filePath.fullpath;
        const link = document.createElement('a');
        link.href = fileName;
        link.target = '_blank';
        link.click();
    }

}

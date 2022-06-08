import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-crg-gamma-detail-view',
    templateUrl: './crg-gamma-detail-view.component.html',
    styleUrls: ['./crg-gamma-detail-view.component.scss']
})
export class CrgGammaDetailViewComponent implements OnInit {

    @Input() formData: any;
    crgGammaList = [];
    crgGammaData;
    spinner = false;

    constructor(
        private modalService: NgbModal,
    ) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.formData) && this.formData) {
            this.crgGammaData = this.formData.data ? JSON.parse(this.formData.data) : this.formData.data;
            console.log('crgGammaData', this.crgGammaData);
            this.crgGammaData.groupObject.forEach(obj => {
                const crgData = {
                    groupName: null,
                    ansModel: null,
                    groupTotal: null
                };
                const dataWithGroup = [];
                let ansModel;
                for (const [key, value] of Object.entries(obj.gammaQuestionAnswer)) {
                    ansModel = {
                        question: null,
                        answer: null,
                        score: null,
                    };
                    if (!(key.includes(`Parameter`))) {
                        ansModel.question = key;
                        ansModel.answer = obj.gammaQuestionAnswer[`${key}Parameter`];
                        ansModel.score = value;
                        dataWithGroup.push(ansModel);
                    }
                    crgData.groupName = obj.groupName;
                    crgData.groupTotal = obj.groupTotal;
                    crgData.ansModel = dataWithGroup;
                }
                this.crgGammaList.push(crgData);
            });
        }
    }

    onClose() {
        this.modalService.dismissAll();
    }
}

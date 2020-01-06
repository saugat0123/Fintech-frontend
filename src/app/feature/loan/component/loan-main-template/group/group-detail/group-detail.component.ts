import {Component , Input , OnInit} from '@angular/core';
import {FormArray , FormBuilder , FormGroup} from '@angular/forms';

@Component({
    selector: 'app-group-detail' ,
    templateUrl: './group-detail.component.html' ,
    styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
    detailGroup: FormGroup;
    @Input() data: any;

    constructor(
        private detailBuild: FormBuilder
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (this.data !== undefined) {
            this.data.groupDetail.detailArray.forEach((value) => {
                this.setDetailData(value);
            });
        } else {
            this.addGroupDetail();
        }
    }

    buildForm() {
        this.detailGroup = this.detailBuild.group({detailArray: this.detailBuild.array([])});
    }

    addGroupDetail() {
        const detailArray = this.detailGroup.get('detailArray') as FormArray;
        detailArray.push(
            this.detailBuild.group({
                name: [undefined] ,
                facility: [undefined] ,
                limit: [undefined] ,
                rate: [undefined] ,
                os: [undefined] ,
                date: [undefined]
            })
        );
    }

    setDetailData(value) {
        const detailArray = this.detailGroup.get('detailArray') as FormArray;
        detailArray.push(
            this.detailBuild.group({
                name: [value.name] ,
                facility: [value.facility] ,
                limit: [value.limit] ,
                rate: [value.rate] ,
                os: [value.os] ,
                date: [value.date]
            })
        );
    }

    removeGroupDetails(index: number) {
        (this.detailGroup.get('detailArray') as FormArray).removeAt(index);
    }

}

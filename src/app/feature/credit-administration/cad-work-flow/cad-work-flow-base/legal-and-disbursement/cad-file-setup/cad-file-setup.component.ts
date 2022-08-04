import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {DocumentService} from '../../../../../admin/component/document/document.service';
import {Status} from '../../../../../../@core/Status';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';
import {Document} from '../../../../../admin/modal/document';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CustomerType} from '../../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../../customer/model/customerSubType';

@Component({
    selector: 'app-cad-file-setup',
    templateUrl: './cad-file-setup.component.html',
    styleUrls: ['./cad-file-setup.component.scss']
})
export class CadFileSetupComponent implements OnInit {

    @Input()
    cadData: CustomerApprovedLoanCadDocumentation;
    responseDocList: Array<Document>;
    documentList = [];
    spinner = false;

    form: FormGroup;
    customerType = CustomerType;
    customerSubType = CustomerSubType;
    filteredDocumentList: any;

    constructor(private documentService: DocumentService,
                private toastService: ToastService,
                private formBuilder: FormBuilder,
                private routerService: RouterUtilsService,
                private service: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadFileSetupComponent>
    ) {
    }

    ngOnInit() {
        if (ObjectUtil.isEmpty(this.cadData.requiredDocument)) {
            this.cadData.requiredDocument = [];
        }
        this.buildForm();
        this.initial();

    }

    async initial() {
        this.spinner = true;
        this.documentService.getByLoanCycleAndStatus(12, Status.ACTIVE).subscribe(async res => {
            this.responseDocList = res.detail;
            this.responseDocList.forEach(d => {
                const dataDoc = {
                    document: null,
                    checked: null
                };
                dataDoc.document = d;
                dataDoc.checked = false;

                this.cadData.requiredDocument.forEach(e => {
                    if (d.id === e.id) {
                        dataDoc.checked = true;
                    }
                });
                this.documentList.push(dataDoc);

                this.spinner = false;

            });
            const array = (this.form.get('documents') as FormArray);
            await this.setDocumentList();
            if (!ObjectUtil.isEmpty(this.filteredDocumentList)) {
                this.filteredDocumentList.forEach(d => {
                    array.push(this.formBuilder.group({
                        document: d,
                        checked: d.checked,
                    }));
                });
            }
        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load document '));

        });
    }

    setDocumentList() {
        const tempDocumentList = [];
        const idDisplayArray = [];
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.loanHolder) && !ObjectUtil.isEmpty(this.documentList)) {
            this.documentList.forEach((val: any) => {
                const splittedDisplayName = val.document.displayName.split(' ');
                const fil = {
                    id: val.document.id,
                    lastName: splittedDisplayName[splittedDisplayName.length - 1]
                };
                idDisplayArray.push(fil);
            });
            if (!ObjectUtil.isEmpty(this.cadData.loanHolder.customerType)) {
                if (this.cadData.loanHolder.customerType === this.customerType.INDIVIDUAL) {
                    const individualFilter = idDisplayArray.filter((val: any) =>
                        val.lastName === 'Individual');
                    individualFilter.forEach((filEle: any) => {
                        tempDocumentList.push(this.documentList.filter((v: any) => v.document.id === filEle.id)[0]);
                    });
                    tempDocumentList.push(this.documentList.filter((v: any) => v.document.id === 1053)[0]);
                    this.filteredDocumentList = tempDocumentList;
                } else if (this.cadData.loanHolder.customerType === this.customerType.INSTITUTION) {
                    if (this.cadData.loanHolder.customerSubType === this.customerSubType.PARTNERSHIP.toUpperCase()) {
                        this.setInstitutionDocumentArray(idDisplayArray, 'Partnership');
                    } else if (this.cadData.loanHolder.customerSubType === this.customerSubType.PROPRIETORSHIP.toUpperCase()) {
                        this.setInstitutionDocumentArray(idDisplayArray, 'Proprietorship');
                    } else if (this.cadData.loanHolder.customerSubType === 'PRIVATE_PUBLIC') {
                        this.setInstitutionDocumentArray(idDisplayArray, 'Company');
                    }
                }
            }
        }
    }

    setInstitutionDocumentArray(idDisplayArray: any, institutionName: string) {
        const tempDocumentList = [];
        const individualFilter = idDisplayArray.filter((val: any) =>
            val.lastName === institutionName);
        individualFilter.forEach((filEle: any) => {
            tempDocumentList.push(this.documentList.filter((v: any) => v.document.id === filEle.id)[0]);
        });
        this.filteredDocumentList = tempDocumentList;
    }


    buildForm() {
        this.form = this.formBuilder.group({
            documents: this.formBuilder.array([]),
        });

    }


    save() {
        const finalDocTemp = this.form.get('documents').value;
        const finalCadDocReq = [];
        finalDocTemp.forEach(f => {
            if (f.checked) {
                const temp = f.document.document;
                finalCadDocReq.push(temp);
            }
        });
        this.spinner = true;
        this.cadData.requiredDocument = finalCadDocReq;
        this.service.saveCadDocumentBulk(this.cadData).subscribe(() => {
                this.routerService.reloadCadProfileRoute(this.cadData.id);
                this.spinner = false;
                this.closeModal();
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved data'));


            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, 'Error Saving'));
                console.log(error);
                this.spinner = false;
            }
        );
    }

    closeModal() {
        this.dialogRef.close();
    }

}

import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CreditChecklistView} from '../../loan/model/creditChecklistView';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CalendarType} from '../../../@core/model/calendar-type';
import {CustomerType} from '../../customer/model/customerType';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {SummaryType} from '../../loan/component/SummaryType';

@Component({
  selector: 'app-checklist-v0',
  templateUrl: './credit-checklist-view-v0.html'
})
// tslint:disable-next-line:component-class-suffix
export class ChecklistViewVersionZero {
  @Input() dataForEdit: any;
  @Input() version0: boolean;
  @Input() customerType: CustomerType;
}

@Component({
  selector: 'app-checklist-v1',
  templateUrl: './credit-checklist-view-v1.html'
})
// tslint:disable-next-line:component-class-suffix
export class ChecklistViewVersionOne {
  @Input() dataForEdit: any;
  @Input() version1: boolean;
  @Input() customerType: CustomerType;
}

@Component({
  selector: 'app-credit-checklist-view',
  templateUrl: './credit-checklist-view.component.html',
  styleUrls: ['./credit-checklist-view.component.scss']
})
export class CreditChecklistViewComponent implements OnInit {
  @Output() creditChecklistViewEmitter = new EventEmitter();
  @Input() formData: CreditChecklistView;
  @Input() fromProfile;
  @Input() calendarType: CalendarType;
  @Input() customerType: CustomerType;
  @Input() loanCategory;
  client = environment.client;
  clientName = Clients;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  dataForEdit;
  creditChecklistView: CreditChecklistView = new CreditChecklistView();
  @ViewChild('checklistViewVersionZero', {read: ViewContainerRef, static: true}) viewContainerRef;
  @ViewChild('checklistViewVersionOne', {read: ViewContainerRef, static: true}) viewContainerRef1;

  constructor(private formBuilder: FormBuilder, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditChecklistView = this.formData;
      this.dataForEdit = JSON.parse(this.formData.data);
      this.generateDynamicComponent();
    }
  }

  private generateDynamicComponent() {
    // Creating component version 0
    const factory = this.componentFactoryResolver.resolveComponentFactory(ChecklistViewVersionZero);
    const component: ComponentRef<ChecklistViewVersionZero> = this.viewContainerRef.createComponent(factory);
    component.instance.dataForEdit = this.dataForEdit;
    component.instance.customerType = this.customerType;
    // End of Component 1

    // Creating component version 1
    const factory1 = this.componentFactoryResolver.resolveComponentFactory(ChecklistViewVersionOne);
    const component1: ComponentRef<ChecklistViewVersionOne> = this.viewContainerRef.createComponent(factory1);
    component1.instance.dataForEdit = this.dataForEdit;
    component1.instance.customerType = this.customerType;
    // End of Component 2

    if (ObjectUtil.isEmpty(this.dataForEdit.checkVersion)) {
      component.instance.version0 = true;
    } else {
      component1.instance.version1 = true;
    }
  }
}



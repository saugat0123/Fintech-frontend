import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HirePurchaseTemplateDataComponent } from './hire-purchase-template-data.component';

describe('HirePurchaseTemplateDataComponent', () => {
  let component: HirePurchaseTemplateDataComponent;
  let fixture: ComponentFixture<HirePurchaseTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HirePurchaseTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirePurchaseTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

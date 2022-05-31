import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdhyamsilKarjaSubsidyTemplateDataComponent } from './udhyamsil-karja-subsidy-template-data.component';

describe('UdhyamsilKarjaSubsidyTemplateDataComponent', () => {
  let component: UdhyamsilKarjaSubsidyTemplateDataComponent;
  let fixture: ComponentFixture<UdhyamsilKarjaSubsidyTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdhyamsilKarjaSubsidyTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdhyamsilKarjaSubsidyTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

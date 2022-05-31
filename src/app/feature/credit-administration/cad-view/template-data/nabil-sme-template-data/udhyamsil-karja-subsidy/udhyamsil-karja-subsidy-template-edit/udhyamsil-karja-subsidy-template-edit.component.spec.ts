import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdhyamsilKarjaSubsidyTemplateEditComponent } from './udhyamsil-karja-subsidy-template-edit.component';

describe('UdhyamsilKarjaSubsidyTemplateEditComponent', () => {
  let component: UdhyamsilKarjaSubsidyTemplateEditComponent;
  let fixture: ComponentFixture<UdhyamsilKarjaSubsidyTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdhyamsilKarjaSubsidyTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdhyamsilKarjaSubsidyTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

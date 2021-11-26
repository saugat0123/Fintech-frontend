import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdslWithoutSubsidyTemplateDataComponent } from './ddsl-without-subsidy-template-data.component';

describe('DdslWithoutSubsidyTemplateDataComponent', () => {
  let component: DdslWithoutSubsidyTemplateDataComponent;
  let fixture: ComponentFixture<DdslWithoutSubsidyTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdslWithoutSubsidyTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdslWithoutSubsidyTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

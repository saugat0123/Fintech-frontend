import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdslWithoutSubsidyTemplateEditComponent } from './ddsl-without-subsidy-template-edit.component';

describe('DdslWithoutSubsidyTemplateEditComponent', () => {
  let component: DdslWithoutSubsidyTemplateEditComponent;
  let fixture: ComponentFixture<DdslWithoutSubsidyTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdslWithoutSubsidyTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdslWithoutSubsidyTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

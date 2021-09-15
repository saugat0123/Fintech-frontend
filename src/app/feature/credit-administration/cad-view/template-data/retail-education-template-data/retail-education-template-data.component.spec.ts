import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailEducationTemplateDataComponent } from './retail-education-template-data.component';

describe('RetailEducationTemplateDataComponent', () => {
  let component: RetailEducationTemplateDataComponent;
  let fixture: ComponentFixture<RetailEducationTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailEducationTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailEducationTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

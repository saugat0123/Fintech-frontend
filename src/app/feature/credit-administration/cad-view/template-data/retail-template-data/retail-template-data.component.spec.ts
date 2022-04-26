import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailTemplateDataComponent } from './retail-template-data.component';

describe('RetailTemplateDataComponent', () => {
  let component: RetailTemplateDataComponent;
  let fixture: ComponentFixture<RetailTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

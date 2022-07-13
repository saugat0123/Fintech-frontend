import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroCompanyFormComponentComponent } from './micro-company-form-component.component';

describe('MicroCompanyFormComponentComponent', () => {
  let component: MicroCompanyFormComponentComponent;
  let fixture: ComponentFixture<MicroCompanyFormComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroCompanyFormComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroCompanyFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

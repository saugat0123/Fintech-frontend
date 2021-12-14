import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroCompanyInfoViewComponent } from './micro-company-info-view.component';

describe('MicroCompanyInfoViewComponent', () => {
  let component: MicroCompanyInfoViewComponent;
  let fixture: ComponentFixture<MicroCompanyInfoViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroCompanyInfoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroCompanyInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorporateGuaranteePrintComponent } from './corporate-guarantee-print.component';

describe('CorporateGuaranteePrintComponent', () => {
  let component: CorporateGuaranteePrintComponent;
  let fixture: ComponentFixture<CorporateGuaranteePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateGuaranteePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateGuaranteePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExcelOfferLetterComponent } from './excel-offer-letter.component';

describe('ExcelOfferLetterComponent', () => {
  let component: ExcelOfferLetterComponent;
  let fixture: ComponentFixture<ExcelOfferLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

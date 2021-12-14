import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadOfferLetterModalComponent } from './cad-offer-letter-modal.component';

describe('CadOfferLetterModalComponent', () => {
  let component: CadOfferLetterModalComponent;
  let fixture: ComponentFixture<CadOfferLetterModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadOfferLetterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadOfferLetterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

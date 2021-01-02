import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadOfferLetterModalComponent } from './cad-offer-letter-modal.component';

describe('CadOfferLetterModalComponent', () => {
  let component: CadOfferLetterModalComponent;
  let fixture: ComponentFixture<CadOfferLetterModalComponent>;

  beforeEach(async(() => {
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

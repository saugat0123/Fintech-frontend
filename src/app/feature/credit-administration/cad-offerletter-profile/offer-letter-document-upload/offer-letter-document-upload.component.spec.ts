import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterDocumentUploadComponent } from './offer-letter-document-upload.component';

describe('OfferLetterDocumentUploadComponent', () => {
  let component: OfferLetterDocumentUploadComponent;
  let fixture: ComponentFixture<OfferLetterDocumentUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterDocumentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

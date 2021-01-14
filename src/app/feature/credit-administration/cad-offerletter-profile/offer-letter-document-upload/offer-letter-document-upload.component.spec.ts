import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterDocumentUploadComponent } from './offer-letter-document-upload.component';

describe('OfferLetterDocumentUploadComponent', () => {
  let component: OfferLetterDocumentUploadComponent;
  let fixture: ComponentFixture<OfferLetterDocumentUploadComponent>;

  beforeEach(async(() => {
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

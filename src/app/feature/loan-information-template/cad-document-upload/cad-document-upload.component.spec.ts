import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadDocumentUploadComponent } from './cad-document-upload.component';

describe('CadDocumentUploadComponent', () => {
  let component: CadDocumentUploadComponent;
  let fixture: ComponentFixture<CadDocumentUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadDocumentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

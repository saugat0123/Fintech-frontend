import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadDocumentUploadComponent } from './cad-document-upload.component';

describe('CadDocumentUploadComponent', () => {
  let component: CadDocumentUploadComponent;
  let fixture: ComponentFixture<CadDocumentUploadComponent>;

  beforeEach(async(() => {
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadDocumentListComponent } from './cad-document-list.component';

describe('CadDocumentListComponent', () => {
  let component: CadDocumentListComponent;
  let fixture: ComponentFixture<CadDocumentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

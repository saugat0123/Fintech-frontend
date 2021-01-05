import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadDocumentListComponent } from './cad-document-list.component';

describe('CadDocumentListComponent', () => {
  let component: CadDocumentListComponent;
  let fixture: ComponentFixture<CadDocumentListComponent>;

  beforeEach(async(() => {
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsToObtainComponent } from './documents-to-obtain.component';

describe('DocumentsToObtainComponent', () => {
  let component: DocumentsToObtainComponent;
  let fixture: ComponentFixture<DocumentsToObtainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsToObtainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsToObtainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentChecklistLiteComponent } from './document-checklist-lite.component';

describe('DocumentChecklistLiteComponent', () => {
  let component: DocumentChecklistLiteComponent;
  let fixture: ComponentFixture<DocumentChecklistLiteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentChecklistLiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentChecklistLiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentChecklistComponent } from './document-checklist.component';

describe('DocumentChecklistComponent', () => {
  let component: DocumentChecklistComponent;
  let fixture: ComponentFixture<DocumentChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

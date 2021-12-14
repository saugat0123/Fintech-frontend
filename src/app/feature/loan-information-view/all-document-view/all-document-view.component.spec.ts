import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllDocumentViewComponent } from './all-document-view.component';

describe('AllDocumentViewComponent', () => {
  let component: AllDocumentViewComponent;
  let fixture: ComponentFixture<AllDocumentViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

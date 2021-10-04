import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCheckPendingComponent } from './doc-check-pending.component';

describe('DocCheckPendingComponent', () => {
  let component: DocCheckPendingComponent;
  let fixture: ComponentFixture<DocCheckPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocCheckPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCheckPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

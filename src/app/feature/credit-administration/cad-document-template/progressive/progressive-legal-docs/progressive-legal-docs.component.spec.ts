import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProgressiveLegalDocsComponent } from './progressive-legal-docs.component';

describe('ProgressiveLegalDocsComponent', () => {
  let component: ProgressiveLegalDocsComponent;
  let fixture: ComponentFixture<ProgressiveLegalDocsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressiveLegalDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressiveLegalDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveSummarySmeComponent } from './executive-summary-sme.component';

describe('ExecutiveSummarySmeComponent', () => {
  let component: ExecutiveSummarySmeComponent;
  let fixture: ComponentFixture<ExecutiveSummarySmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveSummarySmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveSummarySmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

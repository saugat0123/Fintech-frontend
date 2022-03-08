import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveCurrentStatusComponent } from './executive-current-status.component';

describe('ExecutiveCurrentStatusComponent', () => {
  let component: ExecutiveCurrentStatusComponent;
  let fixture: ComponentFixture<ExecutiveCurrentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveCurrentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveCurrentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

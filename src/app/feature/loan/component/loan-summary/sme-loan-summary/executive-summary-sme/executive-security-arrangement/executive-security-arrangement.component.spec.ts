import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveSecurityArrangementComponent } from './executive-security-arrangement.component';

describe('ExecutiveSecurityArrangementComponent', () => {
  let component: ExecutiveSecurityArrangementComponent;
  let fixture: ComponentFixture<ExecutiveSecurityArrangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveSecurityArrangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveSecurityArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

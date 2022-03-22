import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityArrangementComponent } from './security-arrangement.component';

describe('SecurityArrangementComponent', () => {
  let component: SecurityArrangementComponent;
  let fixture: ComponentFixture<SecurityArrangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityArrangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

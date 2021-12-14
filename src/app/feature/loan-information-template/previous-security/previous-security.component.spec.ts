import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviousSecurityComponent } from './previous-security.component';

describe('PreviousSecurityComponent', () => {
  let component: PreviousSecurityComponent;
  let fixture: ComponentFixture<PreviousSecurityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

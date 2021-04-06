import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousSecurityComponent } from './previous-security.component';

describe('PreviousSecurityComponent', () => {
  let component: PreviousSecurityComponent;
  let fixture: ComponentFixture<PreviousSecurityComponent>;

  beforeEach(async(() => {
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

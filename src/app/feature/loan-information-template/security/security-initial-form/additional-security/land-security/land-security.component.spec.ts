import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSecurityComponent } from './land-security.component';

describe('LandSecurityComponent', () => {
  let component: LandSecurityComponent;
  let fixture: ComponentFixture<LandSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

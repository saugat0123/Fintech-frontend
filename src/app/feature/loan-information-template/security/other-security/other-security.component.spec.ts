import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSecurityComponent } from './other-security.component';

describe('OtherSecurityComponent', () => {
  let component: OtherSecurityComponent;
  let fixture: ComponentFixture<OtherSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

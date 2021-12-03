import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeSecurityComponent } from './sme-security.component';

describe('SmeSecurityComponent', () => {
  let component: SmeSecurityComponent;
  let fixture: ComponentFixture<SmeSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

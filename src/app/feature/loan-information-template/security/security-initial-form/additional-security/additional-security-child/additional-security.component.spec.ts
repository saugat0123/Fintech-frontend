import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSecurityComponent } from './additional-security.component';

describe('AdditionalSecurityComponent', () => {
  let component: AdditionalSecurityComponent;
  let fixture: ComponentFixture<AdditionalSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

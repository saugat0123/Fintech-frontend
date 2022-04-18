import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSmeSecondarySecurityViewComponent } from './single-sme-secondary-security-view.component';

describe('SingleSmeSecondarySecurityViewComponent', () => {
  let component: SingleSmeSecondarySecurityViewComponent;
  let fixture: ComponentFixture<SingleSmeSecondarySecurityViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSmeSecondarySecurityViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSmeSecondarySecurityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

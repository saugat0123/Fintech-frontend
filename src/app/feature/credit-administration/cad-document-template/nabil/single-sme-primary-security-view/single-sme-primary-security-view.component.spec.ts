import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSmePrimarySecurityViewComponent } from './single-sme-primary-security-view.component';

describe('SingleSmePrimarySecurityViewComponent', () => {
  let component: SingleSmePrimarySecurityViewComponent;
  let fixture: ComponentFixture<SingleSmePrimarySecurityViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSmePrimarySecurityViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSmePrimarySecurityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

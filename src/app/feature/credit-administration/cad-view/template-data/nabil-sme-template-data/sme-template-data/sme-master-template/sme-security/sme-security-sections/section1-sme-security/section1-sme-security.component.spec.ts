import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section1SmeSecurityComponent } from './section1-sme-security.component';

describe('Section1SmeSecurityComponent', () => {
  let component: Section1SmeSecurityComponent;
  let fixture: ComponentFixture<Section1SmeSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section1SmeSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section1SmeSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

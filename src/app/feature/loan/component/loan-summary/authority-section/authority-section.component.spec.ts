import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoritySectionComponent } from './authority-section.component';

describe('AuthoritySectionComponent', () => {
  let component: AuthoritySectionComponent;
  let fixture: ComponentFixture<AuthoritySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthoritySectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthoritySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

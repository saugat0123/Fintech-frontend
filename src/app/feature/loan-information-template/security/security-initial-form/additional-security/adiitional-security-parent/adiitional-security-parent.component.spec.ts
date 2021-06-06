import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdiitionalSecurityParentComponent } from './adiitional-security-parent.component';

describe('AdiitionalSecurityParentComponent', () => {
  let component: AdiitionalSecurityParentComponent;
  let fixture: ComponentFixture<AdiitionalSecurityParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdiitionalSecurityParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdiitionalSecurityParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

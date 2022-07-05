import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityTaggedComponentComponent } from './security-tagged-component.component';

describe('SecurityTaggedComponentComponent', () => {
  let component: SecurityTaggedComponentComponent;
  let fixture: ComponentFixture<SecurityTaggedComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityTaggedComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityTaggedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityTaggedViewComponent } from './security-tagged-view.component';

describe('SecurityTaggedViewComponent', () => {
  let component: SecurityTaggedViewComponent;
  let fixture: ComponentFixture<SecurityTaggedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityTaggedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityTaggedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

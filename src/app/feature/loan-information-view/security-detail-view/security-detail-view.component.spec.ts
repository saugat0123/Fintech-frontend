import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailViewComponent } from './security-detail-view.component';

describe('SecurityDetailViewComponent', () => {
  let component: SecurityDetailViewComponent;
  let fixture: ComponentFixture<SecurityDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

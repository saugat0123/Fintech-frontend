import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GammaDetailViewComponent } from './gamma-detail-view.component';

describe('GammaDetailViewComponent', () => {
  let component: GammaDetailViewComponent;
  let fixture: ComponentFixture<GammaDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GammaDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GammaDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

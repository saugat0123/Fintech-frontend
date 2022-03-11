import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveTenMillionComponent } from './above-ten-million.component';

describe('AboveTenMillionComponent', () => {
  let component: AboveTenMillionComponent;
  let fixture: ComponentFixture<AboveTenMillionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveTenMillionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveTenMillionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

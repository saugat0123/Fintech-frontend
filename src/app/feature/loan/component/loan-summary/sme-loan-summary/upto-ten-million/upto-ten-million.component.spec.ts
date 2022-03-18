import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoTenMillionComponent } from './upto-ten-million.component';

describe('UptoTenMillionComponent', () => {
  let component: UptoTenMillionComponent;
  let fixture: ComponentFixture<UptoTenMillionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoTenMillionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoTenMillionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

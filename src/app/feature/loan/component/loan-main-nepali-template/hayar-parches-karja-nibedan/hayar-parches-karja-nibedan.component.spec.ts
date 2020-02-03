import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HayarParchesKarjaNibedanComponent } from './hayar-parches-karja-nibedan.component';

describe('HayarParchesKarjaNibedanComponent', () => {
  let component: HayarParchesKarjaNibedanComponent;
  let fixture: ComponentFixture<HayarParchesKarjaNibedanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HayarParchesKarjaNibedanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HayarParchesKarjaNibedanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

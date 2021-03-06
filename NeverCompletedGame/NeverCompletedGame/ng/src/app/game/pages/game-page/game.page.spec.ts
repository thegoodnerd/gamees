import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePage } from './game.page';

describe('FlowPageComponent', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

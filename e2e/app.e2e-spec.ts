import { SquareHeroesPage } from './app.po';

describe('square-heroes App', function() {
  let page: SquareHeroesPage;

  beforeEach(() => {
    page = new SquareHeroesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

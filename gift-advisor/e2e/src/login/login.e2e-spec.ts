import {browser, by} from 'protractor';
import {LoginPage} from "./login.po";
import {SearchPage} from "../search/search.po";

describe('Login page e2e', () => {
  let page: LoginPage;
  let searchPage: SearchPage;

  beforeEach(() => {
    page = new LoginPage();
    searchPage = new SearchPage();
  });

  it('should display 2 inputs and 2 buttons', () => {
    page.navigateTo();
    expect(page.getLoginButton().isPresent);
    expect(page.getRegistryButton().isPresent);
    expect(page.getPasswordInput().isPresent);
    expect(page.getUsernameInput().isPresent);
  });

  it('should navigate to search page after correct login', () => {
    page.navigateTo();
    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();
    expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/gifts");
    expect(searchPage.geAddNewGiftButton().isPresent());
    expect(searchPage.getLogoutButton().isPresent());
    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });

  it('should navigate to search page after correct registration', () => {
    page.navigateTo();
    page.getUsernameInput().sendKeys("kek" + Math.random().toString());
    page.getPasswordInput().sendKeys("12345678");
    page.getRegistryButton().click();
    expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/gifts");
    expect(browser.element(by.buttonText("Logout")).isPresent());
    expect(browser.element(by.buttonText("Add new gift")).isPresent());
    browser.element(by.buttonText("Menu")).click();
    browser.element(by.buttonText("Logout")).click();
  });
  it('should fail login because if incorrect data', () => {
    page.navigateTo();
    page.getUsernameInput().sendKeys("username");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();
    expect(page.getErrorMessage()).toEqual("Could not login because of wrong credentials")
  });

  it('should fail registry because if incorrect data', () => {
    page.navigateTo();
    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getRegistryButton().click();
    expect(page.getErrorMessage()).toEqual("User with this username already exists, please choose another username")
  });

});

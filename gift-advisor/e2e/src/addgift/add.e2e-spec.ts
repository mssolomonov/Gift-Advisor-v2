import {AddPage} from "./add.po";
import {SearchPage} from "../search/search.po";
import {LoginPage} from "../login/login.po";
import {by, element} from "protractor";

describe('Add page e2e', () => {
  let page: LoginPage;
  let searchPage: SearchPage;
  let addPage: AddPage;

  beforeEach(() => {
    page = new LoginPage();
    searchPage = new SearchPage();
    addPage = new AddPage();
  });

  it('should login and add new gift correctly', async () => {
    await page.navigateTo();

    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();

    searchPage.getMenuButton().click();
    searchPage.geAddNewGiftButton().click();

    addPage.getNameInput().sendKeys("name");
    await addPage.getPriceInput().clear().then();
    addPage.getPriceInput().sendKeys("1.01");
    addPage.getDescriptionInput().sendKeys("13231kljljfsdf");
    addPage.getChipList().sendKeys("cup");
    addPage.getMatOption().click();

    addPage.geSubmitButton().click();
    await searchPage.navigateTo();
    await searchPage.getListElements().then(function(gifts) {
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("1.01$");
        matline.get(0).click();
    });
    expect(addPage.getNameInput().getAttribute('value')).toContain("name");
    expect(addPage.getDescriptionInput().getAttribute('value')).toContain("13231kljljfsdf");
    expect(addPage.getPriceInput().getAttribute('value')).toContain("1.01");
    expect(addPage.getMatChip().count()).toEqual(1);
    expect(addPage.getMatChip().get(0).getText()).toContain("cup");

    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });

  it('should login and can not delete gift of another user',  () => {
    page.navigateTo();

    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();

    searchPage.getMenuButton().click();
    searchPage.geAddNewGiftButton().click();

    addPage.getNameInput().sendKeys("name");
    addPage.getPriceInput().clear().then();
    addPage.getPriceInput().sendKeys("1.01");
    addPage.getDescriptionInput().sendKeys("13231kljljfsdf");
    addPage.getChipList().sendKeys("cup");
    addPage.getMatOption().click();

    addPage.geSubmitButton().click();
    addPage.getReturnButton().click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();

    searchPage.getMenuButton().click();
    searchPage.getLoginButton().click();

    page.getUsernameInput().sendKeys("solomonka");
    page.getPasswordInput().sendKeys("87654321");
    page.getLoginButton().click();

    searchPage.getListElements().then(function(gifts) {
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("1.01$");
        matline.get(0).click();
    });

    expect(addPage.getNameInput().getAttribute('value')).toContain("name");
    expect(addPage.getDescriptionInput().getAttribute('value')).toContain("13231kljljfsdf");
    expect(addPage.getPriceInput().getAttribute('value')).toContain("1.01");
    expect(addPage.getMatChip().count()).toEqual(1);
    expect(addPage.getMatChip().get(0).getText()).toContain("cup");
    expect(addPage.getDeleteButton().isPresent()).toBeFalsy();
    addPage.getReturnButton().click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();

    searchPage.getMenuButton().click();
    searchPage.getLoginButton().click();

    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();

    searchPage.getListElements().then(function(gifts) {
      let matline = gifts[gifts.length-1].all(by.className("mat-line"));
      matline.get(0).click();
    });
    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();

  });

});

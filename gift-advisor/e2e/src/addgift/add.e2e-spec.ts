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

  it('should login and can not delete gift of another user', async () => {
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
    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();

    await page.navigateTo();
    page.getUsernameInput().sendKeys("solomonka");
    page.getPasswordInput().sendKeys("87654321");
    page.getLoginButton().click();

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
    // TODO: Check condition
    expect(!addPage.getDeleteButton().isPresent());

    await searchPage.navigateTo();
    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();

    await page.navigateTo();
    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();

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

    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    await searchPage.navigateTo();
    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });


  it('should login, create and delete gift', async () => {
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

    var gifts_length = 0;
    await searchPage.navigateTo();
    await searchPage.getListElements().then(function(gifts) {
        gifts_length = gifts.length;
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("1.01$");
        matline.get(0).click();
    });
    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    await searchPage.getListElements().then(function(gifts) {
        expect(gifts.length).toBe(gifts_length - 1);
    });

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });

  it('should find gift by tag', async () => {
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
    searchPage.getSearchField().sendKeys("cup");
    searchPage.getMatOption().click();
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

    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });


  it('should find gift by price', async () => {
    await page.navigateTo();

    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();

    searchPage.getMenuButton().click();
    searchPage.geAddNewGiftButton().click();

    addPage.getNameInput().sendKeys("name");
    await addPage.getPriceInput().clear().then();
    addPage.getPriceInput().sendKeys("99999999");
    addPage.getDescriptionInput().sendKeys("13231kljljfsdf");
    addPage.getChipList().sendKeys("cup");
    addPage.getMatOption().click();

    addPage.geSubmitButton().click();

    await searchPage.navigateTo();
    var gifts_length = 0;
    await searchPage.getListElements().then(function(gifts) {
        gifts_length = gifts.length;
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("99999999$");
    });

    await searchPage.getMaxPriceField().clear().then();
    searchPage.getMaxPriceField().sendKeys("99999998");
    searchPage.getSearchButton().click();

    await searchPage.getListElements().then(function(gifts) {
        expect(gifts.length).toBe(gifts_length - 1);
    });

    searchPage.getResetFiltersButton().click();
    searchPage.getSearchButton().click();

    await searchPage.getListElements().then(function(gifts) {
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("99999999$");
        matline.get(0).click();
    });

    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });

  it('should cancel update the gift', async () => {
    await page.navigateTo();

    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();

    searchPage.getMenuButton().click();
    searchPage.geAddNewGiftButton().click();

    addPage.getNameInput().sendKeys("name");
    await addPage.getPriceInput().clear().then();
    addPage.getPriceInput().sendKeys("99999999");
    addPage.getDescriptionInput().sendKeys("13231kljljfsdf");
    addPage.getChipList().sendKeys("cup");
    addPage.getMatOption().click();

    addPage.geSubmitButton().click();

    await searchPage.navigateTo();
    var gifts_length = 0;
    await searchPage.getListElements().then(function(gifts) {
        gifts_length = gifts.length;
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("99999999$");
        matline.get(0).click();
    });

    expect(addPage.getNameInput().getAttribute('value')).toContain("name");
    expect(addPage.getDescriptionInput().getAttribute('value')).toContain("13231kljljfsdf");
    expect(addPage.getPriceInput().getAttribute('value')).toContain("99999999");
    expect(addPage.getMatChip().count()).toEqual(1);
    expect(addPage.getMatChip().get(0).getText()).toContain("cup");

    await addPage.getNameInput().clear().then();
    addPage.getNameInput().sendKeys("Not_name");
    await addPage.getDescriptionInput().clear().then();
    addPage.getDescriptionInput().sendKeys("Not_name");
    await addPage.getPriceInput().clear().then();
    addPage.getPriceInput().sendKeys("99999998");

    addPage.getReturnButton().click();

    await searchPage.getListElements().then(function(gifts) {
        expect(gifts.length).toBe(gifts_length);
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("99999999$");
        matline.get(0).click();
    });

    expect(addPage.getNameInput().getAttribute('value')).toContain("name");
    expect(addPage.getDescriptionInput().getAttribute('value')).toContain("13231kljljfsdf");
    expect(addPage.getPriceInput().getAttribute('value')).toContain("99999999");
    expect(addPage.getMatChip().count()).toEqual(1);
    expect(addPage.getMatChip().get(0).getText()).toContain("cup");

    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });

  it('should cancel delete the gift', async () => {
    await page.navigateTo();

    page.getUsernameInput().sendKeys("shemya123");
    page.getPasswordInput().sendKeys("12345678");
    page.getLoginButton().click();

    searchPage.getMenuButton().click();
    searchPage.geAddNewGiftButton().click();

    addPage.getNameInput().sendKeys("name");
    await addPage.getPriceInput().clear().then();
    addPage.getPriceInput().sendKeys("99999999");
    addPage.getDescriptionInput().sendKeys("13231kljljfsdf");
    addPage.getChipList().sendKeys("cup");
    addPage.getMatOption().click();

    addPage.geSubmitButton().click();

    await searchPage.navigateTo();
    var gifts_length = 0;
    await searchPage.getListElements().then(function(gifts) {
        gifts_length = gifts.length;
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("99999999$");
        matline.get(0).click();
    });

    expect(addPage.getNameInput().getAttribute('value')).toContain("name");
    expect(addPage.getDescriptionInput().getAttribute('value')).toContain("13231kljljfsdf");
    expect(addPage.getPriceInput().getAttribute('value')).toContain("99999999");
    expect(addPage.getMatChip().count()).toEqual(1);
    expect(addPage.getMatChip().get(0).getText()).toContain("cup");

    addPage.getDeleteButton().click();
    element(by.buttonText("Cancel")).click();

    addPage.getReturnButton().click();

    await searchPage.getListElements().then(function(gifts) {
        expect(gifts.length).toBe(gifts_length);
        let matline = gifts[gifts.length-1].all(by.className("mat-line"));
        let name = matline.get(0).getText();
        let desc = matline.get(1).getText();
        let price = matline.get(2).getText();
        expect(name).toEqual("name");
        expect(desc).toEqual("13231kljljfsdf");
        expect(price).toEqual("99999999$");
        matline.get(0).click();
    });

    expect(addPage.getNameInput().getAttribute('value')).toContain("name");
    expect(addPage.getDescriptionInput().getAttribute('value')).toContain("13231kljljfsdf");
    expect(addPage.getPriceInput().getAttribute('value')).toContain("99999999");
    expect(addPage.getMatChip().count()).toEqual(1);
    expect(addPage.getMatChip().get(0).getText()).toContain("cup");

    addPage.getDeleteButton().click();
    element(by.buttonText("Yes")).click();

    searchPage.getMenuButton().click();
    searchPage.getLogoutButton().click();
  });
});

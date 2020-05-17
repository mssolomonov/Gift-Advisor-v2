import { browser, by, element } from 'protractor';

export class SearchPage {
  navigateTo() {
    return browser.get("/gifts") as Promise<any>;
  }

  getLogoutButton(){
    return element(by.buttonText("Logout"))
  }

  geAddNewGiftButton(){
    return element(by.buttonText("Add new gift"))
  }

  getMenuButton() {
    return element(by.buttonText("Menu"))
  }

  getLoginButton() {
    return element(by.buttonText("Login"))
  }

  getListElements(){
    return element.all(by.className("mat-list-item"))
  }
}

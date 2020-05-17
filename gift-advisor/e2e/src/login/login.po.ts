import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get("/login") as Promise<any>;
  }

  getUsernameInput(){
    return element(by.name("username"))
  }

  getPasswordInput(){
    return element(by.name("password"))
  }

  getRegistryButton(){
    return element(by.buttonText("Register"))
  }

  getLoginButton(){
    return element(by.buttonText("Login"))
  }

  getErrorMessage(){
    return element(by.className("mat-error")).getText()
  }
}

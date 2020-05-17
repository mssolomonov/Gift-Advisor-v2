import { browser, by, element } from 'protractor';

export class AddPage {

  getNameInput() {
    return element(by.name("name"))
  }

  getPriceInput() {
    return element(by.name("price"))
  }

  getChipList() {
    return element(by.className("mat-chip-list"))
  }

  getDescriptionInput() {
    return element(by.name("Description"))
  }

  getAutocompleteList() {
    return element(by.className("mat-autocomplete"))
  }

  getMatOption() {
    return element(by.className("mat-option"))
  }

  getMatChip() {
    return element.all(by.className("mat-chip"))
  }

  geSubmitButton() {
    return element(by.buttonText("Add"))
  }

  getDeleteButton() {
    return element(by.buttonText("Delete"))
  }

  getReturnButton() {
    return element(by.buttonText("Return"))
  }

}

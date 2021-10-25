import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UserService';
import { MoneyService } from '../../services/MoneyService';

@Component({
  selector: 'app-coinvalues',
  templateUrl: './coinvalues.component.html',
  styleUrls: ['./coinvalues.component.css']
})
export class CoinvaluesComponent implements OnInit {

  [key: string]: any;

  public Dollar = {};
  public Shekel = {};
  public Euro = {};
  public Yen = {};
  public Pound = {};

  public options = ["Dollar", "Shekel", "Euro", "Yen", "Pound"];

  public currentValues: any[] = [];

  public currentCoin = "Dollar";

  private userService: UserService;
  private moneyService: MoneyService;

  constructor(userService: UserService, moneyService: MoneyService) {
    this.userService = userService;
    this.moneyService = moneyService;
  }

  pickCoin(value: string) {

    this.currentCoin = value;
    this.updateValues();

  }

  updateValues() {

    this.currentValues = Object.entries(this[this.currentCoin]);

  }

  ngOnInit(): void {

    this.Dollar = this.moneyService.Dollar;
    this.Shekel = this.moneyService.Shekel;
    this.Euro = this.moneyService.Euro;
    this.Yen = this.moneyService.Yen;
    this.Pound = this.moneyService.Pound;

    this.updateValues();

    // this.userService.currentlyLoggedIn();

  }

}

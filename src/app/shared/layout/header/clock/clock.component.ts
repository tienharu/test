import { Component, OnInit } from "@angular/core";

@Component({
  selector: "sa-clock",
  templateUrl: "./clock.component.html"
})
export class ClockComponent implements OnInit {
  clockVal: String;
  today: String;
  amPm: String='AM';
  constructor() {}

  ngOnInit() {
    let d = new Date();
    //this.today=new Date().toLocaleDateString()
    this.today = d.toDateString();
    this.simpleClock();
    setInterval(() => {
      this.simpleClock();
    }, 1000);
  }

  simpleClock() {
    let v = new Date(); //.toLocaleTimeString();
    let h = v.getHours();
    if (h > 12) {
      h = h - 12;
      this.amPm='PM';
    }
    var m = v.getMinutes();
    var s = v.getSeconds();
    this.clockVal = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m)  + ":" + (s < 10 ? "0" + s : s);
  }
}

import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Route } from '../../javaclasses/classes';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  constructor(
    private restService: RestService) { }

    routes = [];
    showRoute = [];

    // время начала смен
    workOrder = [];
    // переменная для вывода
    // [маршрут][смена][рейс][направление][время]
    departureTimes = [];
    timesCalculated: boolean;

  ngOnInit() {
    this.timesCalculated = false;
    // установка времени начала каждой смены
    this.setWorkOrdersTime();

    // просим маршруты
    this.restService.call('testroutes', null, 'GET')
    .subscribe((res: any) => {
      console.log(res);

      if (res.length > 0) {
           for (let i = 0; i < res.length; i++) {
            this.routes[i] = new Route(res[i]);
            this.showRoute[i] = false;
           }
      }


      this.calculateTimes();
    });


  }
  // установка времени начала каждой смены
  setWorkOrdersTime() {

    this.workOrder[0] = new Date();
    this.workOrder[0].setHours(4); // 4-11
    this.workOrder[0].setMinutes(0);

    this.workOrder[1] = new Date();
    this.workOrder[1].setHours(11); // 11-18
    this.workOrder[1].setMinutes(0);

    this.workOrder[2] = new Date();
    this.workOrder[2].setHours(18); // 18-1
    this.workOrder[2].setMinutes(0);
  }


  calculateTimes() {
    // под данные
    // корень - this.departureTimes [маршрут]
    let order = []; // [смена]
    let bus = []; // [рейс]
    let direction = []; // [направление]
    let times = []; // [время]

    // для всех маршрутов
    for (const routeNumber in this.routes) {
      // 3 смены
      for (const workOrder in this.workOrder) {
        // транспорта поедет за смену столько:
        const transportCount = this.routes[routeNumber].transportNeeded;
        const totalWorkTimeInMinutes = 420; // 7h
        // шаг между рейсами
        const timeBetweenBuses = totalWorkTimeInMinutes / transportCount;

        // для каждого автобуса на маршруте за смену (кроме первого)
        for (let transport = 0; transport < transportCount; transport++) {
        // делаем тайминги вперед:

          // начало смены
          const newTime = new Date();
          newTime.setHours(this.workOrder[workOrder].getHours());
          newTime.setUTCMinutes(0);

          // начало этого рейса
          newTime.setMinutes(newTime.getMinutes() + transport * timeBetweenBuses);
          // console.log("начало смены"+newTime);
          // делаем время для каждой остановки вперед
          for (const stop in this.routes[routeNumber].stopsList) {
            newTime.setUTCMinutes(newTime.getMinutes() + this.routes[routeNumber].stopTimings[stop]);
            // что за хрень тут с памятью?
            let temp: Date;
            temp = new Date();
            temp.setUTCHours(newTime.getUTCHours());
            temp.setUTCMinutes(newTime.getUTCMinutes());
            times.push(temp);
            // console.log("остановка"+newTime);
          }
          // сохраняем время на рейс туда
          direction.push(times);
          times = [];

          // начало этого рейса в обратную сторону (10 мин перерыв)
          newTime.setMinutes(newTime.getMinutes() + 10);
          // console.log("перерыв окончен"+newTime);
          const stopsCount = this.routes[routeNumber].stopsList.length;
          // делаем время для каждой остановки обратно
          // 0 n n-1 n-2 ... 1
          // console.log(stopsCount);
          for (let stop = 0; stop < stopsCount; stop++) {
            let curTime = stopsCount - Number(stop);
            if (curTime >= stopsCount) { curTime = 0; }
            // console.log("stop"+stop);
            // console.log("curTime"+curTime+'='+this.routes[routeNumber].stopTimings[curTime]);
            newTime.setUTCMinutes(newTime.getMinutes() + this.routes[routeNumber].stopTimings[curTime]);
            // что за хрень тут с памятью?
            let temp: Date;
            temp = new Date();
            temp.setUTCHours(newTime.getUTCHours());
            temp.setUTCMinutes(newTime.getUTCMinutes());
            times.push(temp);
            // console.log("остановка обратно"+newTime);
          }
          // console.log(" ");
          // сохраняем время на рейс обратно
          direction.push(times.reverse());
          times = [];

          // сохраняем для текущего рейса
          bus.push(direction);
          direction = [];
        }
        // сохраняем для текущей смены
        order.push(bus);
        bus = [];
      }
      // сохраняем 3 смены этого маршрута
      this.departureTimes.push(order);
      order = [];
    }
    // дело сделано
    // console.log("[маршрут][смена][рейс][направление][время]");
    // console.log(this.departureTimes);
    this.timesCalculated = true;
  }

  routeChangeVisible(i: number) {
    this.showRoute[i] = !this.showRoute[i];
  }
}

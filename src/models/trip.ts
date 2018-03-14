import { TripDuration } from './tripDuration';
import { Deal } from './deals';
import * as _ from 'lodash';

export class Trip {
     fromCity: string = '';
     toCity: string = '';
     currency: string = '';
     fullPath = [];
     totalPrice: number = 0;
     totalTimeInMinutes: number = 0;
     normalTotalTime: string;

    constructor(  fromCity,
        toCity,
        fullPath
   ) {
        this.fromCity = fromCity;
        this.toCity = toCity;
        this.fullPath = fullPath;
        this.calculateTotals();
    }

    /**
     * help method that calculate total cost and total duration of trip. Also creates a string with total duration of trip
     */
    calculateTotals(){
        let totalHoursStr:any
        let totalMinutesStr:any
        this.fullPath.forEach((deal) => {
            this.totalPrice =  this.totalPrice + deal.finalPrice;
            this.totalTimeInMinutes = this.totalTimeInMinutes + deal.duration.getTotalMinutes();
        });

        totalHoursStr =  Math.floor(this.totalTimeInMinutes / 60);
        totalMinutesStr =  this.totalTimeInMinutes % 60;
        if (totalHoursStr < 10){
             totalHoursStr = '0'+totalHoursStr;
        }
        if (totalMinutesStr < 10){
            totalMinutesStr = '0'+totalMinutesStr;
           }
        
        this.normalTotalTime = totalHoursStr+'h'+totalMinutesStr+'m';

    }
}


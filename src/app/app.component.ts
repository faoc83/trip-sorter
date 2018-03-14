import { globalConst } from './../assets/utils';
import { Deal } from './../models/deals';
import { DealsService } from './../services/deals.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GraphService } from '../services/graph.service';

 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  fromCity: FormControl;
  toCity: FormControl;
  public tripForm: FormGroup;
  arrivalCities: Array<String>;
  departureCities: Array<String>;
  buttonFilter:Array<String>;
  isTripValid: boolean = false;
  showForm:boolean = true;
  deals: any;
  fullTrip=null;
  tripFilter:string=globalConst.FILTER_CHEAPEST;
  errorMsg=null;

  constructor(private dealsService: DealsService, private graphService: GraphService) { }
  ngOnInit(): void {
   
    this.buttonFilter = [globalConst.FILTER_CHEAPEST,globalConst.FILTER_FASTEST];
    this.graphService.readDealsFile().then((deals) => {
      this.deals = deals;
      //create graph where edges are the cost between cities
      this.graphService.createGraph(globalConst.FILTER_CHEAPEST);
      //create graph where edges are the time between cities
      this.graphService.createGraph(globalConst.FILTER_FASTEST);

      this.departureCities = this.graphService.getDepartureCities();
      this.arrivalCities = this.graphService.getArrivalCities();
    });


  }

  /**
   * catch click event on filter buttons and set tripFilter with the new value
   * @param filter 
   */
  changeSortingType(filter: string) {
    this.tripFilter = filter;
  }

  /** 
   * hide results div and show search form
  */
  hideInfo(){
    this.showForm=true;
  }

  /**
   * receive form values and search trip
   */
  sortTrip(values){
      this.dealsService.findTrips(values.fromCity, values.toCity, this.tripFilter).then((trip) => {
        this.fullTrip = trip;
        this.showForm = false;
      }).catch((e)=>{
        this.errorMsg = e;
      });
   
  }

}

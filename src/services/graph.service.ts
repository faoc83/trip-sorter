import { Injectable } from '@angular/core';
import { TripDuration } from './../models/tripDuration';
import { Deal } from './../models/deals';
import { Http } from '@angular/http';
import * as _ from 'lodash';
import { globalConst } from '../assets/utils';
 

@Injectable()
export class GraphService {
   
    arrivalCities = [];
    departureCities = [];
    deals: Deal[] = [];
    cheapestMap: any = {};
    fastestMap: any = {};

    constructor(private http: Http) { }
    /**
   * load file response.json and map all the deals found to Deal Object and save it on array;
   */
    readDealsFile() {
        const self = this;
        return new Promise((resolve, reject) => {
            this.http.get('../assets/files/response.json').map(res => res.json()).subscribe((data: any) => {
                if (data && data.deals) {
                    self.deals = data.deals.map(deal => {
                        self.unique(this.arrivalCities, deal.arrival);
                        self.unique(this.departureCities, deal.departure);
                        return this.setDeal(deal);
                    });

                    resolve(self.deals);
                }
            });
        });
    }


    /**
     * create a graph with all cities (nodes) where the weight between them are the cost of
     * the trip between the cities or the time that takes to move from one to other.
     *
     * @param filterPath
     */
    createGraph(filterPath): void {
        try {
            const departureCities = this.getDepartureCities();
            const arrivalCities = this.getArrivalCities();
            const allCities = departureCities.concat(arrivalCities);

            _.forEach(allCities, (currentCity: string) => {
                const matchingDeals: Deal[] = _.filter(this.deals, (currentDeal: Deal) => {
                    return currentDeal.departure === currentCity;
                });

                if ( filterPath === globalConst.FILTER_CHEAPEST){
                    this.cheapestMap[currentCity] = {};
                } else {
                    this.fastestMap[currentCity] = {};
                }
                _.forEach(matchingDeals, (currentDeal: Deal) => {
                    if ( filterPath === globalConst.FILTER_CHEAPEST) {
                        this.cheapestMap[currentCity][currentDeal.arrival] = currentDeal.finalPrice;
                    } else {
                        this.fastestMap[currentCity][currentDeal.arrival] = currentDeal.duration.getTotalMinutes();
                    }
                });
            });

        } catch (error) {
            console.log('graph.service || createGraph || '+ error );
        }

    }


 /**
 * receive json object and map it to Deal Object;
 * @param data
 * @return deal - Deal
 */
    setDeal(data): Deal {
        let deal: Deal = null;
        if (data) {
            deal = new Deal(data.transport,
                data.departure,
                data.arrival,
                new TripDuration(parseInt(data.duration.h, 10), parseInt(data.duration.m, 10)),
                                data.cost, data.discount, data.reference );
        }
        return deal;
    }

    /**
   * auxiliar function to check if city is already on array.
   * @param arrCities
   * @param city
   */
    unique(arrCities, city) {
        if (arrCities.indexOf(city) === -1) {
            arrCities.push(city);
        }
    }

    getDepartureCities(): String[] {
        return this.departureCities.sort();
    }


    getArrivalCities(): String[] {
        return this.arrivalCities.sort();
    }

    getFastestMap(){
        return this.fastestMap;
    }

    getCheapestMap() {
        return this.cheapestMap;
    }

    getDeals(){
        return this.deals;
    }

}
import { globalConst } from './../assets/utils';
import { GraphService } from './graph.service';
import { Deal } from './../models/deals';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { TripDuration } from '../models/tripDuration';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import { Trip } from '../models/trip';


@Injectable()
export class DealsService { 
    private arrivalCities = [];
    private departureCities = [];
    deals: Deal[] = [];

    constructor(private http: Http, private graphService: GraphService) { }


    /**
     * gets the shortest path related to the selected filter.
     * @param fromCity string with departure city
     * @param toCity string with arrival city
     * @param orderBy filter
     * @returns promise
     */
    findTrips(fromCity: string, toCity: string, orderBy: string) {
        const shortesPath = (<any>window).Graph;
        return new Promise((resolve, reject) => {
            try {
                const routesMap: any = {};
                let shortestPath: string[];
                let routesGraph=null;
    
                if (fromCity === toCity) {
                    reject('Arrival and Departure are the same!');
                }
    
                if (orderBy === globalConst.FILTER_CHEAPEST) {
                    routesGraph = new shortesPath(this.graphService.getCheapestMap());
                } else {
                    routesGraph = new shortesPath(this.graphService.getFastestMap());
                }

                shortestPath = routesGraph.findShortestPath(fromCity, toCity);

                if (shortestPath) {
                    this.fillTripPath(shortestPath, orderBy).then((fullPath) => {
                        const tripForShortestPath: Trip = new Trip(fromCity, toCity, fullPath);
                        resolve(tripForShortestPath);
                    });
                }
            } catch (error) {
                console.log('deal.service || findTrips : '+ error);
                reject('Got a Problem. Please try again');

            }
        });
    }

    /**
     *for each city visited, we need to get all de deals that match with it, where de departure and arrival city fit. We got
     *  3 Deals for each (bus,car and train), after that we need to select just one.
     * the selection are made by the filter (choose the fastest or cheapest one)
     * @param shortestPath
     * @param orderBy
     */
    fillTripPath(shortestPath, orderBy) {
        return new Promise((resolve, reject) => {
            const fullPath = [];
            shortestPath.forEach((dealInShorstestPath, index) => {
                const departureCity = shortestPath[index];
                const arrivalCity = shortestPath[index + 1];
                if (arrivalCity != undefined) {
                    fullPath.push(this.graphService.getDeals().filter(currentDeal => {
                        return currentDeal.arrival === arrivalCity && currentDeal.departure === departureCity;
                    }));
                }
                if (shortestPath.length - 1 === index) {
                    let filteredFullPath;
                    if (orderBy === globalConst.FILTER_CHEAPEST) {
                        filteredFullPath = fullPath.map((deal: Deal[]) => {
                            return _.minBy(deal, function (d) { return d.finalPrice; });
                        });
                    } else {
                        filteredFullPath = fullPath.map((deal: Deal[]) => {
                            return _.minBy(deal, function (d) { return d.duration.getTotalMinutes(); });
                        });
                    }
                    resolve(filteredFullPath);
                }
            });


        });
    }

    getDepartureCities(): String[] {
        return this.departureCities;
    }


    getArrivalCities(): String[] {
        return this.arrivalCities;
    }


}

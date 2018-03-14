import { TripDuration } from './tripDuration';
export class Deal {
    transport: string = '';
     departure: string = '';
     arrival: string = '';
     duration: TripDuration = null;
     cost: number = 0;
     discount: number = 0;
     reference: string = '';
     finalPrice: number=0;

   
    constructor(
        transport: string,
        departure: string,
        arrival: string,
        duration: TripDuration,
        cost: number,
        discount: number,
        reference: string
    ) {
        this.transport = transport;
        this.departure = departure;
        this.arrival = arrival;
        this.duration = duration;
        this.cost = cost;
        this.discount = discount;
        this.reference = reference;
        this.finalPrice= this.calculatePrice(this.cost, this.discount);

    }

    /**
     * calculate discount of ticket
     * @param cost 
     * @param discount
     * @returns discount price 
     */
    calculatePrice(cost,discount): number {
        return this.discount ? this.cost - (this.cost * (this.discount / 100)) : this.cost;
    }
}

export class TripDuration {
    hours: number;
    minutes: number ;

    constructor(hours: number, minutes: number) {
        this.hours = hours;
        this.minutes = minutes;
    }

    getDuration() {
        const d = {hours: this.hours , minutes: this.minutes }
        return d;
    }

    getTotalMinutes(): number {
        return (this.hours * 60) + this.minutes;
    }
}

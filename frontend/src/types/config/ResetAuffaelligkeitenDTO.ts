export default class ResetAuffaelligkeitenDTO {
  startDateToReset: Date;
  endDateToReset: Date;

  constructor(startDateToReset: Date, endDateToReset: Date) {
    this.startDateToReset = startDateToReset;
    this.endDateToReset = endDateToReset;
  }
}

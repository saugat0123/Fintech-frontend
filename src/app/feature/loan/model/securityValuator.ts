export class SecurityValuator {
  landValuator: Array<any>;
  apartmentValuator: Array<any>;
  vehicalValuator: Array<any>;
  plantValuator: Array<any>;
  buildingValuator: Array<any>;
  constructor(landValuator = [] , apartmentValuator = [], vehicalValuator = [], plantValuator = [], buildingValuator = []) {
    this.landValuator = landValuator;
    this.apartmentValuator = apartmentValuator;
    this.vehicalValuator = vehicalValuator;
    this.plantValuator = plantValuator;
    this.buildingValuator = buildingValuator;
  }
}

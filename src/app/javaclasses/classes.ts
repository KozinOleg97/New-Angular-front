
export class Employees{

    private _employeeId: number;

    public get employeeId(): number {
        return this._employeeId;
    }
    public set employeeId(value: number) {
        this._employeeId = value;
    }

    private _accessLevel: number;

    public get accessLevel(): number {
        return this._accessLevel;
    }
    public set accessLevel(value: number) {
        this._accessLevel = value;
    }

    private _isAvailable: boolean;

    public get isAvailable(): boolean {
        return this._isAvailable;
    }
    public set isAvailable(value: boolean) {
        this._isAvailable = value;
    }

    private _fio: string;

    public get fio(): string {
        return this._fio;
    }
    public set fio(value: string) {
        this._fio = value;
    }


    private _role: string;

    public get role(): string {
        return this._role;
    }
    public set role(value: string) {
        this._role = value;
    }

    private _timeMode: number;

    public get timeMode(): number {
        return this._timeMode;
    }
    public set timeMode(value: number) {
        this._timeMode = value;
    }

   constructor(res:any){
    this._accessLevel=res.accessLevel;
    this._employeeId=res.employeeId
    this._fio=res.fio;
    this._isAvailable=res.isAvailable;
    this._role=res.role;
    this._timeMode=res.timeMode;
   }
}

export class Route{
    private _routeId: number;
    public get routeId(): number {
        return this._routeId;
    }
    public set routeId(value: number) {
        this._routeId = value;
    }
    private _sign: string;
    public get sign(): string {
        return this._sign;
    }
    public set sign(value: string) {
        this._sign = value;
    }
    private _stopsList: string[];
    public get stopsList(): string[] {
        return this._stopsList;
    }
    public set stopsList(value: string[]) {
        this._stopsList = value;
    }
    private _stopTimings: number[];
    public get stopTimings(): number[] {
        return this._stopTimings;
    }
    public set stopTimings(value: number[]) {
        this._stopTimings = value;
    }
    private _transportNeeded: number;
    public get transportNeeded(): number {
        return this._transportNeeded;
    }
    public set transportNeeded(value: number) {
        this._transportNeeded = value;
    }

    constructor(res:any){
        this._routeId = res.routeId;
        this._sign = res.sign;

        this._stopTimings=[];
        let temp:string;
        let temp2:string[];
        temp = res.stopTimings;
        if(temp!=undefined){
            temp2=temp.split(',');
            for(var i in temp2)
            this._stopTimings.push(Number(temp2[i]));
        }
        
        this._stopsList=[];
        temp = res.stopsList;
        if(temp!=undefined){
            this.stopsList=temp.split(',');
            this._transportNeeded=Number(res.transportNeeded);
        }   
    }
}

export class Transport{
    private _transportId: number;
    public get transportId(): number {
        return this._transportId;
    }
    public set transportId(value: number) {
        this._transportId = value;
    }
    private _number: string;
    public get number(): string {
        return this._number;
    }
    public set number(value: string) {
        this._number = value;
    }
    private _isAvailable: boolean;
    public get isAvailable(): boolean {
        return this._isAvailable;
    }
    public set isAvailable(value: boolean) {
        this._isAvailable = value;
    }

    constructor(res:any){
        this._isAvailable=res.isAvailable;
        this._number=res.number;
        this._transportId=res.transportId;
    }

}

export class Schedule{
    private _currentDriver: Employees;
    public get currentDriver(): Employees {
        return this._currentDriver;
    }
    public set currentDriver(value: Employees) {
        this._currentDriver = value;
    }
    private _currentRoute: Route;
    public get currentRoute(): Route {
        return this._currentRoute;
    }
    public set currentRoute(value: Route) {
        this._currentRoute = value;
    }
    private _transporttransportId: Transport;
    public get transporttransportId(): Transport {
        return this._transporttransportId;
    }
    public set transporttransportId(value: Transport) {
        this._transporttransportId = value;
    }
    private _date: Date;
    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }
    private _recordId: number;
    public get recordId(): number {
        return this._recordId;
    }
    public set recordId(value: number) {
        this._recordId = value;
    }
    private _workOrder: number;
    public get workOrder(): number {
        return this._workOrder;
    }
    public set workOrder(value: number) {
        this._workOrder = value;
    }
    constructor(res:any){
        this._currentDriver=res.currentDriver;
        this._currentRoute=res.currentRoute;
        this._transporttransportId=res.transporttransportId;
        this._date=new Date();
        this._date.setTime(res.date);
        this._recordId = res.recordId;
        this._workOrder = res.workOrder;
    }
}
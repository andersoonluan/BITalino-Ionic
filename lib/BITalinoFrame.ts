export class BITalinoFrame {

    crc: number;
    seq: number;
    analog: Array<number> = new Array(6);
    digital: Array<number> = new Array(3);

    // Default constructor
    constructor() { }

    // Get CRC Number
    getCRC() : number{
        return this.crc;
    }

    // Set number to CRC variable.
    setCRC(cRC: number) : void {
        this.crc = cRC;
    }

    // Get Sequence numbers.
    getSequence() : number {
        return this.seq;
    }

    // Set Sequence number to variable.
    setSequence(sequence: number) : void {
        this.seq = sequence;
    }

    // Get number analogic.
    getAnalog(pos: number){
        return this.analog[pos];
    }

    // Set position and value to array analog.
    setAnalog(pos: number, value: number) : void {
        try {
            this.analog[pos] = value;
        }catch(e){
            throw new Error("Index Out of Bounds");
        }
    }

    // Get digital number
    getDigital(pos: number) {
        return this.digital[pos];
    }

    // Set position and value to digital array.
    setDigital(pos: number, value:number) : void {
        try {
            this.digital[pos] = value;
        }catch(e){
            throw new Error("Index Out of Bounds");
        }
    }
}
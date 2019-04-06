import { BITalinoErrorTypes } from './BITalinoErrorTypes';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BITalinoFrameDecoder } from './BITalinoFrameDecoder';
import { BITalinoFrame } from './BITalinoFrame';


export class BITalinoDevice {
    public bluetoothSerial: BluetoothSerial
    public bitalinoFrameDecoder: BITalinoFrameDecoder
    
    SLEEP: number = 500;
    analogChannels: Array<number>;
    sampleRate: number;
    totalBytes: number;
    prevSeq: number;

    public BITalinoDevice(samplerate: number, analogChannels: Array<number>) : void {
        try{
            this.prevSeq = 15;
            // Validate sampleRate
            this.sampleRate = samplerate != 1 && samplerate != 10 && samplerate != 100
                && samplerate != 1000 ? 1000 : samplerate;

            // Validate analog channels length
            if(analogChannels.length < 1 || analogChannels.length > 6){
                throw new Error(BITalinoErrorTypes.INVALID_ANALOG_CHANNELS);
            }

            // validate analog channels identifiers
            for(let i=0; i < analogChannels.length; i++){
                if(analogChannels[i] < 0 || analogChannels[0] > 5){
                    throw new Error(BITalinoErrorTypes.INVALID_ANALOG_CHANNELS);
                }
            }

            // Ordena os arrays.
            analogChannels.sort();

        // calculate totalBytes based on number of used analog channels
        this.totalBytes = analogChannels.length <= 4 ?  Number(Math.ceil((12 + 10 * analogChannels.length) / 8)) 
                                                     :  Number(Math.ceil((52 + 6 * (analogChannels.length - 4)) / 8));
            
        }catch(e){
            throw new Error(BITalinoErrorTypes.UNDEFINED);
        }
    }

    public open() : void {
        try {
            let command = 0;
            switch (this.sampleRate) {
                case 1000:
                    command = 0x3;
                    break;
                case 100:
                    command = 0x2;
                    break;
                case 10:
                    command = 0x1;
                    break;
                case 1:
                    command = 0x0;
                    break;
            }
            command = (command << 6) | 0x03;
            this.bluetoothSerial.write([command]).then((success) =>{
                console.log(`Success!`);
            }, () => {
                throw new Error(BITalinoErrorTypes.FAILED);
            })
        }catch(e){
            throw new Error(BITalinoErrorTypes.LOST_COMMUNICATION);
        }
    }

    public start() : void {
        try {
           let bit = 1;
           for(let i=0; i < this.analogChannels.length; i++){
               bit = bit | 1 << (2 + this.analogChannels[i]);
           }
            this.bluetoothSerial.write([bit]).then((success) =>{
                console.log(`Success!`);
            }, () => {
                throw new Error(BITalinoErrorTypes.FAILED);
            })
        }catch(e){
            throw new Error(BITalinoErrorTypes.BT_DEVICE_NOT_CONNECTED);
        }
    }

    public stop() : void {
        try{
            this.bluetoothSerial.write([0]).then((success) =>{
                console.log(`Success!`);
            }, () => {
                throw new Error(BITalinoErrorTypes.FAILED);
            })
        }catch(e){
            throw new Error(BITalinoErrorTypes.BT_DEVICE_NOT_CONNECTED);
        }
    }

    public read(numberOfSamples: number, data: any) : BITalinoFrame[] {
        try{
            let frames: Array<BITalinoFrame> = new BITalinoFrame[numberOfSamples];
            let buffer: Uint8Array = new Uint8Array[data];
            let sampleCounter = 0;

            while(sampleCounter < numberOfSamples){

                let f: BITalinoFrame = this.bitalinoFrameDecoder.decode(buffer, this.analogChannels, this.totalBytes);

                // if CRC isn't valid, sequence equals -1
                if(f.getSequence() == -1){
                    // we're missing data, so let's wait and try to rebuild the buffer or
                    // throw exception
                    console.log("Missed a sequence. Are we too far from BITalino? Retrying..");
                }
                else if(f.getSequence() != (this.prevSeq + 1) % 16){
                    console.log("Sequence out of order.")
                }

                this.prevSeq = f.getSequence();
                frames[sampleCounter] = f;
                sampleCounter++;
            }
            return frames;

        }catch(e){
            throw new Error(BITalinoErrorTypes.LOST_COMMUNICATION);
        }
    }
}
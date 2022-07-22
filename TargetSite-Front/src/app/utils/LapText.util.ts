import { LapModel } from "../domain/model/Lap.model";

export class LapTextUtil {

    public static FormatLapText(lapModel: LapModel): string {
        let minutes: string = ('00' + lapModel.minutes).slice(-2);
        let seconds: string = ('00' + lapModel.seconds).slice(-2);
        let tends: string = ('00' + lapModel.tens).slice(-2);
        return `${minutes}:${seconds}:${tends}`;
    }

}
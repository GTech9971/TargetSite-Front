import { LapModel } from "./Lap.model";
import { TargetModel } from "./Target.model";

/**
 * タイムアタック用ターゲットモデル
 */
export interface TargetTimeModel extends TargetModel {
    /** ヒットした時間 */
    TimeScore: LapModel;
}
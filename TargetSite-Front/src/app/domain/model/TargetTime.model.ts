import { TargetModel } from "./Target.model";

/**
 * タイムアタック用ターゲットモデル
 */
export interface TargetTimeModel extends TargetModel {
    /** ヒットした時間 mm:ss */
    TimeScore: string;
}
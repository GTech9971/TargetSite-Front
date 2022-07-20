/**
 * ターゲットモデル
 */
export interface TargetModel {
    /** デバイスID */
    DeviceId: number;
    /** ヒットしたかどうか true:ヒット, false:ヒットしていない */
    IsHit: boolean;
}
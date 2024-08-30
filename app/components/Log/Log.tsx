import { WalkerBLE } from "@/app/hooks/useWalkerBLE";
import styles from "./Log.module.css";

export default function Log({
  walkerBLE,
}: {
  walkerBLE: WalkerBLE;
}): JSX.Element {
  return (
    <div className={styles.parent}>
      <div className={styles.log}>Yaw: {walkerBLE.walkerState.yaw}</div>
      <div className={styles.log}>Pitch: {walkerBLE.walkerState.pitch}</div>
      <div className={styles.log}>Roll: {walkerBLE.walkerState.roll}</div>
      <div className={styles.log}>Accel X: {walkerBLE.walkerState.aX}</div>
      <div className={styles.log}>Accel Y: {walkerBLE.walkerState.aY}</div>
      <div className={styles.log}>Accel Z: {walkerBLE.walkerState.aZ}</div>
    </div>
  );
}

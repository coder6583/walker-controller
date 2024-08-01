import { WalkerBLE } from "@/app/hooks/useWalkerBLE";
import styles from "./Bluetooth.module.css";
import { TbWorldCancel } from "react-icons/tb";
import Image from "next/image";

export default function Bluetooth({
  walkerBLE,
}: {
  walkerBLE: WalkerBLE;
}): JSX.Element {
  return (
    <div className={styles.parent}>
      <div className={styles.icon}>
        {walkerBLE.isConnected ? (
          <div className={styles.legoIcon}>
            <Image src="/icons-512.png" alt="lego" width={120} height={120} />
          </div>
        ) : (
          <TbWorldCancel className={styles.noneIcon} />
        )}
      </div>
      {walkerBLE.isConnected ? (
        <div className={styles.disconnectButton} onClick={walkerBLE.disconnect}>
          Disconnect
        </div>
      ) : (
        <div className={styles.button} onClick={walkerBLE.connect}>
          Connect
        </div>
      )}
      <div className={styles.data}>
        <div className={styles.speed}>Speed:</div>
        <div className={styles.velocityX}>X Velocity:</div>
        <div className={styles.velocityY}>Y Velocity:</div>
      </div>
    </div>
  );
}

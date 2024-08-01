"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useWalkerBLE, WalkerBLE } from "./hooks/useWalkerBLE";
import Bluetooth from "./components/Bluetooth/Bluetooth";
import Controls from "./components/Controls/Controls";
import Log from "./components/Log/Log";

export default function Home() {
  const walkerBLE: WalkerBLE = useWalkerBLE();
  return (
    <main className={styles.main}>
      <Controls walkerBLE={walkerBLE} />
      <div className={styles.right}>
        <Log />
        <Bluetooth walkerBLE={walkerBLE} />
      </div>
    </main>
  );
}

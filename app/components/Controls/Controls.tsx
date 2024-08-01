import { WalkerBLE } from "@/app/hooks/useWalkerBLE";
import styles from "./Controls.module.css";
import JoystickControl from "./JoystickControl";
import Manual from "./Manual";
import { useState } from "react";

export type WalkerParams = {
  leftDelay: number;
  rightDelay: number;
  leftVoltage: number;
  rightVoltage: number;
};

export default function Controls({
  walkerBLE,
}: {
  walkerBLE: WalkerBLE;
}): JSX.Element {
  const [params, setParams] = useState<WalkerParams>({
    leftDelay: 190,
    rightDelay: 190,
    leftVoltage: 3.3,
    rightVoltage: 2.58,
  });
  return (
    <div className={styles.parent}>
      <JoystickControl />
      <Manual
        walkerBLE={walkerBLE}
        walkerParams={params}
        setWalkerParams={setParams}
      />
    </div>
  );
}

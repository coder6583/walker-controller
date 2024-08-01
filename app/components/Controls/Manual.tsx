import { WalkerBLE } from "@/app/hooks/useWalkerBLE";
import { WalkerParams } from "./Controls";
import styles from "./Manual.module.css";
import ManualInput from "./ManualInput";
import { Dispatch, SetStateAction, useState } from "react";

export default function Manual({
  walkerBLE,
  walkerParams,
  setWalkerParams,
}: {
  walkerBLE: WalkerBLE;
  walkerParams: WalkerParams;
  setWalkerParams: Dispatch<SetStateAction<WalkerParams>>;
}): JSX.Element {
  const [leftDelay, setLeftDelay] = useState(190);
  const [rightDelay, setRightDelay] = useState(190);
  const [leftVoltage, setLeftVoltage] = useState(3.3);
  const [rightVoltage, setRightVoltage] = useState(2.58);

  const handleSend = () => {
    const leftVoltage8bit = Math.round((leftVoltage / 3.3) * 255);
    const rightVoltage8bit = Math.round((rightVoltage / 3.3) * 255);
    const sendValue =
      leftDelay |
      ((rightDelay << 8) & 0xff00) |
      ((leftVoltage8bit << 16) & 0xff0000) |
      ((rightVoltage8bit << 24) & 0xff000000);
    walkerBLE.send(new Uint32Array([sendValue]));
  };

  const handleStop = () => {
    walkerBLE.send(new Uint32Array([0]));
  };

  const handleSetStraight = () => {
    setWalkerParams({
      leftDelay: leftDelay,
      rightDelay: rightDelay,
      leftVoltage: leftVoltage,
      rightVoltage: rightVoltage,
    });
  };
  const handleReset = () => {
    setLeftDelay(walkerParams.leftDelay);
    setRightDelay(walkerParams.rightDelay);
    setLeftVoltage(walkerParams.leftVoltage);
    setRightVoltage(walkerParams.rightVoltage);
  };

  return (
    <div className={styles.parent}>
      <div className={styles.parameters}>
        <ManualInput
          id="leftDelay"
          name="Left Delay"
          unit="ms"
          value={leftDelay}
          setValue={setLeftDelay}
        />
        <ManualInput
          id="rightDelay"
          name="Right Delay"
          unit="ms"
          value={rightDelay}
          setValue={setRightDelay}
        />
        <ManualInput
          id="leftVoltage"
          name="Left Voltage"
          unit="V"
          value={leftVoltage}
          setValue={setLeftVoltage}
        />
        <ManualInput
          id="rightVoltage"
          name="Right Voltage"
          unit="V"
          value={rightVoltage}
          setValue={setRightVoltage}
        />
      </div>
      <div className={styles.buttons}>
        <div className={styles.smallButton} onClick={handleSetStraight}>
          Set as Straight
        </div>
        <div className={styles.smallButton} onClick={handleReset}>
          Reset
        </div>
        <div className={styles.redButton} onClick={handleStop}>
          Stop
        </div>
        <div className={styles.send} onClick={handleSend}>
          Send
        </div>
      </div>
    </div>
  );
}

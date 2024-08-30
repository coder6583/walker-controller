import { WalkerBLE } from "@/app/hooks/useWalkerBLE";
import styles from "./Controls.module.css";
import JoystickControl from "./JoystickControl";
import Manual from "./Manual";
import { useCallback, useEffect, useRef, useState } from "react";

export type WalkerParams = {
  leftDelay: number;
  rightDelay: number;
  leftVoltage: number;
  rightVoltage: number;
};

export type JoystickData = {
  radius: number;
  angle: number;
};

export default function Controls({
  walkerBLE,
}: {
  walkerBLE: WalkerBLE;
}): JSX.Element {
  const [params, setParams] = useState<WalkerParams>({
    leftDelay: 128,
    rightDelay: 128,
    leftVoltage: 3.0,
    rightVoltage: 2.7,
  });
  const canSend = useRef(false);
  const handleMove = useCallback(
    (radius: number, angle: number) => {
      if (!canSend.current) {
        return;
      }
      canSend.current = false;
      if (radius == 0) {
        walkerBLE.send(new Uint32Array([0]));
      } else {
        const degree = (angle * 180) / Math.PI;
        const degreeFromStraight = degree - 90;
        const newLeftVoltage = params.leftVoltage - degreeFromStraight * 0.001;
        const newRightVoltage =
          params.rightVoltage + degreeFromStraight * 0.001;
        const leftVoltage8bit = Math.round((newLeftVoltage / 3.3) * 255);
        const rightVoltage8bit = Math.round((newRightVoltage / 3.3) * 255);
        const sendValue =
          params.leftDelay |
          ((params.rightDelay << 8) & 0xff00) |
          ((leftVoltage8bit << 16) & 0xff0000) |
          ((rightVoltage8bit << 24) & 0xff000000);
        walkerBLE.send(new Uint32Array([sendValue]));
      }
    },
    [
      canSend,
      params.leftDelay,
      params.leftVoltage,
      params.rightDelay,
      params.rightVoltage,
      walkerBLE,
    ]
  );
  useEffect(() => {
    const id = setInterval(() => {
      canSend.current = true;
    }, 200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={styles.parent}>
      <JoystickControl handleMove={handleMove} />
      <Manual
        walkerBLE={walkerBLE}
        walkerParams={params}
        setWalkerParams={setParams}
      />
    </div>
  );
}

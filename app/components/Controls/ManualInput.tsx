import { FaMinus, FaPlus } from "react-icons/fa";
import styles from "./ManualInput.module.css";
import { WalkerParams } from "./Controls";
import {
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
} from "react";

export default function ManualInput({
  id,
  name,
  unit,
  value,
  setValue,
}: {
  id: string;
  name: string;
  unit: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}): JSX.Element {
  const handleKeyInput: FormEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (e.currentTarget.textContent?.match(/[0-9\.]+/)) {
      const num = Number(e.currentTarget.textContent);
      if (id.includes("Voltage")) {
        if (0 <= num && num <= 3.3) {
          setValue(num);
        }
      }
      if (id.includes("Delay")) {
        setValue(num);
      }
    }
  };
  const handlePlus: MouseEventHandler<HTMLDivElement> = () => {
    if (id.includes("Voltage")) {
      if (value < 3.3) {
        setValue(value + 0.02);
      }
    }
    if (id.includes("Delay")) {
      if (value < 255) {
        setValue(value + 1);
      }
    }
  };
  const handleMinus: MouseEventHandler<HTMLDivElement> = (e) => {
    if (id.includes("Voltage")) {
      if (value > 0) {
        setValue(value - 0.02);
        if (0 < value && value < 0.02) {
          setValue(0);
        }
      }
    }
    if (id.includes("Delay")) {
      if (value > 0) {
        setValue(value - 1);
      }
    }
  };
  return (
    <div className={styles.parent}>
      <div className={styles.label}>{name}</div>
      <div className={styles.button} onClick={handlePlus}>
        <FaPlus />
      </div>
      <div className={styles.number}>
        <div className={styles.value} onInput={handleKeyInput}>
          {id.includes("Voltage")
            ? value.toPrecision(3).substring(0, 4)
            : value}
        </div>
        <div className={styles.unit}>{unit}</div>
      </div>
      <div className={styles.button} onClick={handleMinus}>
        <FaMinus />
      </div>
    </div>
  );
}

import { FaMinus, FaPlus } from "react-icons/fa";
import styles from "./ManualInput.module.css";
import { WalkerParams } from "./Controls";
import {
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useState,
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
  const [cursor, setCursor] = useState(0);
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
        {/* <div className={styles.value} onInput={handleKeyInput}>
          {id.includes("Voltage")
            ? value.toPrecision(3).substring(0, 4)
            : value}
        </div> */}
        <input
          className={styles.value}
          value={
            id.includes("Voltage")
              ? value.toPrecision(3).substring(0, 4)
              : " " + value
          }
          onKeyDown={(event) => {
            console.log(event.key);
            if (event.key === "Backspace") {
              setValue(0.0);
              setCursor(0);
            } else if (!event.key.match(/[0-9\.]/)) {
              event.preventDefault();
            }
          }}
          onFocus={() => {
            setCursor(0);
          }}
          onChange={(event) => {
            if (
              event.currentTarget.value.length <= 3 &&
              event.currentTarget.value.match(/[0-9]+/)
            ) {
              setValue(Number(event.currentTarget.value));
            } else if (
              id.includes("Voltage") &&
              event.currentTarget.value.match(/^[0-9].[0-9][0-9][0-9]$/)
            ) {
              if (cursor === 0) {
                if (Number(event.currentTarget.value[4]) <= 3) {
                  setValue(Number(event.currentTarget.value[4]));
                  setCursor(cursor + 1);
                }
              } else if (cursor === 1) {
                if (
                  Number(event.currentTarget.value[0]) === 3 &&
                  Number(event.currentTarget.value[4]) > 3
                ) {
                  return;
                }
                setValue(
                  Number(
                    Number(event.currentTarget.value[0]) +
                      Number(event.currentTarget.value[4]) * 0.1
                  )
                );
                setCursor(cursor + 1);
              } else if (cursor === 2) {
                setValue(
                  Number(
                    Number(event.currentTarget.value[0]) +
                      Number(event.currentTarget.value[2]) * 0.1 +
                      Number(event.currentTarget.value[4]) * 0.01
                  )
                );
                setCursor(0);
              }
            }
          }}
        />
        <div className={styles.unit}>{unit}</div>
      </div>
      <div className={styles.button} onClick={handleMinus}>
        <FaMinus />
      </div>
    </div>
  );
}

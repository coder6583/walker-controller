import { useCallback } from "react";
import styles from "./JoystickControl.module.css";

const calculate360Angle = (offset_x: number, offset_y: number): number => {
  var radians = Math.atan2(-offset_y, offset_x);
  if (radians < 0) radians += 2 * Math.PI;
  return radians;
};

export default function JoystickControl(): JSX.Element {
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const target = document.getElementById("joystick-parent");
    if (!target) {
      return;
    }
    const joystick = document.getElementById("joystick");
    const joystick_size = joystick?.getBoundingClientRect().width ?? 25;
    const raw_x_pos = event.clientX - target.getBoundingClientRect().left;
    const raw_y_pos = event.clientY - target.getBoundingClientRect().top;
    const offset_x_pos = raw_x_pos - target.getBoundingClientRect().width / 2;
    const offset_y_pos = raw_y_pos - target.getBoundingClientRect().height / 2;
    console.log(target.getBoundingClientRect());
    const radius = Math.sqrt(
      offset_x_pos * offset_x_pos + offset_y_pos * offset_y_pos
    );
    const joystick_radius =
      radius > joystick_size / 2 ? joystick_size / 2 : radius;
    const joystick_angle = calculate360Angle(offset_x_pos, offset_y_pos);
    if (document.getElementById("joystick")?.style) {
      document.getElementById("joystick")!.style.top = `${
        joystick_size / 2 - joystick_radius * Math.sin(joystick_angle)
      }px`;
      document.getElementById("joystick")!.style.left = `${
        joystick_size / 2 + joystick_radius * Math.cos(joystick_angle)
      }px`;
    }
  }, []);
  function handleMouseDown() {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("dragend", handleMouseUp);
    document.addEventListener("mouseup", handleMouseUp);
  }
  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    console.log("up");
    const joystick = document.getElementById("joystick");
    const joystick_size = joystick?.getBoundingClientRect().width ?? 25;
    if (document.getElementById("joystick")?.style) {
      document.getElementById("joystick")!.style.top = `${joystick_size / 2}px`;
      document.getElementById("joystick")!.style.left = `${
        joystick_size / 2
      }px`;
    }
  }
  return (
    <div className={styles.parent} id="joystick-parent">
      <div className={styles.joystickParent}>
        <div
          className={styles.joystick}
          id="joystick"
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
}

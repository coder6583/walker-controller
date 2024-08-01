import { useState } from "react";

export interface WalkerBLE {
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  send: (data: Uint32Array) => void;
}

export const useWalkerBLE = (): WalkerBLE => {
  const [isConnected, setIsConnected] = useState(false);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [sendCharacteristic, setSendCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic | null>(null);

  const connect = async () => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          namePrefix: "Arduino",
        },
        {
          namePrefix: "LED",
        },
        {
          namePrefix: "Walker",
        },
      ],
      optionalServices: ["19b10000-e8f2-537e-4f6c-d104768a1214"],
    });
    const server = await device.gatt?.connect();

    const service = await server?.getPrimaryService(
      "19b10000-e8f2-537e-4f6c-d104768a1214"
    );

    const sendChar = await service?.getCharacteristic(
      "71ca4354-fcd7-4c7a-80eb-7f84da39f358"
    );
    const yawCharacteristic = await service?.getCharacteristic(
      "d916ac47-00c6-4e88-8b20-6b0a578bf827"
    );
    const pitchCharacteristic = await service?.getCharacteristic(
      "d6618e57-9f29-464c-8308-bc82f752d36a"
    );
    const rollCharacteristic = await service?.getCharacteristic(
      "448383ea-56c4-417a-b8f8-27e719436e23"
    );
    const xCharacteristic = await service?.getCharacteristic(
      "a71479c7-1f87-4f34-b8b4-8f0145244975"
    );
    const yCharacteristic = await service?.getCharacteristic(
      "77f0d8d6-8c85-4061-9e7d-73db5b0afb07"
    );
    const zCharacteristic = await service?.getCharacteristic(
      "4d0119f8-cd57-4f5c-955c-be183e0b23b1"
    );

    yawCharacteristic?.startNotifications().then(() => {
      yawCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: Event) => {
          const dv = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
          console.log("yaw", dv?.getFloat32(0, true));
        }
      );
    });

    pitchCharacteristic?.startNotifications().then(() => {
      pitchCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: Event) => {
          console.log(
            "pitch",
            (
              event.target as BluetoothRemoteGATTCharacteristic
            )?.value?.getFloat32(0)
          );
        }
      );
    });

    rollCharacteristic?.startNotifications().then(() => {
      rollCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: Event) => {
          console.log(
            "roll",
            (
              event.target as BluetoothRemoteGATTCharacteristic
            )?.value?.getFloat32(0)
          );
        }
      );
    });

    xCharacteristic?.startNotifications().then(() => {
      xCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: Event) => {
          console.log(
            "x",
            (event.target as BluetoothRemoteGATTCharacteristic)?.value
          );
        }
      );
    });

    yCharacteristic?.startNotifications().then(() => {
      yCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: Event) => {
          console.log(
            "y",
            (event.target as BluetoothRemoteGATTCharacteristic)?.value
          );
        }
      );
    });

    zCharacteristic?.startNotifications().then(() => {
      zCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: Event) => {
          console.log(
            "z",
            (event.target as BluetoothRemoteGATTCharacteristic)?.value
          );
        }
      );
    });

    if (server && sendChar) {
      setServer(server);
      setSendCharacteristic(sendChar);
      setIsConnected(true);
    }
  };

  const disconnect = () => {
    server?.disconnect();
    setIsConnected(false);
  };

  const send = async (data: Uint32Array) => {
    const currentValue = await sendCharacteristic?.readValue();
    console.log(currentValue);
    await sendCharacteristic?.writeValue(data);
  };

  return { connect, send, isConnected, disconnect };
};

import { useCallback, useState } from "react";

export interface WalkerState {
  yaw: number;
  pitch: number;
  roll: number;
  aX: number;
  aY: number;
  aZ: number;
}

export interface WalkerBLE {
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  send: (data: Uint32Array) => void;
  walkerState: WalkerState;
}

export const useWalkerBLE = (): WalkerBLE => {
  const [isConnected, setIsConnected] = useState(false);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [sendCharacteristic, setSendCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [walkerState, setWalkerState] = useState<WalkerState>({
    yaw: 0,
    pitch: 0,
    roll: 0,
    aX: 0,
    aY: 0,
    aZ: 0,
  });

  const dataHandler = useCallback((event: Event) => {
    const dv = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
    setWalkerState({
      yaw: dv?.getFloat32(0, true) ?? 0,
      pitch: dv?.getFloat32(4, true) ?? 0,
      roll: dv?.getFloat32(8, true) ?? 0,
      aX: dv?.getFloat32(12, true) ?? 0,
      aY: dv?.getFloat32(16, true) ?? 0,
      aZ: dv?.getFloat32(20, true) ?? 0,
    });
  }, []);

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
    const dataCharacteristic = await service?.getCharacteristic(
      "7d6bde2b-7608-4e4b-8e6f-e1d2303977a6"
    );

    dataCharacteristic?.startNotifications().then(() => {
      dataCharacteristic?.addEventListener(
        "characteristicvaluechanged",
        dataHandler
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

  return { connect, send, isConnected, disconnect, walkerState };
};

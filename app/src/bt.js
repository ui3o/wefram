// https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html
// An implementation of Nordic Semicondutor's UART/Serial Port Emulation over Bluetooth low energy

console.log("hi");
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

// Allows the micro:bit to transmit a byte array
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

// Allows a connected client to send a byte array
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// Allows a connected client to send a byte array
const LIGHT_CHARACTERISTIC_UUID = "1eb809da-3367-4566-bea9-a6098f81c74b";

let uBitDevice;
let rxCharacteristic;

async function connectButtonPressed() {
  try {
    console.log("Requesting Bluetooth Device...");
    uBitDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "WeFarm" }],
      optionalServices: [UART_SERVICE_UUID],
    });

    console.log("Connecting to GATT Server...");
    const server = await uBitDevice.gatt.connect();

    console.log("Getting Service...");
    const service = await server.getPrimaryService(UART_SERVICE_UUID);

    console.log("Getting Characteristics...");

    const txCharacteristic = await service.getCharacteristic(
      UART_TX_CHARACTERISTIC_UUID
    );
    txCharacteristic.startNotifications();
    txCharacteristic.addEventListener(
      "characteristicvaluechanged",
      onTxCharacteristicValueChanged
    );

    const lightCharacteristic = await service.getCharacteristic(
        LIGHT_CHARACTERISTIC_UUID
      );
    lightCharacteristic.startNotifications();
    lightCharacteristic.addEventListener(
    "characteristicvaluechanged",
    onLightCharacteristicValueChanged
    );

    rxCharacteristic = await service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    );

  } catch (error) {
    console.log(error);
  }
}

function disconnectButtonPressed() {
  if (!uBitDevice) {
    return;
  }

  if (uBitDevice.gatt.connected) {
    uBitDevice.gatt.disconnect();
    console.log("Disconnected");
  }
}

async function sendDataPressed() {
  if (!rxCharacteristic) {
    return;
  }

  try {
    let encoder = new TextEncoder();
    rxCharacteristic.writeValue(encoder.encode("P\n"));
  } catch (error) {
    console.log(error);
  }
}

function onLightCharacteristicValueChanged(event) {
    console.log("light number:", event.target.value.getUint16(0, true));
}

function onTxCharacteristicValueChanged(event) {
  let receivedData = [];
  console.log("event len:", event.target.value.byteLength);
  console.log("event number:", event.target.value.getUint16(0, true));
//   for (var i = 0; i < event.target.value.byteLength; i=i+2) {
//     receivedData[i] = event.target.value.getUint16(i);
//   }

//   //   const receivedString = String.fromCharCode.apply(null, receivedData);
// //   parseInt(hexString, 16);
//   function decimalToHexString(number) {
//     if (number < 0) {
//       number = 0xffffffff + number + 1;
//     }

//     return number.toString(16).toUpperCase();
//   }

//   console.log(parseInt(receivedData[0]));
  //   if (receivedString === "S") {
  //     console.log("Shaken!");
  //   }
}

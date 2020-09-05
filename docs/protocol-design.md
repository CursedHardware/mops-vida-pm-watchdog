# MOPS·VIDA PM Watchdog Protocol Design

## Initial connection information

### Bluetootch LE

Device broadcast name: `测霾单品`

| Type                     | UUID                                   |
| ------------------------ | -------------------------------------- |
| Discovery Device Service | `0x7676`                               |
| Nordic UART Service      | `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` |
| RX Characteristic        | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` |
| TX Characteristic        | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` |

### PINOUT

- [SWD PINOUT](./PINOUT-SWD.jpg)

## Packet layout

> Receive

| Offset | Field        | Block size | Note                            |
| -----: | ------------ | ---------- | ------------------------------- |
|   `00` | Magic Header | 1 byte     | `AA`                            |
|   `01` | Message Type | 1 byte     | [Message Type](#type-indicator) |
|   `02` | Payload      |            |                                 |

> Send

|    Offset | Field    | Block size | Note            |
| --------: | -------- | ---------- | --------------- |
|      `02` | Payload  |            |                 |
| Last byte | Checksum |            | (sum all) & 255 |

### Type indicator

> Message Type

| Value | Payload size | Note                                            |
| ----- | ------------ | ----------------------------------------------- |
| `01`  | 1 byte       | [Shutting down Packet](#shutting-down-packet)   |
| `0a`  | 2 byte       | [NoMoreHistory Packet](#no-more-history-packet) |
| `0b`  | 9 byte       | [History Packet](#history-packet)               |
| `50`  | -            | [Update Packet](#update-packet)                 |
| `54`  | 8 byte       | [Version Packet](#version-packet)               |

> Command Type

| Value | Payload size | Note                                                                 |
| ----- | ------------ | -------------------------------------------------------------------- |
| `01`  | 0 byte       | [Shutdown Command](#shutdown-command)                                |
| `08`  | 2 byte       | [Measurement interval Command](#measurement-interval-command)        |
| `09`  | 4 byte       | [Set Time Command](#set-time-command)                                |
| `0A`  | 0 byte       | [Next history Command](#next-history-command)                        |
| `0B`  | 0 byte       | [Read history Command](#read-history-command)                        |
| `12`  | 16 byte      | [Rename device name Command (UNTESTED)](#rename-device-name-command) |
| `16`  | 1 byte       | [Measurement enabled Command](#measurement-enabled-command)          |

### Shutting down Packet

| Offset | Field   | Block size | Note   |
| -----: | ------- | ---------- | ------ |
|   `03` | unknown | 1 byte     | `0xAB` |

### No more history Packet

| Offset | Field   | Block size | Note   |
| -----: | ------- | ---------- | ------ |
|   `03` | unknown | 1 byte     | `0x01` |
|   `04` | unknown | 1 byte     | `0xB5` |

### History Packet

| Offset | Field             | Block size | Note      |
| -----: | ----------------- | ---------- | --------- |
|   `03` | PM <sub>2.5</sub> | 2 byte     | 16 bit BE |
|   `07` | timestamp         | 4 byte     | 32 bit BE |

### Update Packet

| Offset | Field    | Block size | Note |
| -----: | -------- | ---------- | ---- |
|   `03` | Sub type | 1 byte     |      |

| Type        | Value | Payload Size | Note                                                  |
| ----------- | ----- | ------------ | ----------------------------------------------------- |
| Battery     | `04`  | 17 byte      | [Battery Status Packet](#battery-status-packet)       |
| Runtime     | `05`  | 15 byte      | [Hardware Runtime Packet](#hardware-runtime-packet)   |
| Sensor      | `06`  | 14 byte      | [Sensor Data Packet](#sensor-data-packet)             |
| Measurement | `07`  | 8 byte       | [Measurement Setup Packet](#measurement-setup-packet) |

#### Battery Status Packet

| Offset | Field    | Block size | Note |
| -----: | -------- | ---------- | ---- |
|   `03` | Capacity | 1 byte     |      |
|   `06` | Charging | 1 byte     |      |

#### Hardware Runtime Packet

| Offset | Field     | Block size | Note            |
| -----: | --------- | ---------- | --------------- |
|   `03` | Run time  | 4 byte     | 32 bit BE (sec) |
|   `07` | Boot time | 4 byte     | 32 bit BE (sec) |

#### Sensor Data Packet

| Offset | Field             | Block size | Note                  |
| -----: | ----------------- | ---------- | --------------------- |
|   `03` | PM <sub>2.5</sub> | 2 byte     | 16 bit BE             |
|   `07` | Record Date       | 4 byte     | 32 bit BE (timestamp) |
|   `0C` | Current Date      | 4 byte     | 32 bit BE (timestamp) |

#### Measurement Setup Packet

| Offset | Field    | Block size | Note                |
| -----: | -------- | ---------- | ------------------- |
|   `03` | Interval | 2 byte     | 16 bit BE (minutes) |
|   `05` | Disabled | 1 byte     |                     |

### Version Packet

| Offset | Field | Block size | Note      |
| -----: | ----- | ---------- | --------- |
|  `0x2` | minor | 2 byte     | 16 bit BE |
|  `0x4` | major | 2 byte     | 16 bit BE |

#### Shutdown Command

| Offset | Field | Block size | Note |
| -----: | ----- | ---------- | ---- |
|   `02` | Type  | 1 byte     | `01` |

#### Measurement interval Command

| Offset | Field    | Block size | Note      |
| -----: | -------- | ---------- | --------- |
|   `02` | Type     | 1 byte     | `08`      |
|   `03` | Interval | 2 byte     | 16 bit BE |

#### Set Time Command

| Offset | Field     | Block size | Note      |
| -----: | --------- | ---------- | --------- |
|   `02` | Type      | 1 byte     | `09`      |
|   `03` | Timestamp | 4 byte     | 32 bit BE |

#### Read history Command

| Offset | Field | Block size | Note |
| -----: | ----- | ---------- | ---- |
|   `02` | Type  | 1 byte     | `0A` |

#### Next history Command

| Offset | Field | Block size | Note |
| -----: | ----- | ---------- | ---- |
|   `02` | Type  | 1 byte     | `0B` |

#### Rename device name Command

| Offset | Field   | Block size  | Note            |
| -----: | ------- | ----------- | --------------- |
|   `02` | Type    | 1 byte      | `12`            |
|   `03` | unknown | 1 byte      | `01` / `00`     |
|   `04` | name    | max 15 byte | UTF-8 encoding? |

#### Measurement enabled Command

| Offset | Field   | Block size | Note                    |
| -----: | ------- | ---------- | ----------------------- |
|   `02` | Type    | 1 byte     | `16`                    |
|   `03` | Enabled | 1 byte     | 1: enabled, 0: disabled |

## Thanks

- <https://blog.megumifox.com/public/2020/09/04/忻風隨身-pm2.5-檢測儀開箱和拆解/>

# Documentation

> The copyright of the [Reports](#reports), [Firmware](#firmware), and [App](#decompile-app-guide) belongs to
>
> **Hangzhou Contact Interactive Information Technology Co., Ltd.** AND
>
> **Hangzhou Lianluo Interactive Information Technology Co., Ltd.** AND
>
> **杭州联络互动信息科技股份有限公司**

## Hardware

- Battery: 3.7V / 350 mAh = 1.295 Wh
- SoC: [nRF51822-QFAA](https://www.nordicsemi.com/Products/Low-power-short-range-wireless/nRF51822)
- Sensor: [PMS7003](http://www.plantower.com/en/content/?110.html)
- RTC: [PCF8563TS](https://www.nxp.com/products/:PCF8563)
- [Protocol design](protocol-design.md)
- [PINOUT](PINOUT.md)

## Reports

- [CMIIT ID: 2017DP6736](https://fccid.io/CMIIT-ID-2017DP6736)
- [Bottom of the box](dumps/BoxBottom.jpg) (Chinese)
- [User Manual](dumps/UserManual.pdf) (Chinese)
- [China RoHS Compliance](dumps/SJ_T_11364.png) (Chinese)
- [Q/BJLLHD002-2017](dumps/Q_BJLLHD002_2017.pdf) (Chinese)
  <br>From <http://www.cpbz.gov.cn/standard.do?i=Q-91330000740545604A-201705311540-0004>

## Firmware

### DFU firmware

[3_16.zip](firmware/3_16.zip)

The file extract from Official Android app

Can via [nRF Connect](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp) - DFU function,
Upgrade to `1.16` version.

### Dumpfile

[pm25_app_dump.bin](firmware/pm25_app_dump.bin)

The file internal version `1.12`
<br>Suitable for reverse engineering
<br>But not suitable for restore to device

See [NRF51822 code readout protection bypass a how to](https://www.pentestpartners.com/security-blog/nrf51822-code-readout-protection-bypass-a-how-to/)

## Decompile App Guide

Original app backup: [dumps/20180211180753SFmSTILc83m0.apk](dumps/20180211180753SFmSTILc83m0.apk)
<br>SHA 1: `71c84a76b7530c67897fad6108f8fb5d71749151`
<br>SHA 256: `c53c56fa4ba75d6c777e8cf553090ecdd2601b80c377c0fb5da07ad37097fc5a`

The file from:
<br><http://mops.lianluo.com/vida/xinfeng/app/download> (unavailable)
<br><https://mops-oss.lianluo.com/xinfeng/software/20180211180753SFmSTILc83m0.apk> (unavailable)

### Specific files

- Actions: `Fetch all data`
  <br>From `com/lianluo/xinfeng/XinfengApplication.class`

- Actions: `Request history`, `Set RTC`
  <br>From `com/lianluo/xinfeng/ui/home/presenter/HomePresenter.class`

- Actions: `Measurement interval`, `Measurement type`, `Shutdown`
  <br>From `com/lianluo/xinfeng/ui/device/control/presenter/DanpinControlPresenter.class`

## Teardown

- <https://blog.megumifox.com/public/2020/09/04/忻風隨身-pm2.5-檢測儀開箱和拆解/> (Chinese)

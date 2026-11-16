# งาน Routine ของ AirNavFlow

ตรวจสอบจากไฟล์ต้นทางเมื่อ 16 พฤศจิกายน 2026
เวลาไทยใช้เขตเวลา Asia/Bangkok (UTC+7)

## ระบบที่รับผิดชอบ

- GitHub repos เก็บโค้ดและข้อมูล
- GitHub Actions รัน workflow ตามกำหนดเวลาและเมื่อมีการเปลี่ยนแปลง
- GitHub Pages ให้บริการแอปและไฟล์ข้อมูล
- Google Apps Script อ่าน NOTAM จาก Gmail แล้วส่งไฟล์เข้า GitHub
- Codex/AI ใช้พัฒนา ตรวจสอบ และทำ PR; งานอัตโนมัติไม่ต้องเปิดแชตค้างไว้

## ตารางงานที่กำหนดไว้

| งาน | กำหนดการเวลาไทย | หน้าที่ |
|---|---|---|
| [ดึง NOTAM จาก Gmail](../tools/notam-gmail.gs) | ทุก 1 ชั่วโมง หลังตั้ง trigger | ค้นหาไฟล์แนบ NOTAM ใหม่แล้วส่งเข้า `notam/inbox/` |
| [NOTAM import](../.github/workflows/notam-import.yml) | เมื่อ push ไฟล์เข้า inbox และทุกวัน 08:00 | แปลง NOTAM อัปเดต `latest.txt` ลบไฟล์เก่ากว่า 3 วัน และเผยแพร่เมื่อข้อมูลเปลี่ยน |
| [CoWork sync](../.github/workflows/cowork-sync.yml) | 01:17, 07:17, 13:17, 19:17 | สำรอง AD.txt, RWY.txt และสนามบิน ทบ.txt จาก DataBase/CoWork เข้า `data/` |
| [AIP AIRAC watch](https://github.com/Spidersqdn/DataBase/blob/main/.github/workflows/aip-watch.yml) | จันทร์ 14:00 และ 18:00 | ตรวจรอบ eAIP เก็บข้อความใน CoWork/AIP และเปิด Issue แจ้งการเปลี่ยนแปลง |
| [สร้างและเผยแพร่ข้อมูลแผนที่](https://github.com/Spidersqdn/DataBase/blob/main/.github/workflows/build-map-and-deploy.yml) | วันที่ 3 ของเดือน 03:00 และเมื่อ push เข้า main | สร้างหรือใช้แคชแผนที่ ความสูง ENROUTE ดัชนีชาร์ต/สถานที่ แล้วเผยแพร่ DataBase |
| [Deploy app](../.github/workflows/build-map-and-deploy.yml) | เมื่อ push/merge เข้า main ยกเว้นการเปลี่ยนเฉพาะ inbox | เผยแพร่ PWA บน GitHub Pages; NOTAM import และ CoWork sync เรียก deploy หลังบันทึกข้อมูล |

workflow บน GitHub ทั้งห้ารายการสามารถสั่งรันด้วยมือได้ด้วย

## ข้อควรเข้าใจ

- ตารางนี้เป็นกำหนดการจากโค้ด ไม่ใช่หลักฐานว่าแต่ละงานกำลังเปิดใช้งานหรือรันสำเร็จ
- GitHub Actions อาจเริ่มช้ากว่าเวลาใน cron; ตรวจผลที่หน้า Actions ของแต่ละ repo
- cron แผนที่ `0 20 2 * *` หมายถึงวันที่ 2 เวลา 20:00 UTC = วันที่ 3 เวลา 03:00 ไทย
- [Unverified] ยังไม่ได้ตรวจ trigger ที่เปิดใช้งานจริงในบัญชี Google Apps Script
- วิธีตั้งค่า NOTAM อยู่ใน [AUTOMATION-TH.md](../tools/AUTOMATION-TH.md)
- เมื่อพบ AIRAC ใหม่ ต้องตรวจ Issue และอัปเดตข้อมูลที่เกี่ยวข้องผ่าน PR
  AIP watch ไม่ได้แก้ AD.txt, RWY.txt หรือค่าข้อมูลที่ฝังในแอปให้เอง
- ต้นฉบับ AD.txt, RWY.txt และสนามบิน ทบ.txt ต้องแก้ที่ DataBase/CoWork เท่านั้น

## ตรวจผลการรัน

- [AirNavFlow Actions](https://github.com/Spidersqdn/AirNavFlow/actions)
- [DataBase Actions](https://github.com/Spidersqdn/DataBase/actions)

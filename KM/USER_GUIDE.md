# คู่มือใช้งาน AirNavFlow สำหรับผู้ใช้และ bot

อัปเดตอ้างอิงซอร์ส [c76604a](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html) (v190)
ตรวจชื่อปุ่มและพฤติกรรมจากโค้ด; ไม่ใช่ผลทดสอบครบทุกอุปกรณ์
AirNavFlow ใช้เพื่อวางแผนการบิน ข้อมูล AIP/NOTAM ทางการเป็นหลักในการตรวจข้อมูล

<a id="use-01"></a>
## USE-01 — เปิดแอป ติดตั้ง และหาเมนู

1. เปิด https://spidersqdn.github.io/AirNavFlow/ ขณะมีอินเทอร์เน็ต
2. iPhone/iPad: เปิดด้วย Safari แล้วใช้เมนูแชร์ของเบราว์เซอร์ → เพิ่มไปยังหน้าจอโฮม
   Android: เปิดด้วย Chrome แล้วเลือกเมนูติดตั้งแอป/เพิ่มไปยังหน้าจอหลักตามรุ่นเบราว์เซอร์
3. เปิดจากไอคอน AirNavFlow เพื่อใช้งานเป็น PWA (บนมือถือแนวตั้งแผนที่แสดงเต็มจอใต้แถบสถานะ)
4. เมนูหลักอยู่ซ้ายในแนวนอน (บน PC ลากขอบเมนูเพื่อปรับความกว้าง ดับเบิลคลิกกลับค่าเริ่มต้น 390px) และด้านล่างในแนวตั้ง
5. ถ้าเมนูถูกซ่อน ใช้ปุ่มลูกศรขอบแผนที่เพื่อแสดงเมนูอีกครั้ง; บนมือถือแนวตั้งและ iPad แถบ `NAVIGATION TRACKING` และแถบชาร์ตจะติดอยู่ด้านล่างหน้าจอ
6. บนอุปกรณ์สัมผัส เมนูและแถบด้านล่างล็อกการซูม แต่ยังเลื่อนได้; แผนที่ยังซูมด้วยนิ้วได้

แหล่งอ้างอิง: [การติดตั้ง](../README.md), [เมนูและการซูม](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L795), [ปรับความกว้างเมนู](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L2119)

<a id="use-02"></a>
## USE-02 — เตรียมใช้ออฟไลน์

1. ต่ออินเทอร์เน็ต แล้วเลื่อนเมนูไปส่วน **OFFLINE DATA** (มี 4 แถว: `OSM MAP`, `TERRAIN`, `ENROUTE`, `CHART`)
2. กด **Download** ที่แถว **OSM MAP** และรอจนสถานะขึ้น `✓` (ระบบจะเก็บดัชนีค้นหาสถานที่ `🔎` มาด้วย)
3. กด **Download** ที่ **TERRAIN** (สำหรับความสูง/Contour), **ENROUTE** (สำหรับแผนที่ `ENROUTE (AIP)`) และ **CHART** (ชาร์ตในแอป; ต้องกด **🔓 LOGIN** ในส่วน CHART ก่อนจึงจะเห็นรายการ)
4. เปิดเมนูชั้นแผนที่ เลือก **แผนที่ออฟไลน์ (OSM)** และเปิด **เส้นชั้นความสูง (Contour ft)** เมื่อต้องการ
5. หลังโหลดครบ ทดลองเปิดแอปโดยปิดอินเทอร์เน็ต; หากใช้ GPS ให้เปิดบริการตำแหน่งและอนุญาตแอป/เบราว์เซอร์

เมื่อเคยโหลดแล้ว ปุ่มจะเปลี่ยนเป็น **Update** (แถว `CHART` จะโหลดชุดใหม่ทั้งหมดมาแทนของเดิม) และกด **ลบ** เพื่อลบข้อมูลออฟไลน์เฉพาะแถวได้
ภาพดาวเทียม เรดาร์ฝน และ NOTAM ฉบับใหม่ต้องใช้อินเทอร์เน็ต; ไฟล์ชาร์ต/แผนที่ที่นำเข้าเองไม่ได้รวมใน **OFFLINE DATA** ดู USE-07/08
ความสูงจาก terrain คือระดับพื้นดิน ไม่รวมสิ่งกีดขวาง และไม่ใช่ MSA

แหล่งอ้างอิง: [OFFLINE DATA](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L2106), [สถานะออฟไลน์](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L12281), [ชั้นแผนที่](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L5704)

<a id="use-03"></a>
## USE-03 — เพิ่มจุดและคำนวณเส้นทาง

- **AIRPORT**: กรอกชื่อสนามบินหรือ ICAO ในช่อง `Airport Name / ICAO` แล้วกด **Add ROUTE**
- **LAT/LONG**: กรอก LAT 6 หลัก `DDMMmm` และ LONG 7 หลัก `DDDMMmm` เช่น `135475` / `0994500` แล้วกด **Add ROUTE**
- **RADIAL/DME**: กรอก ICAO อ้างอิง, Radial (ทิศเหนือจริง ไม่ใช่ทิศเหนือแม่เหล็ก) และ DME (NM) แล้วกด **Add ROUTE**
- บนแผนที่: เปิด **On MAP** → แตะตำแหน่ง → เลือก **Add ROUTE** / **Add Off-ROUTE W.Pt** / **CANCEL** (กด **On MAP** อีกครั้งเพื่อออก); กดค้างเพื่อดูพิกัด/Radial-DME/ความสูง
- ใช้ **Add Off-ROUTE W.Pt** เก็บจุดนอกเส้นทาง; เปิด layer **OFF-ROUTE Wpt** หากต้องการให้แสดงบนแผนที่
- กรอก Remark, `Airspeed (kt)`, `FUEL`, `Fuel Consumption` ได้ตามแผน; มีอย่างน้อย 2 จุดจะคำนวณระยะ เวลา น้ำมัน และกราฟ `Elevation Profile`

ช่องค้นหาด้านบนใช้ค้น ICAO/สถานที่ (ยังไม่เพิ่มลงเส้นทางอัตโนมัติ); ออนไลน์ค้นผ่าน ICAO → Nominatim, ออฟไลน์ใช้ดัชนีสถานที่ที่โหลดไว้กับ `OSM MAP`

แหล่งอ้างอิง: [ช่องเพิ่มจุด](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L1875), [ค้นหา](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L12030)

<a id="use-04"></a>
## USE-04 — เส้นทางหลัก/สำรองและการบันทึก

- เลือก **เส้นทางหลัก** หรือ **เส้นทางสำรอง** เพื่อสลับชุดเส้นทางที่กำลังแก้ไข
- **⇄** สลับข้อมูลสองเส้นทาง; **✕** ข้างเส้นทางสำรองใช้ลบเส้นทางสำรองหลังยืนยัน
- **BACK TRACK** กลับลำดับจุดในเส้นทางที่กำลังแก้ไข (ต้องมีอย่างน้อย 2 จุด กดซ้ำเพื่อกลับลำดับเดิม)
- **BACK** ลบจุดสุดท้ายของเส้นทางที่กำลังแก้ไข (ไม่ใช่ undo ทุกประเภท); **CLEAR ROUTE** ล้างเส้นทางที่กำลังแก้ไขทันที
- แผนเส้นทางบันทึกในเบราว์เซอร์อัตโนมัติ ไม่ซิงก์ข้ามเครื่อง ควร **EXPORT** เก็บไฟล์ก่อนย้ายเครื่องหรือล้างข้อมูลเบราว์เซอร์

แหล่งอ้างอิง: [สลับเส้นทาง](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L11903), [บันทึกเส้นทาง](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L12229)

<a id="use-05"></a>
## USE-05 — EXPORT / IMPORT เส้นทาง

1. เลือกเส้นทางหลักหรือสำรอง (ต้องมีอย่างน้อย 2 จุด) แล้วกด **EXPORT** ใต้ตารางเส้นทาง เลือก KMZ / KML / GPX / CSV
2. เลือกกลุ่ม Off-Route: **1. All W.Pt**, **2. W.Pt with in 20NM** หรือ **3. No W.Pt (for FalCon2CP, KMZ)**
3. **EXPORT สำรองเส้นทางเดิมก่อน IMPORT** แล้วกด **IMPORT** เลือกไฟล์ KMZ/KML/GPX/CSV (ถ้ามีเส้นทางเดิมและไฟล์มี route แอปจะให้เลือกต่อท้าย/เก็บเป็น Off-Route/แทนที่; ไฟล์ที่มีเฉพาะ Off-Route จะเพิ่มเฉพาะ Off-Route โดยคงเส้นทางเดิมไว้)

**EXPORT** ในแผง `NAVIGATION TRACKING` เป็นการส่ง GPS track คนละชุดกับเส้นทางวางแผน

แหล่งอ้างอิง: [EXPORT](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L7110), [IMPORT](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L7505)

<a id="use-06"></a>
## USE-06 — MINI MAP / MSN CARD / NOTAM / SLIDE

ต้องมีอย่างน้อย 2 จุดในเส้นทาง (ปุ่ม **NOTAM** ใช้ได้เมื่อเส้นทางหลักหรือสำรองมีอย่างน้อย 2 จุด)

| ปุ่ม | วิธีใช้งานหลัก | ผลลัพธ์ |
|---|---|---|
| MINI MAP | เลือกมุมมอง MINI MAP/ตาราง ปรับชื่อหรือย้ายกล่อง แล้วใช้ PDF, PPT หรือ แชร์ (PNG ใน แชร์ → PNG) | แผนที่/ตาราง A5 จัดคู่ลง A4 แนวนอน |
| MSN CARD | แก้ค่าบนบัตร → อัปเดต → บันทึก PNG หรือ แชร์ | Pilot Mission Data Card (PNG) |
| NOTAM | ตั้งเวลา (ค่าเริ่มต้นปัจจุบัน), ระยะห่างเส้นทาง (ค่าเริ่มต้น 20 NM), รวมทั้ง FIR หรือติ๊กออกรายตัว → อัปเดต → PDF, PPT หรือ แชร์ | สไลด์ 16:9: หน้าแรกแผนที่รวม+รายการ ต้นทาง/เส้นทาง/ปลายทาง ถัดไป NOTAM ละ 1 สไลด์ (PPT แก้ข้อความได้) |
| SLIDE | แก้ข้อความ → อัปเดต → บันทึก PNG, PPT หรือ แชร์ | MISSION OVERVIEW 16:9 บนภาพดาวเทียม |

การแชร์ส่งเป็นไฟล์อย่างเดียว; ภาพดาวเทียมและฟอนต์อาจต่างเมื่อออฟไลน์หรือเครื่องปลายทางไม่มีฟอนต์

แหล่งอ้างอิง: [MINI MAP](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L9269), [SLIDE](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L9421), [NOTAM](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L9868), [MSN CARD](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L10239)

<a id="use-07"></a>
## USE-07 — CHART และแถบ Chart bar

1. **ชาร์ตในแอป (เข้ารหัส):** แอปไม่ถามรหัสตอนเปิด หากต้องการเปิดชาร์ตในแอปให้กด **🔓 LOGIN** ในส่วน **CHART** แล้วกรอกรหัสผ่าน (หลังครั้งแรกเครื่องรองรับ Passkey / Face ID / ลายนิ้วมือ สำหรับครั้งถัดไป)
2. **นำเข้าชาร์ตเอง:** กด **📄 IMPORT** เลือก PNG/JPG/WebP หรือ PDF จากเครื่อง (ใช้ได้ทันทีโดยไม่ต้องล็อกอิน)
3. ส่วน **CHART** แยกเป็น **DEP CHART** และ **ARR CHART** เชื่อมตรงกับแถบ **DEP Charts | MAP+ENROUTE | ARR Charts** เหนือ `NAVIGATION TRACKING` สามารถเปิดชาร์ตบนแผนที่พร้อมกันได้ 2 ช่อง
4. ในแต่ละช่องเลือกชาร์ต, ใช้ `◀`/`▶` เปลี่ยนหน้า/ชาร์ต, กด **👁 VIEW** ดูเต็มจอ, กด **📍 SET CHART** ตั้งพิกัด 2–3 จุด (ชาร์ตในแอปตั้งพิกัดให้อัตโนมัติ), ติ๊ก **SHOW CHART** (หรือ `SHOW` บนแถบชาร์ต) เพื่อแสดง และปรับความโปร่งใส (`−`/`+` สำหรับชาร์ต NOT TO SCALE)

ไฟล์ที่ผู้ใช้นำเข้าอ่านจากต้นฉบับ ไม่คัดลอกเข้าแอป (Safari ต้องเลือกไฟล์เดิมใหม่เมื่อเริ่ม session ใหม่)
ตัวอ่าน PDF (`pdf.js`) อยู่ในแอป (`lib/`) และแคชไว้ออฟไลน์หลังเปิดแอปออนไลน์ครั้งแรก; เก็บชาร์ตในแอปออฟไลน์ที่ **OFFLINE DATA → CHART**
**🗑 RESET** ล้างรายการชาร์ตที่นำเข้าและการตั้งค่า ไม่ลบไฟล์ต้นฉบับในเครื่อง

แหล่งอ้างอิง: [Chart bar](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L2004), [CHART UI](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L2031), [CHART login](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L11641), [PDF](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L11273)

<a id="use-08"></a>
## USE-08 — MAP และ ENROUTE

- ส่วน **MAP** (และช่อง `MAP+ENROUTE` บนแถบชาร์ต) ใช้ **📁 IMPORT MAP** นำเข้า `.pmtiles` หรือ PDF/ภาพ (อ่านจากไฟล์ต้นฉบับโดยตรง ไม่คัดลอกเก็บในแอป)
- เลือก **ENROUTE (AIP)** หรือแผนที่ที่นำเข้าจากรายการ แล้วติ๊ก **SHOW MAP** (หรือ `SHOW` บนแถบชาร์ต) เพื่อแสดงบนแผนที่ และปรับ `โปร่งใส` / `พื้นหลังโปร่งใส` (เฉพาะในกรอบแผนที่)
- สำหรับ PDF/ภาพ ใช้ **👁 VIEW** ดูเต็มจอ และ **📍 SET MAP** ตั้งพิกัด 2–3 จุด
- เก็บ **ENROUTE (AIP)** ไว้ใช้ออฟไลน์ได้ที่ **OFFLINE DATA → ENROUTE → Download**
- **🗑 DELETE MAP** ลบแผนที่ที่เลือก; **🗑 CLEAR MAPs** ลบแผนที่ที่นำเข้าทั้งหมด; **🧹 ล้าง CACHE** ล้างสำเนา cache แผนที่เก่า (ไม่กระทบไฟล์ต้นทาง)

แหล่งอ้างอิง: [MAP UI](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L2082), [นำเข้า MAP](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L10749)

<a id="use-09"></a>
## USE-09 — NAVIGATION TRACKING

| ปุ่ม | ความหมาย |
|---|---|
| TRACK | เปิด/ปิดการรับตำแหน่งและบันทึก GPS track (อัปเดตทุก 1 วินาที + Wake Lock); ต้องอนุญาตตำแหน่ง |
| PPOS | เลื่อนแผนที่ไปตำแหน่ง GPS ปัจจุบัน หรือขอตำแหน่งเมื่อยังไม่มี |
| ROUTE | แสดง/ซ่อนเส้น GPS track ที่บันทึกไว้ (ไม่ใช่เลือกเส้นทางวางแผน) |
| RESET | ล้าง track ระยะและเวลาหลังยืนยัน; ไม่ได้ปิด `TRACK` ที่กำลังทำงาน |
| EXPORT | ส่ง GPS track เป็น KMZ/KML/GPX/CSV หรือภาพ (ต้องมีอย่างน้อย 2 จุด) |

ปิดแล้วเปิด `TRACK` ใหม่ใน session เดิมจะบันทึกต่อ แต่ **รีโหลดแอปแล้ว GPS track จะหาย** — ให้ **EXPORT** ก่อนปิดหรือรีโหลดแอป
เปิดแอปไว้ด้านหน้า ไม่รับประกันการบันทึกต่อเมื่อสลับแอปหรือล็อกหน้าจอ; `ALTITUDE` ในแผงนี้มาจาก GPS ไม่ใช่ความสูง terrain

แหล่งอ้างอิง: [NAVIGATION TRACKING](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L2015), [การบันทึกและ RESET](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L6599)

<a id="use-10"></a>
## USE-10 — NOTAM และ Layer

- แอปโหลด NOTAM ล่าสุดอัตโนมัติเมื่อออนไลน์ และใช้สำเนาออฟไลน์เมื่อไม่มีเน็ต (ตรวจวันที่/สถานะและเทียบข้อมูลทางการเสมอ)
- วางข้อความเองได้ที่ **+ Upload NOTAM (ICAO Q-line)** แล้วกด **พอร์ตลงแผนที่** (มีปุ่ม **ใส่ตัวอย่าง NOTAM**); ใช้ปุ่ม **NOTAM** ในกลุ่มปุ่มหลักเพื่อสร้างสไลด์สรุป NOTAM (ดู USE-06; ปุ่ม WINDY เดิมถูกแทนที่แล้ว)
- เปิด layer **Imported NOTAM** / **NOTAM on Route** ตามต้องการ; รายการ NOTAM ด้านข้างซ่อนไว้เริ่มต้น
- ค่าเริ่มต้นตอนเปิดแอป: ช่อง `DEP`/`ARR` ชาร์ตและ `ENROUTE` ไม่แสดง (`SHOW` ไม่ติ๊ก) และ layer **OFF-ROUTE Wpt** ปิดไว้
- ตารางเวลานำเข้าข้อมูลอัตโนมัติอยู่ใน [ROUTINES.md](ROUTINES.md)

แหล่งอ้างอิง: [NOTAM UI](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L1983), [โหลด NOTAM](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L12708)

<a id="use-11"></a>
## USE-11 — RULER วัดระยะและทิศ

กด **RULER** แล้วแตะจุด A และจุด B บนแผนที่เพื่อดูระยะและทิศ (ไม่เพิ่ม waypoint ลงเส้นทาง)
เมื่อมี 2 จุดแล้ว แตะอีกครั้งจะเริ่มวัดคู่ใหม่; กด **RULER** อีกครั้งเพื่อออกจากโหมดและล้างเส้นวัด

แหล่งอ้างอิง: [RULER](https://github.com/Spidersqdn/AirNavFlow/blob/c76604a986ea9815e5fa92cbda2f3b3cccd246ba/index.html#L7038)

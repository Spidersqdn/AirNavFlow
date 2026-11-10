# AirNavFlow

แอปวางแผนการบิน (PWA) ใช้ได้ทุกเครื่อง: iPhone / iPad / Android / คอม ใช้แผนที่ + GPS ได้แม้ไม่มีสัญญาณเน็ต

**เปิดแอป:** https://spidersqdn.github.io/AirNavFlow/

> ข้อมูลในแอปใช้เพื่อการวางแผนเท่านั้น **ไม่ใช่ข้อมูลนำร่อง** ตรวจสอบกับ AIP / NOTAM ฉบับทางการก่อนบินทุกครั้ง

## ติดตั้งลงเครื่อง
1. เปิดลิงก์ด้วย **Safari (iPhone/iPad)** หรือ **Chrome (Android)** ตอนมี Wi-Fi
2. ติดตั้งลงหน้าจอ
   - iPhone/iPad: ปุ่มแชร์ → **เพิ่มไปยังหน้าจอโฮม** (ควรทำ ไม่งั้นระบบอาจลบข้อมูลที่โหลดไว้)
   - Android: เมนู ⋮ → **ติดตั้งแอป**
3. เปิดแอปจากไอคอน → แผง **แผนที่ออฟไลน์** → กด **ดาวน์โหลดแผนที่ลงเครื่อง** (~260 MB) และ **ดาวน์โหลดข้อมูลความสูง** (~117 MB)
4. ทดสอบก่อนบิน: เปิด **โหมดเครื่องบิน** (เปิด Location ไว้) → เปิดแอป → กด **GPS**

> ลิงก์เก่า `/FLIGHT/` ใช้ไม่ได้แล้ว ถ้าเคยติดตั้งจากลิงก์เก่า ให้ลบแอปเดิม แล้วติดตั้งและโหลดแผนที่ใหม่จากลิงก์ด้านบน

## ความสามารถหลัก

### แผนที่และ Layer
- แผนที่ออฟไลน์ของเราเอง (OpenStreetMap ทั้งประเทศไทย ซูมถึง z13) + ภาพดาวเทียม/แผนที่ออนไลน์
- เส้นชั้นความสูง Contour (ft): 500 ft ที่ z10-11, 200 ft ที่ z12, 100 ft ที่ z13 ขึ้นไป
- สนามบิน, น่านฟ้า P/R/D/TRA, เส้นทาง ENR, VFR reporting points (ข้อมูล AIP Thailand ฝังในแอป)
- Layer เพิ่มเติม: **มทบ.**, **IFR ENR ATS & RNAV**, **VFR BKK A/C & Helicopter Wpt**, **RTAF POC** (CSAR + ผบ.ฝูง), เรดาร์ฝน
- กดค้างบนแผนที่: แสดง Lat/Long, Radial/DME, ความสูงพื้น พร้อมปุ่ม **Add ROUTE** / **Off-Route**
- ปุ่ม **On MAP**: เปิด/ปิดการแตะแผนที่เพื่อเพิ่มจุด

### วางแผนเส้นทาง
- เพิ่มจุดจากแผนที่, จากรายชื่อจุด, หรือพิมพ์พิกัด
- พิมพ์พิกัด**เป็นตัวเลขล้วน** ไม่ต้องใส่ N/E: LAT 6 หลัก = `DDMMmm`, LONG 7 หลัก = `DDDMMmm` (รูปแบบเก่ายังใช้ได้)
- ระยะ / เวลา / น้ำมัน ต่อขา, กราฟความสูงตามเส้นทาง + Highest ELEV
- ช่อง `remark` ต่อจุด (ไม่แสดงใน MSN CARD), ปุ่ม **Add ROUTE again** ใช้จุดเดิมซ้ำในเส้นทาง
- บันทึกเส้นทางอัตโนมัติ ปิดแอปแล้วเปิดใหม่ข้อมูลยังอยู่

### ปุ่มคำสั่ง (ใต้ตารางเส้นทาง)
| | | |
|---|---|---|
| BACK | CLEAR ROUTE | GPS TRACK |
| MINI MAP | MSN CARD | WINDY |
| SLIDE | EXPORT | IMPORT |
| RULER | | |

- **MINI MAP**: ภาพ PNG ขนาด A4 มีเส้นชั้นความสูง, ตราฝูง 201, กล่องข้อมูลแต่ละจุด, สนามบินใกล้เคียง, กราฟ profile และกล่อง DIST/FT
- **MSN CARD**: ภาพ PNG Pilot Mission Data Card (มีคอลัมน์ ELEV, FUEL เริ่มต้น 2200)
- **SLIDE**: ภาพ PNG 16:9 "MISSION OVERVIEW" บนภาพดาวเทียม ฟอนต์ TH SarabunPSK แก้ข้อความได้ก่อนบันทึก
- **WINDY**: เปิด Windy ที่จุด DEPARTURE | MidWay | DESTINATION
- **EXPORT / IMPORT**: KMZ / KML / GPX / CSV (เปิดกับ Google Earth ได้)
  - Export มี 3 แบบ: 1 ทั้งหมด / 2 เฉพาะในรัศมี 20 NM / 3 FalCon2CP
- **GPS TRACK**: แสดงตำแหน่งและบันทึกเส้นทางที่บินจริง
- **RULER**: วัดระยะ/ทิศบนแผนที่

### NOTAM
- ทุกวัน 20:50 (เวลาไทย) ระบบอัตโนมัติบันทึก NOTAM ประจำวันลง `notam/NOTAMyyMMMdd.txt` และ `notam/latest.txt` และลบไฟล์ที่เก่ากว่า 3 วัน
- แอปโหลด NOTAM ล่าสุดเข้าแผง **Imported NOTAM** เอง (วางข้อความ NOTAM เองได้ด้วย)
- รายการ NOTAM ในแผงด้านข้าง**ซ่อนไว้ก่อน** กดเปิดได้ และแอปจะจำว่าเปิดไว้

## ใช้ได้ / ไม่ได้ เมื่อไม่มีเน็ต
| ใช้ได้ | ต้องมีเน็ต |
|---|---|
| แผนที่ออฟไลน์ (OSM), GPS, GPS TRACK | ภาพดาวเทียม / แผนที่ออนไลน์อื่น |
| สนามบิน, น่านฟ้า, ENR, reporting points | ค้นหาสถานที่, ชื่ออำเภอของจุด |
| วางแผนเส้นทาง, ระยะ/เวลา/น้ำมัน, RULER, EXPORT/IMPORT | WINDY, เรดาร์ฝน |
| กราฟความสูง + Contour (ถ้าโหลดข้อมูลความสูงแล้ว) | NOTAM ฉบับใหม่ (ใช้ฉบับที่โหลดไว้ หรือวางข้อความเอง) |

> ความสูงคือ**ระดับพื้นดิน**เท่านั้น (ไม่รวมต้นไม้/อาคาร/เสา) ไม่ใช่ MSA

## แก้ข้อมูลเองบน GitHub (โฟลเดอร์ `data/`)
แก้ไฟล์บนเว็บ GitHub แล้วกด **Commit** แอปจะใช้ข้อมูลใหม่เมื่อเปิดครั้งถัดไป
คั่นช่องด้วย `|` บรรทัดที่ขึ้นต้นด้วย `#` เป็นคำอธิบาย (ไม่ถูกอ่าน) ดูรูปแบบที่หัวแต่ละไฟล์

| ไฟล์ | ใช้ที่ |
|---|---|
| `data/มทบ.txt` | layer "มทบ." (ผู้ติดต่อ มทบ.) |
| `data/CSAR.txt` | layer "RTAF POC" (หน่วยบินค้นหาและช่วยชีวิต) |
| `data/ผบ.ฝูง.txt` | layer "RTAF POC" (ทำเนียบ ผบ.ฝูง) |
| `data/AD.txt` | กล่องข้อมูลสนามบินใน MINI MAP |
| `data/RWY.txt` | รูปทางวิ่ง + บรรทัด RWY ใน MINI MAP |

## ระบบอัตโนมัติ (GitHub Actions)
| Workflow | ทำอะไร | ทำงานเมื่อ |
|---|---|---|
| `build-map-and-deploy.yml` | เผยแพร่เว็บแอป (~2 MB) | push เข้า `main` หรือกด Run workflow |
| repo `AirNavFlow-map` | สร้าง `thailand.pmtiles` + `elevation.pmtiles` ไว้ที่ spidersqdn.github.io/AirNavFlow-map/ | ทุกวันที่ 2 ของเดือน หรือกด Run workflow |
| `aip-watch.yml` | ตรวจ eAIP (aip.caat.or.th) หา AIRAC ใหม่ เทียบ ENR 3/4/5.1, AD 2, AMDT, SUP, AIC แล้วเปิด Issue "AIP AIRAC ..." | Claude routine ทุกวันจันทร์ 18:00 |

- ตั้งค่า Pages: **Settings → Pages → Source: `GitHub Actions`**
- ปุ่มดาวน์โหลดแผนที่ในแอปจะกดได้หลังจาก workflow สร้างแผนที่เสร็จแล้ว

### ปรับขนาด/ความละเอียดแผนที่
แก้ใน `.github/workflows/build-map-and-deploy.yml` ของ repo `AirNavFlow-map`
- `MAP_MAXZOOM: "13"` ซูมสูงสุดที่เก็บ (12 = ไฟล์เล็กลงราวครึ่ง, 14 = ละเอียดขึ้นแต่ไฟล์ใหญ่ขึ้นมาก)
- `ELEV_MAXZOOM: "10"` ความละเอียดความสูง (10 ≈ 150 ม., 11 ≈ 75 ม. ไฟล์ใหญ่ขึ้น ~4 เท่า)
- `MAP_BBOX` กรอบพื้นที่ (ลองจิจูดต่ำสุด, ละติจูดต่ำสุด, ลองจิจูดสูงสุด, ละติจูดสูงสุด)

## โครงสร้างไฟล์
```
index.html               ตัวแอป (รวมไลบรารีและข้อมูล AIP ไว้ในไฟล์เดียว)
airnavflow.html          หน้าพาลิงก์เก่ามาที่ index.html
sw.js                    service worker (เปิดออฟไลน์ได้) แก้ index.html แล้วต้องเพิ่ม APP_CACHE
manifest.webmanifest     ข้อมูลการติดตั้งแอป
icons/                   ไอคอนแอป
data/                    ไฟล์ข้อมูลที่แก้เองได้ (ดูด้านบน)
notam/                   NOTAM รายวัน + latest.txt (ระบบอัตโนมัติเขียน)
map/                     thailand.pmtiles, elevation.pmtiles (Actions สร้าง ไม่ต้องอัปโหลด)
.github/workflows/       สร้างแผนที่ + เผยแพร่เว็บ, ตรวจ AIP
.github/scripts/         สคริปต์เทียบ AIP
```

## ข้อมูล AIP ในแอป
- ฝังเป็นค่าคงที่ใน `index.html` (เช่น `AIRSPACES_DB`, `ENR_*`, `VTBD_*_REPORTING_POINTS`)
- ปัจจุบัน: Enroute AMDT 09/26, Airspace 01 OCT 2026
- เมื่อ `aip-watch` เปิด Issue แจ้ง AIRAC ใหม่ ค่อยอัปเดตข้อมูลชุดนี้

## ที่มาข้อมูล / ลิขสิทธิ์
- แผนที่: © OpenStreetMap contributors (ODbL) ผ่าน Protomaps basemap
- ความสูง: Terrain Tiles (Mapzen / AWS Open Data: SRTM, GMTED, ETOPO1)
- ข้อมูลการบิน: AIP Thailand (https://aip.caat.or.th/) ใช้เพื่อการวางแผนเท่านั้น
- ไลบรารี: Leaflet, JSZip, PMTiles, protomaps-leaflet (รวมไว้ใน `index.html`)

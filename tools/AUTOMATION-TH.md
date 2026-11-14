# งานอัตโนมัติที่รันได้โดยไม่ต้องใช้ Claude

| งาน | ของเดิม (ใช้ Claude) | ของใหม่ (ฟรี) |
|---|---|---|
| ตรวจ AIP | Claude routine จันทร์ 18:00 (ปิดได้แล้ว) | GitHub Actions cron จันทร์ 14:00 + 18:00 (อาจช้า 1–4 ชม.) |
| NOTAM รายวัน | Claude routine 20:50 | Google Apps Script ทุก 1 ชม. → GitHub Actions แปลงไฟล์ |

## 1. ตรวจ AIP
ไม่ต้องทำอะไร workflow "AIP AIRAC watch" อยู่ที่ repo **DataBase** (ย้ายมา 12 NOV 2026) รันเองทุกวันจันทร์ เก็บหน้า AIP ลง `CoWork/AIP/` และเปิด Issue ที่ DataBase

## 2. NOTAM รายวัน (ตั้งครั้งเดียว ~10 นาที)

### ขั้น A: สร้าง GitHub token
1. เปิด https://github.com/settings/personal-access-tokens/new
2. Token name: `AirNavFlow NOTAM`
3. Expiration: เลือกนานสุด (จดวันหมดอายุไว้ ต้องสร้างใหม่ก่อนหมด)
4. Repository access: **Only select repositories** → `Spidersqdn/AirNavFlow`
5. Permissions → Repository permissions → **Contents: Read and write**
6. กด **Generate token** → คัดลอก (ขึ้นต้น `github_pat_`) ห้ามส่งให้ใคร

### ขั้น B: วางสคริปต์
1. เข้า https://script.google.com ด้วย Gmail ที่ได้รับอีเมล NOTAM
2. **New project** → ตั้งชื่อ `AirNavFlow NOTAM`
3. ลบโค้ดเดิมใน `Code.gs` → วางโค้ดทั้งหมดจากไฟล์ `tools/notam-gmail.gs` → กด 💾 Save

### ขั้น C: ใส่ token
1. ซ้ายมือ ⚙️ **Project Settings** → เลื่อนลง **Script properties** → **Add script property**
2. Property: `GITHUB_TOKEN` Value: วาง token จากขั้น A → **Save script properties**

### ขั้น D: เปิดใช้งาน + อนุญาต
1. กลับไป ⟨⟩ **Editor** → ช่องเลือกฟังก์ชันด้านบน เลือก `setup` → กด ▶ **Run**
2. ขึ้น "Authorization required" → **Review permissions** → เลือกบัญชี
3. ถ้าขึ้น "Google hasn't verified this app" → **Advanced** → **Go to AirNavFlow NOTAM (unsafe)** → **Allow**
   (เป็นสคริปต์ของเราเอง สิทธิ์ที่ขอ: อ่าน Gmail + เชื่อมต่อเว็บภายนอก)
4. ดู Execution log ต้องขึ้น `Sent to GitHub: NOTAM ...` หรือ `Already sent`
5. ⏰ **Triggers** ต้องมี `run` ทุก 1 ชั่วโมง 1 รายการ

### ขั้น E: ตรวจผล
1. เปิด https://github.com/Spidersqdn/AirNavFlow/actions → workflow **NOTAM import** ต้องเป็น ✅
2. ใน repo โฟลเดอร์ `notam/` ต้องมีไฟล์ `NOTAMyyMMMdd.txt` ของวันใหม่ และ `latest.txt`
3. เปิดแอป → ข้อความ "Daily NOTAM: NOTAM.... items loaded"

## 3. ยกเลิก Claude routine (ทำหลังของใหม่ทำงานถูกต้อง 2–3 วันแล้วเท่านั้น)
บอก Claude ในเธรดนี้ว่า "ปิด routine ได้" หรือปิดเองที่ claude.ai → Routines
- `Daily RTAF NOTAM to AirNavFLOW`
- routine ตรวจ AIP (จันทร์ 18:00)

## เมื่อมีปัญหา
- Apps Script ล้มเหลว → Google ส่งอีเมลแจ้ง "Summary of failures" ให้เอง
- `GitHub 401` = token ผิด/หมดอายุ → ทำขั้น A ใหม่ แล้วแก้ค่าในขั้น C
- `GitHub 404` = token ไม่ได้เลือก repo หรือไม่ได้ให้สิทธิ์ Contents
- workflow ❌ "No NOTAM blocks" = ไฟล์แนบไม่ใช่ NOTAM / รูปแบบเปลี่ยน
- ส่งซ้ำวันเดิม: Apps Script → Project Settings → ลบ property `LAST_MSG_ID` → Run `run`

## หมายเหตุ
- ระหว่างทดลอง Claude routine กับของใหม่รันซ้อนกันได้ ไฟล์ผลลัพธ์เหมือนกัน [Inference]
- GitHub อาจปิด cron เองถ้า repo ไม่มีความเคลื่อนไหว 60 วัน แต่ NOTAM commit ทุกวันนับเป็นความเคลื่อนไหว [Inference]
- ไม่ใช้รหัส AEROTHAI ใดๆ

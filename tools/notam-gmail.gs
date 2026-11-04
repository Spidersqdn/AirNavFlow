/**
 * AirNavFlow daily NOTAM (runs in Google Apps Script, no Claude needed).
 * Every hour: finds the newest email from rtafbaseopr@gmail.com with a NOTAM .docx/.pdf,
 * and, if it is new, uploads it to GitHub as notam/inbox/<id>.json. The GitHub workflow
 * "NOTAM import" converts it to notam/NOTAMyyMMMdd.txt + notam/latest.txt.
 * Setup: Project Settings > Script properties > GITHUB_TOKEN = fine-grained token
 * (repo Spidersqdn/AirNavFlow, Contents: Read and write). Then run setup() once.
 * It never sends, changes or deletes email.
 */
const REPO = 'Spidersqdn/AirNavFlow';
const QUERY = 'from:rtafbaseopr@gmail.com subject:NOTAM has:attachment newer_than:4d';

/** Run once: creates the hourly trigger and asks for permission. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('run').timeBased().everyHours(1).create();
  run();
}

function run() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('Add Script property GITHUB_TOKEN first');

  let newest = null;
  GmailApp.search(QUERY, 0, 10).forEach(t => t.getMessages().forEach(m => {
    if (!/rtafbaseopr@gmail\.com/i.test(m.getFrom())) return;
    if (!pickAttachment(m)) return;
    if (!newest || m.getDate() > newest.getDate()) newest = m;
  }));
  if (!newest) { console.log('No NOTAM email in the last 4 days'); return; }

  const id = newest.getId();
  if (props.getProperty('LAST_MSG_ID') === id) { console.log('Already sent: ' + newest.getSubject()); return; }

  const att = pickAttachment(newest);
  const data = {
    subject: newest.getSubject(),
    filename: att.getName(),
    mime: att.getContentType(),
    date: newest.getDate().toISOString(),
    data: Utilities.base64Encode(att.getBytes())
  };
  const res = UrlFetchApp.fetch('https://api.github.com/repos/' + REPO + '/contents/notam/inbox/' + id + '.json', {
    method: 'put',
    contentType: 'application/json',
    muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    payload: JSON.stringify({
      message: 'NOTAM inbox: ' + data.subject,
      branch: 'main',
      content: Utilities.base64Encode(JSON.stringify(data), Utilities.Charset.UTF_8)
    })
  });
  const code = res.getResponseCode();
  // 422 = the same email is already waiting in the inbox folder
  if (code >= 300 && code !== 422) throw new Error('GitHub ' + code + ': ' + res.getContentText().slice(0, 300));
  props.setProperty('LAST_MSG_ID', id);
  console.log('Sent to GitHub: ' + data.subject + ' / ' + data.filename);
}

function pickAttachment(m) {
  return m.getAttachments().find(a =>
    /\.(docx|pdf)$/i.test(a.getName()) || /wordprocessingml|pdf/i.test(a.getContentType())) || null;
}

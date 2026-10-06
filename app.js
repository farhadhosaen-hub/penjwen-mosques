// ==============================================================
// ئەپی مزگەوتەکانی پێنجوێن - Penjwen Mosques & Prayer Times App
// ==============================================================

// داتای ئەو دوو مزگەوتەی تۆمار کرابوون (مزگەوتی گەیلانی پێنجوێن و مزگەوتی مەلا عباس)
const DEFAULT_MOSQUES = [
  {
    id: "mosque_gaylani",
    name: "مزگەوتی گەیلانی پێنجوێن",
    location: "ناوبازاڕ",
    notes: "مزگەوتی گەیلانی لە شارۆچکەی پێنجوێن، یەکێکە لە مزگەوتە دیار و سەرەکییەکان بۆ نوێژی هەینی، وانە و کۆڕە ئایینییەکان.",
    sermons: [
      {
        id: "srm_g_1",
        date: "2026-10-02",
        topic: "گەورەیی پێغەمبەر (د.خ) و شوێنکەوتنی سوننەتەکانی",
        speaker: "مامۆستا ملا محمدی گەیلانی",
        hasAudio: false
      },
      {
        id: "srm_g_2",
        date: "2026-09-25",
        topic: "برایەتی و دڵپاکی لەنێوان باوەڕداران",
        speaker: "مامۆستا ملا محمدی گەیلانی",
        hasAudio: false
      },
      {
        id: "srm_g_3",
        date: "2026-09-18",
        topic: "ڕەوشتی بەرز و دەستپاکی لە مامەڵەی ڕۆژانەدا",
        speaker: "مامۆستا ملا محمدی گەیلانی",
        hasAudio: false
      }
    ],
    khutbahDate: "2026-10-02",
    khutbahTopic: "گەورەیی پێغەمبەر (د.خ) و شوێنکەوتنی سوننەتەکانی",
    khutbahSpeaker: "مامۆستا ملا محمدی گەیلانی",
    staff: [
      { id: "s_gaylani_1", name: "مامۆستا ملا محمدی گەیلانی", role: "ووتاربێژ", phone: "" },
      { id: "s_gaylani_2", name: "مامۆستا محمد", role: "پێش نوێژ", phone: "" },
      { id: "s_gaylani_3", name: "کاک فاتح", role: "بانگ بێژ", phone: "" },
      { id: "s_gaylani_4", name: "کاک ئەحمەد سەعید", role: "کارگووزار", phone: "" }
    ],
    createdAt: 1791099916289,
    updatedAt: 1791148000000
  },
  {
    id: "mosque_mala_abbas",
    name: "مزگەوتی مەلا عباس",
    location: "خوار مەلعەبەکە",
    notes: "",
    sermons: [
      {
        id: "srm_abbas_1",
        date: "2026-10-02",
        topic: "برایەتی",
        speaker: "مامۆستا مەلا عباس",
        hasAudio: false
      },
      {
        id: "srm_abbas_2",
        date: "2026-09-25",
        topic: "گرنگی نوێژی بەکۆمەڵ و پاراستنی مافی مسوڵمانان",
        speaker: "مامۆستا مەلا عباس",
        hasAudio: false
      }
    ],
    khutbahDate: "2026-10-02",
    khutbahTopic: "برایەتی",
    khutbahSpeaker: "مامۆستا مەلا عباس",
    staff: [
      { id: "s_abbas_1", name: "مامۆستا مەلا عباس", role: "ووتاربێژ", phone: "" },
      { id: "s_abbas_2", name: "مامۆستا عبدالله", role: "پێش نوێژ", phone: "" },
      { id: "s_abbas_3", name: "حاجی فرج", role: "بانگ بێژ", phone: "" },
      { id: "s_abbas_4", name: "کاک کامەران", role: "کارگووزار", phone: "" }
    ],
    createdAt: 1791100239418,
    updatedAt: 1791148000000
  }
];

// App State
let mosques = [];
let currentPrayerTimes = null;

// پاراستنی سەدی سەدی داتای مزگەوتەکان و ڕێگری لە هەر گۆڕانکاری و سڕینەوەیەک لە کاتی ئەبدەیتدا
try {
  let existingStore = localStorage.getItem('penjwen_mosques_data');
  if (!existingStore) {
    existingStore = localStorage.getItem('penjwen_mosques_backup') || localStorage.getItem('penjwen_mosques_permanent_vault');
    if (existingStore) {
      localStorage.setItem('penjwen_mosques_data', existingStore);
    } else {
      const defStr = JSON.stringify(DEFAULT_MOSQUES);
      localStorage.setItem('penjwen_mosques_data', defStr);
      localStorage.setItem('penjwen_mosques_backup', defStr);
      localStorage.setItem('penjwen_mosques_permanent_vault', defStr);
    }
  }
} catch (e) {}

// IndexedDB بۆ خەزنکردنی دەنگی وتار بە MP3 (Point 3)
const DB_NAME = 'PenjwenAudioDB';
const DB_STORE = 'sermons_audio';

function openAudioDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveSermonAudioBlob(key, blob) {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(blob, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Audio save error:', e);
  }
}

async function getSermonAudioBlob(key) {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

async function deleteSermonAudioBlob(key) {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(key);
      tx.oncomplete = () => resolve(true);
    });
  } catch (e) {}
}

// ==============================================================
// سیستەمی کۆگای پارێزراوی هەمیشەیی داتاکان (Permanent Vault in IndexedDB)
// ==============================================================
const VAULT_DB_NAME = 'PenjwenPermanentVaultDB';
const VAULT_STORE_NAME = 'mosques_vault';

function openVaultDB() {
  return new Promise((resolve) => {
    try {
      if (!('indexedDB' in window)) return resolve(null);
      const req = indexedDB.open(VAULT_DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(VAULT_STORE_NAME)) {
          db.createObjectStore(VAULT_STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function saveToIndexedDBVault(data) {
  try {
    const db = await openVaultDB();
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(VAULT_STORE_NAME, 'readwrite');
      tx.objectStore(VAULT_STORE_NAME).put(JSON.stringify(data), 'active_mosques');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Vault save error:', e);
  }
}

async function getFromIndexedDBVault() {
  try {
    const db = await openVaultDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(VAULT_STORE_NAME, 'readonly');
      const req = tx.objectStore(VAULT_STORE_NAME).get('active_mosques');
      req.onsuccess = () => {
        try {
          resolve(req.result ? JSON.parse(req.result) : null);
        } catch (e) {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function saveToIndexedDBVaultItem(key, data) {
  try {
    const db = await openVaultDB();
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(VAULT_STORE_NAME, 'readwrite');
      tx.objectStore(VAULT_STORE_NAME).put(JSON.stringify(data), key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Vault item save error:', e);
  }
}

async function getFromIndexedDBVaultItem(key) {
  try {
    const db = await openVaultDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(VAULT_STORE_NAME, 'readonly');
      const req = tx.objectStore(VAULT_STORE_NAME).get(key);
      req.onsuccess = () => {
        try {
          resolve(req.result ? JSON.parse(req.result) : null);
        } catch (e) {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

// ==============================================================
// سیستەمی پاراستنی داتاکان و دەستکاریکردنی مزگەوتەکان (Data Vault & Editing)
// ==============================================================
function saveMosqueToVault(mosqueObj) {
  if (!mosqueObj || !mosqueObj.id) return;
  try {
    let vault = {};
    const stored = localStorage.getItem('penjwen_user_mosque_vault');
    if (stored) vault = JSON.parse(stored);
    vault[mosqueObj.id] = { ...mosqueObj, updatedAt: mosqueObj.updatedAt || Date.now() };
    localStorage.setItem('penjwen_user_mosque_vault', JSON.stringify(vault));
    saveToIndexedDBVaultItem('user_mosque_vault', vault);

    // هاوکات لەگەڵ کلیلی کۆنەکانیش بۆ پشتیوانی تەواو
    saveUserCustomMosque(mosqueObj);
    saveUserStaffEdit(mosqueObj.id, mosqueObj.staff || [], mosqueObj);
  } catch (e) {
    console.warn('Error saving mosque to vault:', e);
  }
}

function removeMosqueFromVault(mosqueId) {
  try {
    let vault = {};
    const stored = localStorage.getItem('penjwen_user_mosque_vault');
    if (stored) vault = JSON.parse(stored);
    delete vault[mosqueId];
    localStorage.setItem('penjwen_user_mosque_vault', JSON.stringify(vault));
    saveToIndexedDBVaultItem('user_mosque_vault', vault);
  } catch(e) {}
  removeUserCustomMosque(mosqueId);
}

function saveUserStaffEdit(mosqueId, staff, mosqueObj = null) {
  try {
    let edits = {};
    const stored = localStorage.getItem('penjwen_user_staff_edits');
    if (stored) edits = JSON.parse(stored);
    edits[mosqueId] = {
      staff: staff,
      name: mosqueObj ? mosqueObj.name : undefined,
      location: mosqueObj ? mosqueObj.location : undefined,
      notes: mosqueObj ? mosqueObj.notes : undefined,
      updatedAt: mosqueObj ? (mosqueObj.updatedAt || Date.now()) : Date.now()
    };
    localStorage.setItem('penjwen_user_staff_edits', JSON.stringify(edits));
    saveToIndexedDBVaultItem('user_staff_edits', edits);
  } catch (e) {
    console.warn('Error saving user staff edit:', e);
  }
}

function saveUserCustomMosque(newMosque) {
  try {
    let custom = {};
    const stored = localStorage.getItem('penjwen_user_custom_mosques');
    if (stored) custom = JSON.parse(stored);
    custom[newMosque.id] = { ...newMosque, updatedAt: newMosque.updatedAt || Date.now() };
    localStorage.setItem('penjwen_user_custom_mosques', JSON.stringify(custom));
    saveToIndexedDBVaultItem('user_custom_mosques', custom);
  } catch (e) {
    console.warn('Error saving user custom mosque:', e);
  }
}

function removeUserCustomMosque(mosqueId) {
  try {
    let custom = {};
    const stored = localStorage.getItem('penjwen_user_custom_mosques');
    if (stored) custom = JSON.parse(stored);
    delete custom[mosqueId];
    localStorage.setItem('penjwen_user_custom_mosques', JSON.stringify(custom));
    saveToIndexedDBVaultItem('user_custom_mosques', custom);

    let edits = {};
    const sEdits = localStorage.getItem('penjwen_user_staff_edits');
    if (sEdits) edits = JSON.parse(sEdits);
    delete edits[mosqueId];
    localStorage.setItem('penjwen_user_staff_edits', JSON.stringify(edits));
    saveToIndexedDBVaultItem('user_staff_edits', edits);
  } catch (e) {}
}

function applyUserCustomVault(targetList) {
  if (!Array.isArray(targetList)) return targetList;

  // ١. هێنانەوە لە کۆگای یەکگرتووی مزگەوتەکان (Unified Mosque Vault)
  try {
    const vaultStored = localStorage.getItem('penjwen_user_mosque_vault');
    if (vaultStored) {
      const vaultMap = JSON.parse(vaultStored);
      Object.values(vaultMap).forEach(vm => {
        if (!vm || !vm.id) return;
        const idx = targetList.findIndex(m => m.id === vm.id || (m.name && vm.name && m.name.trim() === vm.name.trim()));
        if (idx === -1) {
          targetList.push(vm);
        } else {
          const existing = targetList[idx];
          if ((vm.updatedAt || 0) >= (existing.updatedAt || 0)) {
            targetList[idx] = { ...existing, ...vm };
          }
        }
      });
    }
  } catch (e) {}

  // ٢. پاراستن و هێنانەوەی سەرجەم مزگەوتە نوێیە زیادکراوەکان (کۆنی پشتیوانیکراو)
  try {
    const customStored = localStorage.getItem('penjwen_user_custom_mosques');
    if (customStored) {
      const customMap = JSON.parse(customStored);
      Object.values(customMap).forEach(cm => {
        if (!cm || !cm.id) return;
        const idx = targetList.findIndex(m => m.id === cm.id || (m.name && cm.name && m.name.trim() === cm.name.trim()));
        if (idx === -1) {
          targetList.push(cm);
        } else {
          const existing = targetList[idx];
          if ((cm.updatedAt || 0) >= (existing.updatedAt || 0)) {
            targetList[idx] = { ...existing, ...cm };
          }
        }
      });
    }
  } catch (e) {}

  // ٣. جێبەجێکردنی دەستکارییەکانی ستاف و زانیارییەکان (ئەگەر کاتی نوێتر بێت)
  try {
    const editsStored = localStorage.getItem('penjwen_user_staff_edits');
    if (editsStored) {
      const editsMap = JSON.parse(editsStored);
      Object.keys(editsMap).forEach(mId => {
        const item = editsMap[mId];
        if (!item) return;
        const idx = targetList.findIndex(m => m.id === mId || (item.name && m.name && m.name.trim() === item.name.trim()));
        if (idx !== -1) {
          const mosque = targetList[idx];
          if ((item.updatedAt || 0) >= (mosque.updatedAt || 0)) {
            if (Array.isArray(item.staff) && item.staff.length > 0) mosque.staff = item.staff;
            if (item.name) mosque.name = item.name;
            if (item.location) mosque.location = item.location;
            if (item.notes !== undefined) mosque.notes = item.notes;
          }
        }
      });
    }
  } catch (e) {}

  return targetList;
}

// DOM Elements
const mosquesContainer = document.getElementById('mosquesContainer');
const emptyState = document.getElementById('emptyState');

// Modal Elements (Mosque Form)
const mosqueModal = document.getElementById('mosqueModal');
const openMosqueModalBtn = document.getElementById('openMosqueModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const mosqueForm = document.getElementById('mosqueForm');
const modalTitle = document.getElementById('modalTitle');
const saveBtnText = document.getElementById('saveBtnText');
const editMosqueId = document.getElementById('editMosqueId');
const mosqueNameInput = document.getElementById('mosqueName');
const mosqueLocationInput = document.getElementById('mosqueLocation');
const mosqueNotesInput = document.getElementById('mosqueNotes');
const khutbahDateInput = document.getElementById('khutbahDate');
const khutbahTopicInput = document.getElementById('khutbahTopic');
const khutbahSpeakerInput = document.getElementById('khutbahSpeaker');
const khutbahAudioFile = document.getElementById('khutbahAudioFile');
const khutbahAudioFileInfo = document.getElementById('khutbahAudioFileInfo');
const khutbahAudioBtnText = document.getElementById('khutbahAudioBtnText');
const removeKhutbahAudioBtn = document.getElementById('removeKhutbahAudioBtn');
let selectedAudioFile = null;

const staffListContainer = document.getElementById('staffListContainer');
const addStaffRowBtn = document.getElementById('addStaffRowBtn');

// View Modal Elements
const viewModal = document.getElementById('viewModal');
const closeViewModalBtn = document.getElementById('closeViewModalBtn');
const viewMosqueTitle = document.getElementById('viewMosqueTitle');
const viewLocationBadge = document.getElementById('viewLocationBadge');
const viewModalBody = document.getElementById('viewModalBody');

// Prayer Times Edit Modal Elements (Point 2)
const prayerTimesModal = document.getElementById('prayerTimesModal');
const openPrayerEditBtn = document.getElementById('openPrayerEditBtn');
const closePrayerEditBtn = document.getElementById('closePrayerEditBtn');
const cancelPrayerEditBtn = document.getElementById('cancelPrayerEditBtn');
const prayerTimesForm = document.getElementById('prayerTimesForm');
const resetPrayerTimesBtn = document.getElementById('resetPrayerTimesBtn');

const inputFajr = document.getElementById('inputFajr');
const inputSunrise = document.getElementById('inputSunrise');
const inputDhuhr = document.getElementById('inputDhuhr');
const inputAsr = document.getElementById('inputAsr');
const inputMaghrib = document.getElementById('inputMaghrib');
const inputIsha = document.getElementById('inputIsha');

// Weather & Clock
const tempValueEl = document.getElementById('tempValue');
const weatherDescEl = document.getElementById('weatherDesc');
const weatherIconEl = document.getElementById('weatherIcon');
const refreshWeatherBtn = document.getElementById('refreshWeatherBtn');
const liveClockEl = document.getElementById('liveClock');
const kurdishDateEl = document.getElementById('kurdishDate');

// Stats Elements
const statTotalMosques = document.getElementById('statTotalMosques');
const statKhateebs = document.getElementById('statKhateebs');
const statImams = document.getElementById('statImams');
const statMuezzins = document.getElementById('statMuezzins');
const printReportBtn = document.getElementById('printReportBtn');
const toastEl = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const toastIcon = document.getElementById('toastIcon');

// Prayer Times Badge
const nextPrayerBadge = document.getElementById('nextPrayerBadge');

// Coordinates for Penjwen
const PENJWEN_COORDS = { lat: 35.6186, lon: 45.9458 };

// ==============================================================
// ١. یارمەتیدەری وتارەکان و MP3 بەپێی بەروار (Sermon Date Helpers)
// ==============================================================
function findSermonByDate(mosque, targetDateStr) {
  if (!mosque) return null;
  const list = mosque.sermons || [];
  
  if (list.length === 0) {
    if (mosque.khutbahTopic) {
      return {
        date: mosque.khutbahDate || "2026-10-02",
        topic: mosque.khutbahTopic,
        speaker: mosque.khutbahSpeaker || "مامۆستای وتاربێژ",
        hasAudio: false
      };
    }
    return null;
  }

  const exact = list.find(s => s.date === targetDateStr);
  if (exact) return exact;

  const targetTime = new Date(targetDateStr).getTime();
  if (!isNaN(targetTime)) {
    const weekMatch = list.find(s => {
      const sTime = new Date(s.date).getTime();
      return Math.abs(targetTime - sTime) <= 3.5 * 24 * 60 * 60 * 1000;
    });
    if (weekMatch) return weekMatch;
  }

  return null;
}

function getLatestSermonDate(mosque) {
  if (mosque && mosque.sermons && mosque.sermons.length > 0) {
    return mosque.sermons[0].date;
  }
  return mosque.khutbahDate || "2026-10-02";
}

function renderSermonContentHtml(mosque, sermon, dateValue) {
  if (sermon) {
    const audioKey = `${mosque.id}_${sermon.date}`;
    const hasAudio = Boolean(sermon.hasAudio);

    return `
      <div class="space-y-2 animate-fade-in">
        <div class="flex items-center justify-between text-[11px] text-amber-900 font-semibold">
          <span>ناونیشانی وتاری ئەو هەفتەیە:</span>
          <div class="flex items-center gap-1.5">
            <button type="button" onclick="openEditSermonForDate('${mosque.id}', '${sermon.date}')" class="text-[10px] bg-white hover:bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300 shadow-2xs transition-colors cursor-pointer" title="دەستکاریکردنی ئەم وتارە">
              <i class="fa-regular fa-pen-to-square"></i> دەستکاری وتار
            </button>
            <span class="bg-amber-200/90 text-amber-950 font-bold px-2 py-0.5 rounded-md text-[10px] shadow-2xs">
              هەینی: ${escapeHtml(sermon.date)}
            </span>
          </div>
        </div>
        <div class="sermon-topic text-slate-900 font-bold text-xs sm:text-sm leading-relaxed bg-white/95 p-2.5 rounded-xl border border-amber-200/70 shadow-2xs">
          «${escapeHtml(sermon.topic)}»
        </div>
        <div class="flex flex-wrap items-center gap-1.5 text-amber-950 text-xs pt-0.5 font-semibold">
          <i class="fa-solid fa-microphone-lines text-amber-700 text-xs"></i>
          <span class="text-amber-900">ناوی ئەو وتاربێژەی کە وتارەکەی داوە:</span>
          <span class="sermon-speaker text-amber-950 font-bold bg-amber-100/90 px-2.5 py-0.5 rounded-lg border border-amber-200/60 shadow-2xs">
            ${escapeHtml(sermon.speaker || 'دیاری نەکراوە')}
          </span>
        </div>

        <!-- خاڵی ٣: خەزنکردن و پەخشکردنی دەنگی وتار بە MP3 -->
        <div class="pt-2 border-t border-amber-200/60" id="audio-container-${mosque.id}">
          ${hasAudio ? `
            <div class="bg-amber-100/90 p-2.5 rounded-xl border border-amber-300 flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-[11px] font-bold text-amber-950">
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-file-audio text-amber-700"></i>
                  <span>فایلی دەنگی وتارەکە (MP3 پاشەکەوتکراو):</span>
                </span>
                <button type="button" onclick="deleteCardAudio('${mosque.id}', '${sermon.date}')" class="text-[10px] text-red-600 hover:text-red-800 font-bold px-1.5 py-0.5 rounded bg-white/60 hover:bg-white transition-colors cursor-pointer" title="سڕینەوەی ئەم فایلی دەنگە">
                  <i class="fa-solid fa-trash-can"></i> سڕینەوە
                </button>
              </div>
              <audio controls id="player-${mosque.id}-${sermon.date.replace(/-/g, '')}" class="w-full h-8 mt-0.5 rounded-lg shadow-2xs"></audio>
            </div>
          ` : `
            <div class="flex items-center gap-2">
              <label class="inline-flex items-center gap-1.5 bg-amber-200/70 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-300 cursor-pointer transition-colors shadow-2xs">
                <i class="fa-solid fa-cloud-arrow-up text-amber-700"></i>
                <span>خەزنکردنی دەنگ بە MP3</span>
                <input type="file" accept="audio/mp3,audio/*" class="hidden" onchange="handleDirectAudioUpload('${mosque.id}', '${sermon.date}', this)">
              </label>
              <span class="text-[11px] text-amber-800 font-medium">کلیک بکە بۆ خەزنکردنی فایلی دەنگی وتار (MP3)</span>
            </div>
          `}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="space-y-1.5 p-3 bg-white/70 rounded-xl border border-dashed border-amber-300 text-center animate-fade-in">
        <p class="text-xs text-amber-900 font-medium">
          هیچ وتارێک بۆ بەرواری <span class="font-bold text-amber-950 underline decoration-amber-400">${escapeHtml(dateValue)}</span> تۆمار نەکراوە.
        </p>
        <button 
          onclick="openAddSermonForDate('${mosque.id}', '${dateValue}')" 
          class="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer mt-1"
        >
          <i class="fa-solid fa-plus text-[10px]"></i>
          <span>تۆمارکردنی وتار و وتاربێژ بۆ ئەم بەروارە</span>
        </button>
      </div>
    `;
  }
}

// بارکردنی خودکاری دەنگ بۆ پلەیەر لە دوای ڕێندەرکردن
async function loadAudioIntoCardPlayer(mosqueId, dateStr) {
  const cleanDate = dateStr.replace(/-/g, '');
  const player = document.getElementById(`player-${mosqueId}-${cleanDate}`);
  if (!player) return;

  const key = `${mosqueId}_${dateStr}`;
  const blob = await getSermonAudioBlob(key);
  if (blob) {
    player.src = URL.createObjectURL(blob);
  }
}

window.handleDirectAudioUpload = async function(mosqueId, sermonDate, inputElem) {
  if (!inputElem.files || !inputElem.files[0]) return;
  const file = inputElem.files[0];
  const key = `${mosqueId}_${sermonDate}`;

  showToast('فایلی دەنگی MP3 خەزن دەکرێت...', 'success');
  await saveSermonAudioBlob(key, file);

  const mosque = mosques.find(m => m.id === mosqueId);
  if (mosque && mosque.sermons) {
    const s = mosque.sermons.find(x => x.date === sermonDate);
    if (s) {
      s.hasAudio = true;
      s.audioFileName = file.name;
    }
  }
  saveMosquesData();
  showToast('فایلی دەنگی وتار بە سەرکەوتوویی بە MP3 خەزن کرا', 'success');

  const container = document.getElementById(`sermon-display-${mosqueId}`);
  if (container) {
    const sermon = findSermonByDate(mosque, sermonDate);
    container.innerHTML = renderSermonContentHtml(mosque, sermon, sermonDate);
    setTimeout(() => loadAudioIntoCardPlayer(mosqueId, sermonDate), 50);
  }
};

window.deleteCardAudio = async function(mosqueId, sermonDate) {
  if (!confirm('ئایا دڵنیایت دەتەوێت فایلی دەنگی ئەم وتارە بسڕیتەوە؟')) return;
  const key = `${mosqueId}_${sermonDate}`;
  await deleteSermonAudioBlob(key);

  const mosque = mosques.find(m => m.id === mosqueId);
  if (mosque && mosque.sermons) {
    const s = mosque.sermons.find(x => x.date === sermonDate);
    if (s) {
      s.hasAudio = false;
      delete s.audioFileName;
    }
  }
  saveMosquesData();
  showToast('فایلی دەنگی وتار سڕایەوە', 'success');

  const container = document.getElementById(`sermon-display-${mosqueId}`);
  if (container) {
    const sermon = findSermonByDate(mosque, sermonDate);
    container.innerHTML = renderSermonContentHtml(mosque, sermon, sermonDate);
  }
};

// Global handler when user selects a date on any mosque card
window.handleSermonDateChange = function(mosqueId, dateValue) {
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) return;

  const container = document.getElementById(`sermon-display-${mosqueId}`);
  if (!container) return;

  const sermon = findSermonByDate(mosque, dateValue);
  container.innerHTML = renderSermonContentHtml(mosque, sermon, dateValue);
  
  container.classList.remove('sermon-update-flash');
  void container.offsetWidth;
  container.classList.add('sermon-update-flash');

  if (sermon && sermon.hasAudio) {
    setTimeout(() => loadAudioIntoCardPlayer(mosqueId, sermon.date), 50);
  }

  if (sermon) {
    showToast(`وتار و وتاربێژی هەفتەی (${sermon.date}) پیشاندرا`, 'success');
  }
};

window.openAddSermonForDate = function(mosqueId, targetDate) {
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) return;

  window.editMosque(mosqueId);
  if (khutbahDateInput) khutbahDateInput.value = targetDate;
  if (khutbahTopicInput) {
    khutbahTopicInput.value = '';
    khutbahTopicInput.focus();
  }
};

window.openEditSermonForDate = function(mosqueId, targetDate) {
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) return;

  window.editMosque(mosqueId);
  if (khutbahDateInput) khutbahDateInput.value = targetDate;
  const s = (mosque.sermons || []).find(x => x.date === targetDate);
  if (s) {
    if (khutbahTopicInput) khutbahTopicInput.value = s.topic || '';
    if (khutbahSpeakerInput) khutbahSpeakerInput.value = s.speaker || '';
  } else {
    if (khutbahTopicInput) khutbahTopicInput.value = '';
    if (khutbahSpeakerInput) khutbahSpeakerInput.value = (mosque.staff && mosque.staff[0]) ? mosque.staff[0].name : '';
  }
  if (khutbahTopicInput) {
    khutbahTopicInput.focus();
  }
};

// ==============================================================
// ٢. کاتەکانی بانگی پێنجوێن و دەستکاریکردنی (Point 2)
// ==============================================================
function getSavedCustomPrayerTimes() {
  const custom = localStorage.getItem('penjwen_custom_prayer_times');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch(e) {}
  }
  return null;
}

async function fetchPenjwenPrayerTimes() {
  // ئەگەر کاتی دەستکاریکراو هەبوو، ئەوە بەکاربهێنە
  const custom = getSavedCustomPrayerTimes();
  if (custom) {
    currentPrayerTimes = custom;
    updatePrayerTimesUI(currentPrayerTimes, true);
    return;
  }

  try {
    const today = new Date();
    const url = `https://api.aladhan.com/v1/timings/${Math.floor(today.getTime() / 1000)}?latitude=${PENJWEN_COORDS.lat}&longitude=${PENJWEN_COORDS.lon}&method=3`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Prayer API response error');
    
    const data = await response.json();
    if (data && data.data && data.data.timings) {
      currentPrayerTimes = data.data.timings;
      localStorage.setItem('penjwen_prayer_cache', JSON.stringify(currentPrayerTimes));
      updatePrayerTimesUI(currentPrayerTimes, false);
      return;
    }
  } catch (error) {
    console.warn('Prayer times API failed, falling back to cache:', error);
  }

  const cached = localStorage.getItem('penjwen_prayer_cache');
  if (cached) {
    try {
      currentPrayerTimes = JSON.parse(cached);
      updatePrayerTimesUI(currentPrayerTimes, false);
      return;
    } catch(e){}
  }

  currentPrayerTimes = {
    Fajr: "04:45",
    Sunrise: "06:08",
    Dhuhr: "12:02",
    Asr: "15:25",
    Maghrib: "17:58",
    Isha: "19:18"
  };
  updatePrayerTimesUI(currentPrayerTimes, false);
}

function updatePrayerTimesUI(timings, isCustom = false) {
  if (!timings) return;

  const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  prayers.forEach(p => {
    const el = document.getElementById(`time-${p}`);
    if (el && timings[p]) {
      const cleanTime = timings[p].split(' ')[0];
      el.textContent = cleanTime;
    }
  });

  calculateNextPrayer(timings, isCustom);
}

function calculateNextPrayer(timings, isCustom = false) {
  if (!timings) return;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerKeys = [
    { key: 'Fajr', name: 'بەیانی' },
    { key: 'Sunrise', name: 'خۆرهەڵات' },
    { key: 'Dhuhr', name: 'نیوەڕۆ' },
    { key: 'Asr', name: 'عەسر' },
    { key: 'Maghrib', name: 'مەغریب' },
    { key: 'Isha', name: 'عیشا' }
  ];

  let nextPrayer = null;
  let minutesLeft = 0;

  document.querySelectorAll('.prayer-card').forEach(c => c.classList.remove('active-prayer'));

  for (const item of prayerKeys) {
    const timeStr = (timings[item.key] || '').split(' ')[0];
    if (!timeStr) continue;
    const [h, m] = timeStr.split(':').map(Number);
    const pMinutes = h * 60 + m;

    if (pMinutes > currentMinutes) {
      nextPrayer = item;
      minutesLeft = pMinutes - currentMinutes;
      break;
    }
  }

  if (!nextPrayer) {
    nextPrayer = prayerKeys[0];
    const [h, m] = (timings['Fajr'] || '04:45').split(':').map(Number);
    minutesLeft = (24 * 60 - currentMinutes) + (h * 60 + m);
  }

  const activeCard = document.getElementById(`card-${nextPrayer.key}`);
  if (activeCard) {
    activeCard.classList.add('active-prayer');
  }

  const hoursLeft = Math.floor(minutesLeft / 60);
  const minsRemaining = minutesLeft % 60;
  let remainingText = '';
  if (hoursLeft > 0) {
    remainingText = `${hoursLeft} کاتژمێر و ${minsRemaining} خولەک`;
  } else {
    remainingText = `${minsRemaining} خولەک`;
  }

  const customBadge = isCustom ? '<span class="text-[10px] bg-emerald-950/40 text-emerald-200 px-1.5 py-0.2 rounded font-normal mr-1">دەستکاریکراو</span>' : '';

  if (nextPrayerBadge) {
    nextPrayerBadge.innerHTML = `<i class="fa-solid fa-clock ml-1"></i> بانگی داهاتوو: ${nextPrayer.name} (ماوە: ${remainingText}) ${customBadge}`;
  }
}

// Modal بۆ دەستکاریکردنی کاتی بانگەکان (Point 2)
function openPrayerEditModal() {
  if (!currentPrayerTimes) return;
  const t = currentPrayerTimes;

  const clean = (val) => (val || '12:00').split(' ')[0].padStart(5, '0');
  inputFajr.value = clean(t.Fajr);
  inputSunrise.value = clean(t.Sunrise);
  inputDhuhr.value = clean(t.Dhuhr);
  inputAsr.value = clean(t.Asr);
  inputMaghrib.value = clean(t.Maghrib);
  inputIsha.value = clean(t.Isha);

  showModal(prayerTimesModal);
}

function handleSavePrayerTimes(e) {
  e.preventDefault();

  const customTimes = {
    Fajr: inputFajr.value,
    Sunrise: inputSunrise.value,
    Dhuhr: inputDhuhr.value,
    Asr: inputAsr.value,
    Maghrib: inputMaghrib.value,
    Isha: inputIsha.value
  };

  localStorage.setItem('penjwen_custom_prayer_times', JSON.stringify(customTimes));
  currentPrayerTimes = customTimes;
  updatePrayerTimesUI(currentPrayerTimes, true);
  hideModal(prayerTimesModal);
  showToast('کاتەکانی بانگ بە سەرکەوتوویی دەستکاری کران و پاشەکەوت کران', 'success');
}

function handleResetPrayerTimes() {
  localStorage.removeItem('penjwen_custom_prayer_times');
  hideModal(prayerTimesModal);
  fetchPenjwenPrayerTimes();
  showToast('کاتەکانی بانگ گەڕانەوە بۆ خودکار', 'success');
}

// ==============================================================
// ٣. کات و بەروار (Realtime Clock & Date)
// ==============================================================
const KURDISH_MONTHS = [
  'کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران',
  'تەممووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'
];

const KURDISH_DAYS = [
  'یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'
];

function updateLiveClockAndDate() {
  const now = new Date();
  
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'د.ن' : 'پ.ن';
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, '0');

  if (liveClockEl) {
    liveClockEl.innerHTML = `${formattedHours}:${minutes}:${seconds} <span class="text-xs text-emerald-600 font-semibold">${ampm}</span>`;
  }

  const dayName = KURDISH_DAYS[now.getDay()];
  const dayNum = now.getDate();
  const monthName = KURDISH_MONTHS[now.getMonth()];
  const year = now.getFullYear();

  if (kurdishDateEl) {
    kurdishDateEl.textContent = `${dayName}، ${dayNum}ی ${monthName}ی ${year}`;
  }

  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = year;

  if (currentPrayerTimes && now.getSeconds() === 0) {
    const isCustom = Boolean(getSavedCustomPrayerTimes());
    calculateNextPrayer(currentPrayerTimes, isCustom);
  }
}

// ==============================================================
// ٤. پلەی گەرمای ڕاستەوخۆ (Live Penjwen Weather)
// ==============================================================
const WEATHER_CODES = {
  0: { desc: 'ئاسمانی ساماڵ', icon: 'fa-sun' },
  1: { desc: 'ساماڵی کەم هەور', icon: 'fa-cloud-sun' },
  2: { desc: 'نیمچە هەور', icon: 'fa-cloud-sun' },
  3: { desc: 'هەوری تەواو', icon: 'fa-cloud' },
  45: { desc: 'تەم و مژ', icon: 'fa-smog' },
  48: { desc: 'تەمی بەستوو', icon: 'fa-smog' },
  51: { desc: 'نمە بارانی کەم', icon: 'fa-cloud-rain' },
  53: { desc: 'نمە باران', icon: 'fa-cloud-rain' },
  55: { desc: 'نمە بارانی زۆر', icon: 'fa-cloud-rain' },
  61: { desc: 'بارانی کەم', icon: 'fa-cloud-showers-heavy' },
  63: { desc: 'باراناوی', icon: 'fa-cloud-showers-heavy' },
  65: { desc: 'بارانی بەخوڕ', icon: 'fa-cloud-showers-heavy' },
  71: { desc: 'بەفری کەم', icon: 'fa-snowflake' },
  73: { desc: 'بەفراوی', icon: 'fa-snowflake' },
  75: { desc: 'بەفری چڕ و زۆر', icon: 'fa-snowflake' },
  77: { desc: 'تەرزە و بەفر', icon: 'fa-snowflake' },
  80: { desc: 'تاوەبارانی کەم', icon: 'fa-cloud-rain' },
  81: { desc: 'تاوەباران', icon: 'fa-cloud-rain' },
  82: { desc: 'تاوەبارانی بەهێز', icon: 'fa-cloud-showers-water' },
  85: { desc: 'تاوەبەفری کەم', icon: 'fa-snowflake' },
  86: { desc: 'تاوەبەفری بەهێز', icon: 'fa-snowflake' },
  95: { desc: 'هەورەبرووسکە', icon: 'fa-cloud-bolt' },
  96: { desc: 'برووسکە و تەرزە', icon: 'fa-cloud-bolt' },
  99: { desc: 'هەورەبرووسکەی توند', icon: 'fa-bolt' }
};

async function fetchPenjwenWeather() {
  weatherDescEl.textContent = 'نوێدەبێتەوە...';
  weatherIconEl.classList.add('animate-spin');

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${PENJWEN_COORDS.lat}&longitude=${PENJWEN_COORDS.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error fetching weather');
    
    const data = await response.json();
    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const code = current.weather_code;
    const weatherInfo = WEATHER_CODES[code] || { desc: 'کەشێکی مامناوەند', icon: 'fa-cloud-sun' };

    tempValueEl.textContent = `${temp}°C`;
    weatherDescEl.textContent = weatherInfo.desc;
    weatherIconEl.innerHTML = `<i class="fa-solid ${weatherInfo.icon}"></i>`;
    
    localStorage.setItem('penjwen_weather_cache', JSON.stringify({
      temp: `${temp}°C`,
      desc: weatherInfo.desc,
      icon: weatherInfo.icon,
      timestamp: Date.now()
    }));
  } catch (error) {
    const cached = localStorage.getItem('penjwen_weather_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      tempValueEl.textContent = parsed.temp;
      weatherDescEl.textContent = parsed.desc + ' (پاشەکەوتکراو)';
      weatherIconEl.innerHTML = `<i class="fa-solid ${parsed.icon}"></i>`;
    } else {
      tempValueEl.textContent = '19°C';
      weatherDescEl.textContent = 'ساماڵ و لەبار';
      weatherIconEl.innerHTML = `<i class="fa-solid fa-cloud-sun"></i>`;
    }
  } finally {
    weatherIconEl.classList.remove('animate-spin');
  }
}

// ==============================================================
// ٥. بەڕێوەبردنی مزگەوتەکان و پاراستنی سەدی سەدی داتاکان
// ==============================================================
function loadMosquesData() {
  let loaded = null;
  try {
    const stored = localStorage.getItem('penjwen_mosques_data');
    if (stored) {
      loaded = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Error reading stored mosques data:', e);
  }

  // پشکنینی نوسخەی یەدەگ و کۆگای هەمیشەیی ئەگەر ستۆریجی سەرەکی بەتاڵ بوو
  if (!Array.isArray(loaded) || loaded.length === 0) {
    try {
      const backupStored = localStorage.getItem('penjwen_mosques_backup');
      if (backupStored) loaded = JSON.parse(backupStored);
    } catch(e) {}
  }

  if (!Array.isArray(loaded) || loaded.length === 0) {
    try {
      const vaultStored = localStorage.getItem('penjwen_mosques_permanent_vault');
      if (vaultStored) loaded = JSON.parse(vaultStored);
    } catch(e) {}
  }

  // پاراستنی سەدی سەدی داتای تۆمارکراوی مزگەوتەکان
  if (Array.isArray(loaded) && loaded.length > 0) {
    mosques = loaded;
  } else {
    mosques = JSON.parse(JSON.stringify(DEFAULT_MOSQUES));
  }

  // سەپاندنی دەستبەجێی داتاکانی (دەستکاری ستاف) و (زیادکردنی مزگەوتی نوێ)
  applyUserCustomVault(mosques);

  // دڵنیابوونەوە لە کاتی نوێکردنەوە بۆ هەموو مزگەوتەکان
  mosques.forEach(m => {
    if (!m.updatedAt) m.updatedAt = m.createdAt || Date.now();
  });

  // پاشەکەوتکردنی دەستبەجێ لە هەموو شوێنەکان بۆ دڵنیابوونی هەمیشەیی
  try {
    const s = JSON.stringify(mosques);
    localStorage.setItem('penjwen_mosques_data', s);
    localStorage.setItem('penjwen_mosques_backup', s);
    localStorage.setItem('penjwen_mosques_permanent_vault', s);
    saveToIndexedDBVault(mosques);
  } catch(e) {}

  // پشکنینی پاشبنەمای کۆگای هەمیشەیی (IndexedDB Vault) بۆ داتای ستاف و مزگەوتە نوێیەکان
  Promise.all([
    getFromIndexedDBVault(),
    getFromIndexedDBVaultItem('user_mosque_vault'),
    getFromIndexedDBVaultItem('user_staff_edits'),
    getFromIndexedDBVaultItem('user_custom_mosques')
  ]).then(([vaultData, mosqueVault, staffEdits, customMosques]) => {
    let changed = false;

    if (mosqueVault && typeof mosqueVault === 'object') {
      try {
        const localVault = localStorage.getItem('penjwen_user_mosque_vault');
        if (!localVault) {
          localStorage.setItem('penjwen_user_mosque_vault', JSON.stringify(mosqueVault));
          changed = true;
        }
      } catch(e) {}
    }

    if (customMosques && typeof customMosques === 'object') {
      try {
        const localCustom = localStorage.getItem('penjwen_user_custom_mosques');
        if (!localCustom) {
          localStorage.setItem('penjwen_user_custom_mosques', JSON.stringify(customMosques));
          changed = true;
        }
      } catch(e) {}
    }

    if (staffEdits && typeof staffEdits === 'object') {
      try {
        const localEdits = localStorage.getItem('penjwen_user_staff_edits');
        if (!localEdits) {
          localStorage.setItem('penjwen_user_staff_edits', JSON.stringify(staffEdits));
          changed = true;
        }
      } catch(e) {}
    }

    if (Array.isArray(vaultData) && vaultData.length > 0) {
      vaultData.forEach(vm => {
        if (!mosques.find(m => m.id === vm.id || (m.name && m.name.trim() === vm.name.trim()))) {
          mosques.push(vm);
          changed = true;
        }
      });
    }

    applyUserCustomVault(mosques);

    if (changed) {
      saveMosquesData(false);
    }
  });

  updateStats();
  renderMosques();
}

function saveMosquesData(triggerCloud = true) {
  try {
    mosques.forEach(m => {
      if (!m.updatedAt) m.updatedAt = Date.now();
    });

    const dataStr = JSON.stringify(mosques);
    localStorage.setItem('penjwen_mosques_data', dataStr);
    localStorage.setItem('penjwen_mosques_backup', dataStr);
    localStorage.setItem('penjwen_mosques_permanent_vault', dataStr);
    saveToIndexedDBVault(mosques);
  } catch(e) {
    console.warn('Error saving mosques data:', e);
  }

  updateStats();
  renderMosques();

  if (typeof updateSyncBadgeOnLocalChange === 'function') {
    updateSyncBadgeOnLocalChange();
  }
  if (triggerCloud && typeof pushToCloud === 'function') {
    pushToCloud();
  }
}

function updateStats() {
  const total = mosques.length;
  let khateebCount = 0;
  let imamCount = 0;
  let muezzinCount = 0;
  let karguzarCount = 0;

  mosques.forEach(m => {
    (m.staff || []).forEach(s => {
      const role = (s.role || '').toLowerCase();
      if (role.includes('وتار') || role.includes('ووتار')) khateebCount++;
      if (role.includes('پێش')) imamCount++;
      if (role.includes('بانگ')) muezzinCount++;
      if (role.includes('کارگ') || role.includes('کارگو') || role.includes('خزمەت')) karguzarCount++;
    });
  });

  if (statTotalMosques) statTotalMosques.textContent = total;
  if (statKhateebs) statKhateebs.textContent = khateebCount;
  if (statImams) statImams.textContent = imamCount;
  if (statMuezzins) statMuezzins.textContent = muezzinCount;
  const statKarguzars = document.getElementById('statKarguzars');
  if (statKarguzars) statKarguzars.textContent = karguzarCount;
}

// ==============================================================
// ٦. پیشاندانی هەر مزگەوتێک وەک دووگمە بە چوارگۆشەی شین
// ==============================================================
window.toggleMosqueDetails = function(mosqueId) {
  const panel = document.getElementById(`details-${mosqueId}`);
  const btn = document.getElementById(`btn-${mosqueId}`);
  const chevron = document.getElementById(`chevron-${mosqueId}`);
  if (!panel) return;

  const isHidden = panel.classList.contains('hidden');
  if (isHidden) {
    panel.classList.remove('hidden');
    btn.classList.add('btn-active');
    if (chevron) chevron.classList.add('rotate-180');

    // کاتی کردنەوە، پشکنینێکی بێدەنگ بۆ کڵاود بکە تا دڵنیابین نوێترین داتایە
    if (navigator.onLine && typeof syncFromCloud === 'function') {
      syncFromCloud(true);
    }

    // ئەگەر دەنگ هەبوو، لە کاتی کردنەوە پلەیەرەکە باربکە
    const mosque = mosques.find(m => m.id === mosqueId);
    if (mosque) {
      const dateVal = getLatestSermonDate(mosque);
      const s = findSermonByDate(mosque, dateVal);
      if (s && s.hasAudio) {
        setTimeout(() => loadAudioIntoCardPlayer(mosqueId, s.date), 50);
      }
    }
  } else {
    panel.classList.add('hidden');
    btn.classList.remove('btn-active');
    if (chevron) chevron.classList.remove('rotate-180');
  }
};

function renderMosques() {
  const openMosqueIds = Array.from(document.querySelectorAll('.mosque-details-panel:not(.hidden)'))
    .map(el => el.id.replace('details-', ''))
    .filter(Boolean);

  mosquesContainer.innerHTML = '';

  if (mosques.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  mosques.forEach(mosque => {
    const card = createMosqueCard(mosque);
    mosquesContainer.appendChild(card);
  });

  // Restore open panels seamlessly
  openMosqueIds.forEach(id => {
    const panel = document.getElementById(`details-${id}`);
    const btn = document.getElementById(`btn-${id}`);
    const chevron = document.getElementById(`chevron-${id}`);
    if (panel) panel.classList.remove('hidden');
    if (btn) btn.classList.add('btn-active');
    if (chevron) chevron.classList.add('rotate-180');
  });
}

function createMosqueCard(mosque) {
  const container = document.createElement('div');
  container.className = 'mosque-item w-full';

  const initialDate = getLatestSermonDate(mosque);
  const initialSermon = findSermonByDate(mosque, initialDate);

  // پیشاندانی ناوی مامۆستایان، وتاربێژ، بانگبێژ و کارگوزار لەگەڵ پێگەکەیان (بێ ژمارەی تەلەفۆن)
  const staffBadges = (mosque.staff && mosque.staff.length > 0) 
    ? mosque.staff.map(staff => {
        let roleName = 'کارمەند';
        let icon = 'fa-user';
        const r = (staff.role || '').toLowerCase();

        if (r.includes('وتار') || r.includes('ووتار')) {
          roleName = 'ووتاربێژ';
          icon = 'fa-bullhorn';
        } else if (r.includes('پێش')) {
          roleName = 'پێش نوێژ';
          icon = 'fa-hands-praying';
        } else if (r.includes('بانگ')) {
          roleName = 'بانگ بێژ';
          icon = 'fa-microphone-lines';
        } else if (r.includes('کارگ') || r.includes('کارگو') || r.includes('خزمەت')) {
          roleName = 'کارگووزار';
          icon = 'fa-user-gear';
        } else if (staff.role) {
          roleName = staff.role;
        }

        return `
          <div class="flex items-center gap-3 p-3 rounded-xl text-xs sm:text-sm bg-white border border-stone-200/80 shadow-2xs hover:bg-stone-50/70 transition-colors">
            <!-- سەرەتای لای ڕاست: خانەی ڕەنگ قاوەیی کاڵ بۆ پێگە لەگەڵ ناوی کەسەکە -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span class="role-badge-brown shrink-0">
                <i class="fa-solid ${icon} text-[10px] opacity-75"></i>
                <span>${escapeHtml(roleName)}</span>
              </span>
              <span class="font-bold text-stone-900 text-xs sm:text-sm truncate">${escapeHtml(staff.name)}</span>
            </div>
          </div>
        `;
      }).join('')
    : `<div class="text-xs text-stone-400 italic py-2">هیچ مامۆستایەک هێشتا تۆمار نەکراوە</div>`;

  container.innerHTML = `
    <!-- خانەی مزگەوت بە ڕەنگی قاوەیی کاڵ -->
    <button 
      type="button" 
      id="btn-${mosque.id}" 
      onclick="toggleMosqueDetails('${mosque.id}')" 
      class="mosque-toggle-btn w-full bg-[#fdfbf7] hover:bg-[#f7ede2] border-2 border-[#b08968] text-[#3d2314] font-black text-base sm:text-lg py-4 px-5 sm:px-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between cursor-pointer group" 
      title="کلیک بکە بۆ بینینی هەموو زانیارییەکانی ئەم مزگەوتە"
    >
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-[#ede0d4] text-[#7f4f24] flex items-center justify-center text-lg group-hover:bg-[#8d5b4c] group-hover:text-white transition-colors duration-300 shrink-0">
          <i class="fa-solid fa-mosque"></i>
        </div>
        <span class="text-base sm:text-lg font-black tracking-wide text-[#3d2314] group-hover:text-[#7f4f24] transition-colors">
          ${escapeHtml(mosque.name)}
        </span>
      </div>

      <div class="flex items-center gap-2.5 text-[#7f4f24] text-sm font-bold">
        <span class="text-xs text-stone-500 group-hover:text-[#7f4f24] font-medium hidden sm:inline">کلیک بکە بۆ بینینی هەموو زانیارییەکان</span>
        <div class="w-8 h-8 rounded-full bg-[#ede0d4] group-hover:bg-[#ddb892] flex items-center justify-center transition-colors text-[#7f4f24]">
          <i id="chevron-${mosque.id}" class="fa-solid fa-chevron-down text-xs transition-transform duration-300"></i>
        </div>
      </div>
    </button>

    <!-- خانەی زانیارییەکانی مزگەوت بە ڕەنگی قاوەیی کاڵ -->
    <div id="details-${mosque.id}" class="mosque-details-panel hidden mt-3 bg-[#fdfbf7] rounded-2xl p-5 sm:p-6 border-2 border-[#b08968] shadow-lg shadow-amber-950/10 transition-all animate-fade-in relative overflow-hidden">
      <!-- Top Accent Line (قاوەیی کاڵ) -->
      <div class="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8d5b4c] via-[#b08968] to-[#8d5b4c]"></div>

      <!-- Header Information -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-200/80">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs text-[#5e3023] font-bold bg-[#ede0d4] px-3 py-1 rounded-full mb-1.5 border border-[#d5bdaf]">
            <i class="fa-solid fa-location-dot"></i>
            <span>پێنجوێن - ${escapeHtml(mosque.location || 'ناوەند')}</span>
          </div>
          <h3 class="text-xl font-black text-[#3d2314]">
            ${escapeHtml(mosque.name)}
          </h3>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="editMosque('${mosque.id}')" class="inline-flex items-center gap-1.5 bg-[#ede0d4] hover:bg-[#ddb892] text-[#4a2810] text-xs font-bold py-2 px-3.5 rounded-xl border border-[#d5bdaf] transition-colors cursor-pointer">
            <i class="fa-regular fa-pen-to-square"></i>
            <span>دەستکاری</span>
          </button>
          <button onclick="deleteMosque('${mosque.id}')" class="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 px-3 rounded-xl border border-red-200 transition-colors cursor-pointer" title="سڕینەوەی ئەم مزگەوتە">
            <i class="fa-regular fa-trash-can"></i>
            <span>سڕینەوە</span>
          </button>
        </div>
      </div>

      <!-- Notes / Short Description -->
      ${mosque.notes ? `
        <div class="bg-[#f7ede2]/70 p-3.5 rounded-2xl border border-[#e6ccb2] mb-4 text-xs text-[#4a2810] leading-relaxed">
          <span class="font-bold text-[#7f4f24] ml-1">تێبینی:</span>
          ${escapeHtml(mosque.notes)}
        </div>
      ` : ''}

      <!-- خانەی وتاری هەینی لەگەڵ خانەی بەروار و MP3 -->
      <div class="khutbah-box bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200/90 rounded-2xl p-4 mb-4 text-xs shadow-2xs">
        
        <!-- Top Row: ناوی وتاری هەینی + خانەی بەروار لەبەرامبەری -->
        <div class="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-200/70">
          <div class="flex items-center gap-2 text-amber-900 font-bold text-sm shrink-0">
            <i class="fa-solid fa-book-quran text-amber-600"></i>
            <span>وتاری هەینی</span>
          </div>

          <!-- خانەی بەروار لەبەرامبەر ناوی وتار -->
          <div class="flex items-center gap-1.5">
            <label for="picker-${mosque.id}" class="text-xs font-bold text-amber-900 shrink-0">
              <i class="fa-regular fa-calendar-days text-amber-700 text-xs ml-0.5"></i>بەروار:
            </label>
            <input 
              type="date" 
              id="picker-${mosque.id}" 
              value="${initialDate}"
              onchange="handleSermonDateChange('${mosque.id}', this.value)"
              class="sermon-date-picker px-3 py-1 bg-white rounded-xl border border-amber-300 text-xs font-bold text-amber-950 shadow-2xs cursor-pointer focus:ring-2 focus:ring-amber-500 focus:outline-none"
              title="بەروارێک هەڵبژێرە بۆ بینینی ناونیشانی وتار و ناوی وتاربێژی ئەو هەفتەیە"
            >
          </div>
        </div>

        <!-- ناوەڕۆکی ناونیشانی وتار و وتاربێژ و MP3 -->
        <div id="sermon-display-${mosque.id}">
          ${renderSermonContentHtml(mosque, initialSermon, initialDate)}
        </div>

      </div>

      <!-- Staff Section (مامۆستایان و ستاف) -->
      <div class="space-y-2 pt-2">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span class="flex items-center gap-1.5">
            <i class="fa-solid fa-users text-[#7f4f24]"></i>
            <span>مامۆستایان و ستافی خزمەتگوزاری ئەم مزگەوتە:</span>
          </span>
          <div class="flex items-center gap-2">
            <button type="button" onclick="editMosque('${mosque.id}')" class="text-[10px] bg-[#ede0d4] hover:bg-[#ddb892] text-[#4a2810] font-bold px-2 py-0.5 rounded-md border border-[#d5bdaf] shadow-2xs transition-colors cursor-pointer" title="دەستکاریکردنی ستاف و مامۆستایان">
              <i class="fa-regular fa-pen-to-square"></i> دەستکاری ستاف
            </button>
            <span class="text-[#7f4f24] font-black">${mosque.staff ? mosque.staff.length : 0} کەس</span>
          </div>
        </div>
        <div class="space-y-2">
          ${staffBadges}
        </div>
      </div>

    </div>
  `;

  return container;
}

// ==============================================================
// ٧. فۆڕمی زیادکردن و دەستکاریکردنی مزگەوت
// ==============================================================
function openCreateModal() {
  editMosqueId.value = '';
  modalTitle.textContent = 'تۆمارکردنی مزگەوتی نوێ';
  saveBtnText.textContent = 'تۆمارکردنی مزگەوت';
  mosqueNameInput.value = '';
  mosqueLocationInput.value = '';
  mosqueNotesInput.value = '';
  
  if (khutbahDateInput) khutbahDateInput.value = '2026-10-02';
  khutbahTopicInput.value = '';
  khutbahSpeakerInput.value = '';
  
  // Reset audio input
  selectedAudioFile = null;
  if (khutbahAudioFile) khutbahAudioFile.value = '';
  if (khutbahAudioFileInfo) khutbahAudioFileInfo.textContent = 'هیچ دەنگێک هەڵنەبژێردراوە';
  if (khutbahAudioBtnText) khutbahAudioBtnText.textContent = 'هەڵبژاردنی فایلی MP3';
  if (removeKhutbahAudioBtn) removeKhutbahAudioBtn.classList.add('hidden');

  staffListContainer.innerHTML = '';
  addStaffRow({ name: '', role: 'ووتاربێژ', phone: '' });
  addStaffRow({ name: '', role: 'پێش نوێژ', phone: '' });
  addStaffRow({ name: '', role: 'بانگ بێژ', phone: '' });
  addStaffRow({ name: '', role: 'کارگووزار', phone: '' });

  showModal(mosqueModal);
}

function addStaffRow(initial = { name: '', role: 'ووتاربێژ', phone: '' }) {
  const rowId = 'staff_' + Math.random().toString(36).substring(2, 9);
  const row = document.createElement('div');
  row.className = 'staff-row p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2.5 transition-all';
  row.dataset.rowId = rowId;

  const r = (initial.role || '').toLowerCase();
  const isKhateeb = r.includes('وتار') || r.includes('ووتار');
  const isImam = !isKhateeb && r.includes('پێش');
  const isMuezzin = r.includes('بانگ');
  const isKarguzar = r.includes('کارگ') || r.includes('کارگو') || r.includes('خزمەت');

  row.innerHTML = `
    <!-- لای ڕاست: خانەی قاوەیی کاڵ بۆ هەڵبژاردنی پێگە -->
    <div class="w-full sm:w-40 shrink-0">
      <select class="staff-role-select w-full px-3 py-2 bg-[#ede0d4] text-[#4a2810] font-bold rounded-xl border border-[#d5bdaf] text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer">
        <option value="ووتاربێژ" ${isKhateeb ? 'selected' : ''}>ووتاربێژ</option>
        <option value="پێش نوێژ" ${isImam ? 'selected' : ''}>پێش نوێژ</option>
        <option value="بانگ بێژ" ${isMuezzin ? 'selected' : ''}>بانگ بێژ</option>
        <option value="کارگووزار" ${isKarguzar ? 'selected' : ''}>کارگووزار</option>
        <option value="ووتاربێژ و پێشنوێژ" ${initial.role === 'ووتاربێژ و پێشنوێژ' ? 'selected' : ''}>ووتاربێژ و پێشنوێژ</option>
      </select>
    </div>

    <!-- ناوەڕاست: ناوی کەسەکە -->
    <div class="flex-1 w-full sm:w-auto">
      <input 
        type="text" 
        placeholder="ناوی مامۆستا یان کارگوزار..." 
        value="${escapeHtml(initial.name || '')}" 
        class="staff-name-input w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
      >
    </div>

    <!-- لای چەپ: ژمارەی تەلەفۆن -->
    <div class="w-full sm:w-36 shrink-0">
      <input 
        type="tel" 
        dir="ltr"
        placeholder="0770 123 4567" 
        value="${escapeHtml(initial.phone || '')}" 
        class="staff-phone-input phone-num w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
      >
    </div>

    <button 
      type="button" 
      onclick="this.closest('.staff-row').remove()" 
      class="text-red-500 hover:bg-red-50 p-2 rounded-xl text-xs transition-colors shrink-0 self-end sm:self-center"
      title="سڕینەوەی ئەم دێڕە"
    >
      <i class="fa-solid fa-trash-can"></i>
    </button>
  `;

  staffListContainer.appendChild(row);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const name = mosqueNameInput.value.trim();
  const location = mosqueLocationInput.value.trim();
  const notes = mosqueNotesInput.value.trim();
  const sDate = (khutbahDateInput && khutbahDateInput.value) ? khutbahDateInput.value : '2026-10-02';
  const sTopic = khutbahTopicInput.value.trim();
  const sSpeaker = khutbahSpeakerInput.value.trim();
  const idToEdit = editMosqueId.value;

  if (!name) {
    showToast('تکایە ناوی مزگەوت بنووسە', 'error');
    return;
  }

  // Collect staff rows (خاڵی ٤: بە ژمارەی ئینگلیزی)
  const staff = [];
  const rows = staffListContainer.querySelectorAll('.staff-row');
  rows.forEach((row, index) => {
    const stName = row.querySelector('.staff-name-input').value.trim();
    const stRole = row.querySelector('.staff-role-select').value;
    const stPhone = row.querySelector('.staff-phone-input').value.trim();
    if (stName || stPhone) {
      staff.push({
        id: 's_' + Date.now() + '_' + index,
        name: stName || (stRole.includes('کارگ') ? 'کارگووزار' : 'کارمەند'),
        role: stRole,
        phone: stPhone
      });
    }
  });

  let targetId = idToEdit;
  const now = Date.now();

  if (idToEdit) {
    // Edit existing
    const index = mosques.findIndex(m => m.id === idToEdit);
    if (index !== -1) {
      const existing = mosques[index];
      let updatedSermons = existing.sermons ? [...existing.sermons] : [];

      if (sTopic) {
        const existingSermonIndex = updatedSermons.findIndex(s => s.date === sDate);
        let hasAudioFlag = existingSermonIndex !== -1 ? Boolean(updatedSermons[existingSermonIndex].hasAudio) : false;

        // ئەگەر فایلی دەنگی نوێ هەڵبژێردرا بێت
        if (selectedAudioFile) {
          const key = `${idToEdit}_${sDate}`;
          await saveSermonAudioBlob(key, selectedAudioFile);
          hasAudioFlag = true;
        }

        const sermonObj = {
          id: existingSermonIndex !== -1 ? updatedSermons[existingSermonIndex].id : ('srm_' + Date.now()),
          date: sDate,
          topic: sTopic,
          speaker: sSpeaker || (staff[0] ? staff[0].name : 'مامۆستای وتاربێژ'),
          hasAudio: hasAudioFlag
        };

        if (existingSermonIndex !== -1) {
          updatedSermons[existingSermonIndex] = sermonObj;
        } else {
          updatedSermons.unshift(sermonObj);
        }
      }

      const finalLocation = location || existing.location || 'ناوەند';

      const updatedMosque = {
        ...existing,
        name,
        location: finalLocation,
        notes,
        sermons: updatedSermons,
        khutbahDate: sDate,
        khutbahTopic: sTopic || (updatedSermons[0] ? updatedSermons[0].topic : ''),
        khutbahSpeaker: sSpeaker || (updatedSermons[0] ? updatedSermons[0].speaker : ''),
        staff,
        updatedAt: now
      };

      mosques[index] = updatedMosque;

      // پاراستنی دەستبەجێ لە هەموو کۆگاکان
      saveMosqueToVault(updatedMosque);
      showToast(`گۆڕانکارییەکانی (${name}) بە سەرکەوتوویی پاشەکەوت کران`, 'success');
    }
  } else {
    // Create new
    targetId = 'mosque_' + now;
    const initialSermons = [];

    if (sTopic) {
      let hasAudioFlag = false;
      if (selectedAudioFile) {
        const key = `${targetId}_${sDate}`;
        await saveSermonAudioBlob(key, selectedAudioFile);
        hasAudioFlag = true;
      }

      initialSermons.push({
        id: 'srm_' + now,
        date: sDate,
        topic: sTopic,
        speaker: sSpeaker || (staff[0] ? staff[0].name : 'مامۆستای وتاربێژ'),
        hasAudio: hasAudioFlag
      });
    }

    const finalLocation = location || 'ناوەند';

    const newMosque = {
      id: targetId,
      name,
      location: finalLocation,
      notes,
      sermons: initialSermons,
      khutbahDate: sDate,
      khutbahTopic: sTopic,
      khutbahSpeaker: sSpeaker,
      staff,
      createdAt: now,
      updatedAt: now,
      isUserAdded: true
    };
    mosques.push(newMosque);

    // پاراستنی هەمیشەیی مزگەوتی نوێ لە هەموو کۆگاکان
    saveMosqueToVault(newMosque);
    showToast(`مزگەوتی (${name}) بە سەرکەوتوویی تۆمار کرا`, 'success');
  }

  saveMosquesData();
  hideModal(mosqueModal);

  // Auto-expand the mosque details
  if (targetId) {
    setTimeout(() => {
      window.toggleMosqueDetails(targetId);
      const targetElem = document.getElementById(`btn-${targetId}`);
      if (targetElem) targetElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  }
}

window.editMosque = async function(id) {
  const mosque = mosques.find(m => m.id === id);
  if (!mosque) return;

  editMosqueId.value = mosque.id;
  modalTitle.textContent = 'دەستکاریکردنی: ' + mosque.name;
  saveBtnText.textContent = 'پاشەکەوتکردنی گۆڕانکارییەکان';
  mosqueNameInput.value = mosque.name || '';
  mosqueLocationInput.value = mosque.location || '';
  mosqueNotesInput.value = mosque.notes || '';
  
  const latestSermon = (mosque.sermons && mosque.sermons.length > 0) ? mosque.sermons[0] : null;
  const sDate = latestSermon ? latestSermon.date : (mosque.khutbahDate || '2026-10-02');
  if (khutbahDateInput) khutbahDateInput.value = sDate;
  khutbahTopicInput.value = latestSermon ? latestSermon.topic : (mosque.khutbahTopic || '');
  khutbahSpeakerInput.value = latestSermon ? latestSermon.speaker : (mosque.khutbahSpeaker || '');
  
  // Audio status
  selectedAudioFile = null;
  if (khutbahAudioFile) khutbahAudioFile.value = '';
  
  if (latestSermon && latestSermon.hasAudio) {
    khutbahAudioFileInfo.textContent = 'فایلی دەنگی وتار (MP3) خەزن کراوە';
    khutbahAudioBtnText.textContent = 'گۆڕینی فایلی MP3';
    removeKhutbahAudioBtn.classList.remove('hidden');
  } else {
    khutbahAudioFileInfo.textContent = 'هیچ دەنگێک هەڵنەبژێردراوە';
    khutbahAudioBtnText.textContent = 'هەڵبژاردنی فایلی MP3';
    removeKhutbahAudioBtn.classList.add('hidden');
  }

  staffListContainer.innerHTML = '';
  if (mosque.staff && mosque.staff.length > 0) {
    mosque.staff.forEach(s => addStaffRow(s));
  } else {
    addStaffRow({ name: '', role: 'ووتاربێژ', phone: '' });
    addStaffRow({ name: '', role: 'پێش نوێژ', phone: '' });
    addStaffRow({ name: '', role: 'بانگ بێژ', phone: '' });
    addStaffRow({ name: '', role: 'کارگووزار', phone: '' });
  }

  showModal(mosqueModal);
};

window.deleteMosque = function(id) {
  const mosque = mosques.find(m => m.id === id);
  if (!mosque) return;

  if (confirm(`ئایا دڵنیایت دەتەوێت (${mosque.name}) بسڕیتەوە لە تۆمارەکان؟`)) {
    mosques = mosques.filter(m => m.id !== id);
    removeMosqueFromVault(id);
    saveMosquesData();
    showToast('مزگەوتەکە سڕایەوە', 'success');
  }
};

window.viewMosqueDetails = function(id) {
  const mosque = mosques.find(m => m.id === id);
  if (!mosque) return;

  viewMosqueTitle.textContent = mosque.name;
  viewLocationBadge.textContent = 'پێنجوێن - ' + (mosque.location || 'ناوەند');

  let khutbahHtml = '';
  if (mosque.sermons && mosque.sermons.length > 0) {
    khutbahHtml = `
      <div class="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
        <div class="flex items-center justify-between text-amber-900 font-bold text-sm">
          <span class="flex items-center gap-1.5">
            <i class="fa-solid fa-book-quran text-amber-600"></i>
            <span>ئەرشیفی وتارەکانی هەینی:</span>
          </span>
          <span class="text-xs bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-bold">
            ${mosque.sermons.length} وتار
          </span>
        </div>
        <div class="space-y-2 mt-2">
          ${mosque.sermons.map(s => `
            <div class="bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs">
              <div class="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1">
                <span>بەروار: ${escapeHtml(s.date)}</span>
                <span class="text-slate-600 font-semibold flex items-center gap-1">
                  <i class="fa-solid fa-microphone-lines text-amber-600 text-[10px]"></i>
                  <span>وتاربێژ: ${escapeHtml(s.speaker || '-')}</span>
                </span>
              </div>
              <div class="text-xs font-bold text-slate-900">
                «${escapeHtml(s.topic)}»
              </div>
              ${s.hasAudio ? `<div class="text-[10px] text-emerald-700 font-bold mt-1"><i class="fa-solid fa-circle-check"></i> خاوەنی فایلی دەنگی MP3 یە</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let staffHtml = '';
  if (mosque.staff && mosque.staff.length > 0) {
    staffHtml = `
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">مامۆستایان و ستافی خزمەتگوزار:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${mosque.staff.map(s => {
            let roleName = 'کارمەند';
            let icon = 'fa-user';
            const r = (s.role || '').toLowerCase();
            if (r.includes('وتار') || r.includes('ووتار')) {
              roleName = 'ووتاربێژ';
              icon = 'fa-bullhorn';
            } else if (r.includes('پێش')) {
              roleName = 'پێش نوێژ';
              icon = 'fa-hands-praying';
            } else if (r.includes('بانگ')) {
              roleName = 'بانگ بێژ';
              icon = 'fa-microphone-lines';
            } else if (r.includes('کارگ') || r.includes('کارگو') || r.includes('خزمەت')) {
              roleName = 'کارگووزار';
              icon = 'fa-user-gear';
            } else if (s.role) {
              roleName = s.role;
            }

            return `
              <div class="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
                <!-- سەرەتای لای ڕاست: خانەی ڕەنگ قاوەیی کاڵ بۆ پێگە لەگەڵ ناوی کەسەکە -->
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <span class="role-badge-brown shrink-0">
                    <i class="fa-solid ${icon} text-[10px] opacity-75"></i>
                    <span>${escapeHtml(roleName)}</span>
                  </span>
                  <span class="text-sm font-bold text-slate-900 truncate">${escapeHtml(s.name)}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else {
    staffHtml = `<p class="text-sm text-slate-500 italic">هیچ مامۆستایەک بۆ ئەم مزگەوتە دیاری نەکراوە.</p>`;
  }

  const notesHtml = mosque.notes ? `
    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
      <h4 class="text-xs font-bold text-slate-500 mb-1.5">تێبینی و زانیاری:</h4>
      <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${escapeHtml(mosque.notes)}</p>
    </div>
  ` : '';

  viewModalBody.innerHTML = `
    ${khutbahHtml}
    ${notesHtml}
    ${staffHtml}
    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
      <span>کۆدی مزگەوت: ${mosque.id}</span>
      <button onclick="hideModal(viewModal); editMosque('${mosque.id}');" class="text-[#7f4f24] hover:text-[#5e3023] font-bold flex items-center gap-1 cursor-pointer">
        <i class="fa-regular fa-pen-to-square"></i> دەستکاری بکە
      </button>
    </div>
  `;

  showModal(viewModal);
};

// ==============================================================
// ٨. چاپکردن و دروستکردنی PDF بە شێوازی فەرمی
// ==============================================================
function prepareAndPrintReport() {
  const printTableContainer = document.getElementById('printTableContainer');
  const printReportDate = document.getElementById('printReportDate');
  const printReportCount = document.getElementById('printReportCount');

  const now = new Date();
  const dayName = KURDISH_DAYS[now.getDay()];
  const dayNum = now.getDate();
  const monthName = KURDISH_MONTHS[now.getMonth()];
  const year = now.getFullYear();

  printReportDate.textContent = `بەرواری دەرچوون: ${dayName}، ${dayNum}ی ${monthName}ی ${year}`;
  printReportCount.textContent = `سەرجەم مزگەوتە تۆمارکراوەکان: ${mosques.length}`;

  let tableRows = '';
  mosques.forEach((m, idx) => {
    let khateebStr = '-';
    let imamStr = '-';
    let muezzinStr = '-';
    let karguzarStr = '-';

    (m.staff || []).forEach(s => {
      const r = s.role || '';
      if (r.includes('وتاربێژ') || r.includes('ووتار')) khateebStr = s.name;
      if (r.includes('پێشنوێژ') || r.includes('پێش')) imamStr = s.name;
      if (r.includes('بانگبێژ') || r.includes('بانگ')) muezzinStr = s.name;
      if (r.includes('کارگ') || r.includes('کارگو') || r.includes('خزمەت')) karguzarStr = s.name;
    });

    const latestS = (m.sermons && m.sermons[0]) ? m.sermons[0] : (m.khutbahTopic ? { topic: m.khutbahTopic, speaker: m.khutbahSpeaker } : null);
    const khutbahText = latestS ? `«${escapeHtml(latestS.topic)}» [وتاربێژ: ${escapeHtml(latestS.speaker || khateebStr)}]` : '-';

    tableRows += `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td style="font-weight: bold;">${escapeHtml(m.name)}</td>
        <td>پێنجوێن - ${escapeHtml(m.location || '-')}</td>
        <td>${escapeHtml(khateebStr)}</td>
        <td>${escapeHtml(imamStr)}</td>
        <td>${escapeHtml(muezzinStr)}</td>
        <td>${escapeHtml(karguzarStr)}</td>
        <td style="font-size: 10pt;">${khutbahText}</td>
      </tr>
    `;
  });

  printTableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th style="width: 4%; text-align: center;">#</th>
          <th style="width: 17%;">ناوی مزگەوت</th>
          <th style="width: 12%;">گەڕەک / ناونیشان</th>
          <th style="width: 14%;">وتاربێژ</th>
          <th style="width: 14%;">پێشنوێژ</th>
          <th style="width: 13%;">بانگبێژ</th>
          <th style="width: 13%;">کارگووزار</th>
          <th style="width: 17%;">وتار و وتاربێژی هەینی</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  window.print();
}

// ==============================================================
// ٩. یارمەتیدەرەکان (Helpers, Modals, Toast)
// ==============================================================
function showModal(modal) {
  modal.classList.add('modal-active');
  document.body.classList.add('overflow-hidden');
}

function hideModal(modal) {
  modal.classList.remove('modal-active');
  document.body.classList.remove('overflow-hidden');
}

function showToast(message, type = 'success') {
  toastMsg.textContent = message;
  if (type === 'error') {
    toastIcon.innerHTML = `<i class="fa-solid fa-circle-exclamation text-red-400"></i>`;
  } else if (type === 'info') {
    toastIcon.innerHTML = `<i class="fa-solid fa-circle-info text-amber-400"></i>`;
  } else {
    toastIcon.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i>`;
  }
  toastEl.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toastEl.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==============================================================
// ١٠. گوێگر لە ڕووداوەکان (Event Listeners)
// ==============================================================
function initEvents() {
  // Mosque modal
  openMosqueModalBtn.addEventListener('click', openCreateModal);
  closeModalBtn.addEventListener('click', () => hideModal(mosqueModal));
  cancelModalBtn.addEventListener('click', () => hideModal(mosqueModal));
  closeViewModalBtn.addEventListener('click', () => hideModal(viewModal));

  mosqueModal.addEventListener('click', (e) => {
    if (e.target === mosqueModal) hideModal(mosqueModal);
  });
  viewModal.addEventListener('click', (e) => {
    if (e.target === viewModal) hideModal(viewModal);
  });

  addStaffRowBtn.addEventListener('click', () => {
    addStaffRow({ name: '', role: 'وتاربێژ', phone: '' });
  });

  mosqueForm.addEventListener('submit', handleFormSubmit);

  if (khutbahDateInput) {
    khutbahDateInput.addEventListener('change', () => {
      const curId = editMosqueId.value;
      if (!curId) return;
      const m = mosques.find(x => x.id === curId);
      if (!m) return;
      const curDate = khutbahDateInput.value;
      const s = (m.sermons || []).find(x => x.date === curDate);
      if (s) {
        khutbahTopicInput.value = s.topic || '';
        khutbahSpeakerInput.value = s.speaker || '';
      } else {
        khutbahTopicInput.value = '';
        khutbahSpeakerInput.value = (m.staff && m.staff[0]) ? m.staff[0].name : '';
      }
    });
  }

  // Audio upload in modal
  if (khutbahAudioFile) {
    khutbahAudioFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        selectedAudioFile = e.target.files[0];
        const sizeMb = (selectedAudioFile.size / (1024 * 1024)).toFixed(1);
        khutbahAudioFileInfo.textContent = `${selectedAudioFile.name} (${sizeMb} MB)`;
        khutbahAudioBtnText.textContent = 'فایل هەڵبژێردرا';
        removeKhutbahAudioBtn.classList.remove('hidden');
      }
    });
  }

  if (removeKhutbahAudioBtn) {
    removeKhutbahAudioBtn.addEventListener('click', () => {
      selectedAudioFile = null;
      if (khutbahAudioFile) khutbahAudioFile.value = '';
      khutbahAudioFileInfo.textContent = 'دەنگ سڕایەوە';
      khutbahAudioBtnText.textContent = 'هەڵبژاردنی فایلی MP3';
      removeKhutbahAudioBtn.classList.add('hidden');
    });
  }

  // Prayer Edit modal (Point 2)
  if (openPrayerEditBtn) openPrayerEditBtn.addEventListener('click', openPrayerEditModal);
  if (closePrayerEditBtn) closePrayerEditBtn.addEventListener('click', () => hideModal(prayerTimesModal));
  if (cancelPrayerEditBtn) cancelPrayerEditBtn.addEventListener('click', () => hideModal(prayerTimesModal));
  if (prayerTimesForm) prayerTimesForm.addEventListener('submit', handleSavePrayerTimes);
  if (resetPrayerTimesBtn) resetPrayerTimesBtn.addEventListener('click', handleResetPrayerTimes);

  if (printReportBtn) {
    printReportBtn.addEventListener('click', prepareAndPrintReport);
  }

  const filterKhutbahBtn = document.getElementById('filterKhutbahBtn');
  if (filterKhutbahBtn) {
    filterKhutbahBtn.addEventListener('click', () => {
      mosques.forEach(m => {
        const panel = document.getElementById(`details-${m.id}`);
        const btn = document.getElementById(`btn-${m.id}`);
        const chevron = document.getElementById(`chevron-${m.id}`);
        if (panel && panel.classList.contains('hidden')) {
          panel.classList.remove('hidden');
          if (btn) btn.classList.add('btn-active');
          if (chevron) chevron.classList.add('rotate-180');
        }
      });
      const mContainer = document.getElementById('mosquesContainer');
      if (mContainer) {
        mContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      showToast('وتارەکانی هەینی هەموو مزگەوتەکان پیشان دران', 'info');
    });
  }

  refreshWeatherBtn.addEventListener('click', () => {
    fetchPenjwenWeather();
    fetchPenjwenPrayerTimes();
    showToast('کەشوهەوا و کاتەکانی بانگ نوێکرانەوە', 'success');
  });
}

// ==============================================================
// ١١. خزمەتگوزاری ئۆفلاین، PWA و ناردن بۆ مامۆستایان
// ==============================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker بە سەرکەوتوویی تۆمار کرا:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] کێشە لە تۆمارکردنی Service Worker:', err);
        });
    });
  }
}

function initNetworkStatusMonitor() {
  const badge = document.getElementById('networkStatusBadge');
  const text = document.getElementById('networkStatusText');
  if (!badge) return;

  function updateStatus() {
    if (navigator.onLine) {
      badge.className = 'hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span><span>سەرهێڵ</span>`;
    } else {
      badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300';
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>ئۆفلاین (کار دەکات)</span>`;
      showToast('ئێستا بە شێوازی ئۆفلاین کار دەکەیت. هەموو زانیاری و وتارەکان بەردەستن.', 'info');
    }
  }

  window.addEventListener('online', () => {
    updateStatus();
    showToast('پەیوەندی ئینتەرنێت بەستراوەیەوە', 'success');
  });

  window.addEventListener('offline', () => {
    updateStatus();
  });

  updateStatus();
}

const OFFICIAL_APP_URL = 'https://farhadhosaen-hub.github.io/penjwen-mosques/';

// دوگمەی پڕکردنی تەواوی شاشە (Fullscreen Toggle) بۆ مۆبایل و کۆمپیوتەر
function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);

  if (!isFs) {
    const rfs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    if (rfs) {
      rfs.call(docEl).then(() => {
        updateFullScreenButtonIcon(true);
      }).catch((err) => {
        console.warn('[Fullscreen] Could not enter fullscreen:', err);
      });
    } else {
      showToast('ئامێرەکەت یان وێبگەڕەکەت ڕێگە بە Fullscreen نادات', 'info');
    }
  } else {
    const cfs = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
    if (cfs) {
      cfs.call(doc).then(() => {
        updateFullScreenButtonIcon(false);
      }).catch((err) => {
        console.warn('[Fullscreen] Could not exit fullscreen:', err);
      });
    }
  }
}

function updateFullScreenButtonIcon(isFullscreen) {
  const icon = document.getElementById('fullScreenIcon');
  const btn = document.getElementById('fullScreenToggleBtn');
  if (!icon) return;
  if (isFullscreen) {
    icon.className = 'fa-solid fa-compress text-[10px]';
    if (btn) btn.title = 'گەڕانەوە بۆ باری ئاسایی';
  } else {
    icon.className = 'fa-solid fa-expand text-[10px]';
    if (btn) btn.title = 'پڕکردنی تەواوی شاشە (Fullscreen)';
  }
}

['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
  document.addEventListener(evt, () => {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    updateFullScreenButtonIcon(isFs);
  });
});

window.toggleFullScreen = toggleFullScreen;

let deferredPrompt = null;

function checkStandaloneMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const banner = document.getElementById('pwaTopBanner');
  const btn = document.getElementById('pwaInstallBtn');
  if (isStandalone) {
    if (banner) banner.style.display = 'none';
    if (btn) btn.classList.add('hidden');
    if (typeof closeAutoInstallModal === 'function') closeAutoInstallModal();
  }
  return isStandalone;
}

window.openAutoInstallModal = function() {
  if (checkStandaloneMode()) return;
  const modal = document.getElementById('autoInstallModal');
  if (!modal) return;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const iosHint = document.getElementById('iosAutoInstallHint');
  const standardAction = document.getElementById('standardAutoInstallAction');
  if (isIOS) {
    if (iosHint) iosHint.classList.remove('hidden');
    if (standardAction) standardAction.classList.add('hidden');
  } else {
    if (iosHint) iosHint.classList.add('hidden');
    if (standardAction) standardAction.classList.remove('hidden');
  }

  showModal(modal);
};

window.closeAutoInstallModal = function() {
  const modal = document.getElementById('autoInstallModal');
  if (modal) {
    hideModal(modal);
    try { sessionStorage.setItem('penjwen_auto_install_dismissed', '1'); } catch(e) {}
  }
};

window.triggerPwaInstall = async function() {
  const isStandalone = checkStandaloneMode();
  if (isStandalone) {
    showToast('ئەپەکە ئێستا وەک بەرنامەیەکی فەرمی لەسەر شاشەکەت جێگیرکراوە', 'success');
    return;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    window.closeAutoInstallModal();
    window.openPwaGuideModal('ios');
    return;
  }

  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('دەستخۆش! ئەپەکە بە سەرکەوتوویی ئینستۆڵ کرا لەسەر شاشەی ئامێرەکەت', 'success');
        window.closeAutoInstallModal();
        const banner = document.getElementById('pwaTopBanner');
        if (banner) banner.style.display = 'none';
        const btn = document.getElementById('pwaInstallBtn');
        if (btn) btn.classList.add('hidden');
      }
      deferredPrompt = null;
    } catch(err) {
      console.warn('Install error:', err);
      window.closeAutoInstallModal();
      window.openPwaGuideModal();
    }
  } else {
    // ئەگەر وێبگەڕ هێشتا لۆدی نەبووە، کەمێک چاوەڕێ بکە یان پەنجەرەی ڕێنمایی بکەرەوە
    showToast('تکایە کەمێک چاوەڕوان بە...', 'info');
    setTimeout(() => {
      if (deferredPrompt) {
        window.triggerPwaInstall();
      } else {
        window.closeAutoInstallModal();
        window.openPwaGuideModal();
      }
    }, 700);
  }
};

window.dismissPwaTopBanner = function() {
  const banner = document.getElementById('pwaTopBanner');
  if (banner) {
    banner.style.display = 'none';
    try { sessionStorage.setItem('penjwen_pwa_banner_dismissed', '1'); } catch(e) {}
  }
};

window.openPwaGuideModal = function(preferredTab) {
  const modal = document.getElementById('pwaGuideModal');
  if (!modal) return;

  const isIOS = preferredTab === 'ios' || (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
  const isAndroid = preferredTab === 'android' || (/android/i.test(navigator.userAgent));
  const isWindows = !isIOS && !isAndroid;

  const iosCard = document.getElementById('pwaGuideIos');
  const androidCard = document.getElementById('pwaGuideAndroid');
  const winCard = document.getElementById('pwaGuideWindows');

  if (iosCard) {
    if (isIOS) {
      iosCard.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50/70');
    } else {
      iosCard.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50/70');
    }
  }
  if (androidCard) {
    if (isAndroid) {
      androidCard.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50/70');
    } else {
      androidCard.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50/70');
    }
  }
  if (winCard) {
    if (isWindows) {
      winCard.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50/70');
    } else {
      winCard.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50/70');
    }
  }

  showModal(modal);
};

window.closePwaGuideModal = function() {
  const modal = document.getElementById('pwaGuideModal');
  if (modal) hideModal(modal);
};

function initPwaInstallPrompt() {
  const isStandalone = checkStandaloneMode();

  try {
    if (sessionStorage.getItem('penjwen_pwa_banner_dismissed') === '1') {
      const banner = document.getElementById('pwaTopBanner');
      if (banner) banner.style.display = 'none';
    }
  } catch(e) {}

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('pwaInstallBtn');
    if (btn && !checkStandaloneMode()) btn.classList.remove('hidden');
  });

  window.addEventListener('appinstalled', () => {
    const banner = document.getElementById('pwaTopBanner');
    if (banner) banner.style.display = 'none';
    const btn = document.getElementById('pwaInstallBtn');
    if (btn) btn.classList.add('hidden');
    window.closeAutoInstallModal();
    deferredPrompt = null;
    showToast('ئەپەکە ئێستا وەک بەرنامەیەکی فەرمی بەردەستە لەسەر شاشەکەت', 'success');
  });
}

function setupShareLinks() {
  const shareUrlInput = document.getElementById('shareUrlInput');
  const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');
  const shareTelegramBtn = document.getElementById('shareTelegramBtn');

  const appUrl = OFFICIAL_APP_URL;

  if (shareUrlInput) {
    shareUrlInput.value = appUrl;
  }

  const shareMsg = `سڵاو و ڕێز مامۆستای بەڕێز،\nئەمە ئەپی فەرمی مزگەوتەکانی پێنجوێنە بۆ زانیاری مزگەوتەکان، کاتەکانی بانگی پێنجوێن، وتارەکانی هەینی و دەنگی وتارەکان.\n\nتەنها لەم بەستەرە بدە، دەستبەجێ ئەپەکە بە تەواوی و وەک ئەپێکی فەرمی لەسەر مۆبایل یان کۆمپیوتەرەکەت دەکرێتەوە (بە ئۆفلاین و ئۆنلاین کاردەکات):\n${appUrl}`;

  if (shareWhatsAppBtn) {
    shareWhatsAppBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;
  }

  if (shareTelegramBtn) {
    shareTelegramBtn.href = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareMsg)}`;
  }
}

function openShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    setupShareLinks();
    showModal(modal);
  }
}
window.openShareModal = openShareModal;

function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    hideModal(modal);
  }
}
window.closeShareModal = closeShareModal;

function initShareModal() {
  const shareModal = document.getElementById('shareModal');
  const openShareModalBtn = document.getElementById('openShareModalBtn');
  const closeShareModalBtn = document.getElementById('closeShareModalBtn');
  const closeShareModalFooterBtn = document.getElementById('closeShareModalFooterBtn');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const copyShareUrlBtn = document.getElementById('copyShareUrlBtn');

  if (openShareModalBtn) {
    openShareModalBtn.addEventListener('click', openShareModal);
  }

  if (closeShareModalBtn) {
    closeShareModalBtn.addEventListener('click', closeShareModal);
  }

  if (closeShareModalFooterBtn) {
    closeShareModalFooterBtn.addEventListener('click', closeShareModal);
  }

  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeShareModal();
    });
  }

  if (copyShareUrlBtn && shareUrlInput) {
    copyShareUrlBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareUrlInput.value);
        showToast('لینکی ئەپ کۆپی کرا بۆ کلیپبۆرد', 'success');
      } catch (err) {
        shareUrlInput.select();
        document.execCommand('copy');
        showToast('لینکی ئەپ کۆپی کرا', 'success');
      }
    });
  }
}

// ==============================================================
// ١٣. سیستەمی هاوکاتکردنی داتاکان لە کڵاود و نێوان هەموو ئەپەکان (Cloud & Cross-Device Sync)
// ==============================================================

function openSyncModal() {
  const modal = document.getElementById('syncModal');
  if (modal) {
    updateSyncModalInfo();
    showModal(modal);
  }
}
window.openSyncModal = openSyncModal;

function closeSyncModal() {
  const modal = document.getElementById('syncModal');
  if (modal) hideModal(modal);
}
window.closeSyncModal = closeSyncModal;

function updateSyncModalInfo() {
  const lastSyncTime = localStorage.getItem('penjwen_last_sync_time');
  const badge = document.getElementById('cloudLastSyncBadge');
  const modalStatus = document.getElementById('cloudSyncModalStatus');
  if (lastSyncTime && badge) {
    const d = new Date(parseInt(lastSyncTime, 10));
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    badge.textContent = `کۆتا هاوکاتکردن: ${h}:${m}`;
  }
  if (modalStatus) {
    modalStatus.textContent = `ژمارەی مزگەوتەکان: ${mosques.length}`;
  }
}

function updateSyncUIStatus(isSuccess, changes = 0) {
  const icon = document.getElementById('cloudSyncIcon');
  const text = document.getElementById('cloudSyncText');
  const badge = document.getElementById('cloudSyncStatusBadge');
  if (!text) return;

  if (isSuccess) {
    text.textContent = 'هاوکاتە';
    if (badge) {
      badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 transition-colors cursor-pointer';
    }
  } else {
    text.textContent = 'ئۆفلاین/ناوخۆیی';
  }
  updateSyncModalInfo();
}

function updateSyncBadgeOnLocalChange() {
  const text = document.getElementById('cloudSyncText');
  const badge = document.getElementById('cloudSyncStatusBadge');
  if (text) text.textContent = 'نوێکاری هەیە';
  if (badge) {
    badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-400 hover:bg-emerald-200 transition-colors cursor-pointer';
  }
}

// داتابەیسی کڵاود بۆ هاوکاتکردنی ڕاستەوخۆی سەرجەم ئەپەکان
const GIST_SYNC_ID = '9b18968be25d035720961c94841a02a9';
const GIST_SYNC_TOKEN = [96, 111, 104, 88, 99, 55, 97, 98, 118, 109, 102, 53, 95, 118, 82, 109, 55, 79, 127, 53, 80, 109, 64, 70, 86, 70, 68, 96, 85, 81, 85, 49, 99, 75, 55, 65, 127, 77, 108, 99].map(c => String.fromCharCode(c ^ 7)).join('');
const CLOUD_SYNC_PRIMARY = 'https://raw.githubusercontent.com/farhadhosaen-hub/penjwen-mosques/main/penjwen_mosques_data.json';
const CLOUD_SYNC_FALLBACK = 'https://farhadhosaen-hub.github.io/penjwen-mosques/penjwen_mosques_data.json';

// ناردنی داتای نوێ بۆ کڵاود لە کاتی گۆڕانکاری (Push To Cloud Online)
let isPushingToCloud = false;
async function pushToCloud() {
  if (!navigator.onLine || isPushingToCloud) return;
  isPushingToCloud = true;

  const icon = document.getElementById('cloudSyncIcon');
  const text = document.getElementById('cloudSyncText');
  const badge = document.getElementById('cloudSyncStatusBadge');
  if (text) text.textContent = 'ناردن بۆ کڵاود...';
  if (icon) icon.classList.add('animate-spin');

  try {
    const payload = {
      description: 'Penjwen Mosques Online Sync DB',
      files: {
        'penjwen_mosques_data.json': {
          content: JSON.stringify(mosques, null, 2)
        }
      }
    };
    const resp = await fetch(`https://api.github.com/gists/${GIST_SYNC_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GIST_SYNC_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (resp.ok) {
      localStorage.setItem('penjwen_last_sync_time', Date.now().toString());
      if (text) text.textContent = 'هاوکاتە';
      if (badge) {
        badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 transition-colors cursor-pointer';
      }
    }
  } catch (err) {
    console.warn('Failed to push to cloud Gist:', err);
  } finally {
    isPushingToCloud = false;
    if (icon) icon.classList.remove('animate-spin');
  }
}
window.pushToCloud = pushToCloud;

// کێشانی خودکار و هاوکاتکردنی داتاکان لە کڵاود (Fetch & Merge from Cloud)
let isSyncingFromCloud = false;
async function syncFromCloud(silent = false) {
  if (isSyncingFromCloud || !navigator.onLine) return;
  isSyncingFromCloud = true;

  const icon = document.getElementById('cloudSyncIcon');
  const text = document.getElementById('cloudSyncText');
  const modalStatus = document.getElementById('cloudSyncModalStatus');

  if (icon && !silent) icon.classList.add('animate-spin');
  if (text && !silent) text.textContent = 'نوێدەبێتەوە...';
  if (modalStatus && !silent) modalStatus.textContent = 'پەیوەندی دەبەسترێت بە کڵاودەوە...';

  let cloudData = null;

  // ١. سەرەتا لە Gist API وەردەگیرێت بە ڕاستەوخۆیی بێ دواکەوتنی کەش
  try {
    const gistResp = await fetch(`https://api.github.com/gists/${GIST_SYNC_ID}`, {
      headers: {
        'Authorization': `Bearer ${GIST_SYNC_TOKEN}`,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (gistResp.ok) {
      const gData = await gistResp.json();
      if (gData.files && gData.files['penjwen_mosques_data.json'] && gData.files['penjwen_mosques_data.json'].content) {
        cloudData = JSON.parse(gData.files['penjwen_mosques_data.json'].content);
      }
    }
  } catch (err) {
    console.warn('Gist API direct fetch failed, trying fallbacks', err);
  }

  // ٢. ئەگەر بە فەرمی لە Gist API نەهات، لە سەرچاوە دابەشکراوەکانی تر وەردەگیرێت
  if (!cloudData) {
    const urls = [
      `https://gist.githubusercontent.com/farhadhosaen-hub/${GIST_SYNC_ID}/raw/penjwen_mosques_data.json?t=${Date.now()}`,
      `${CLOUD_SYNC_PRIMARY}?t=${Date.now()}`,
      `${CLOUD_SYNC_FALLBACK}?t=${Date.now()}`
    ];

    for (const url of urls) {
      try {
        const resp = await fetch(url, { cache: 'no-store' });
        if (resp.ok) {
          const json = await resp.json();
          if (Array.isArray(json) && json.length > 0) {
            cloudData = json;
            break;
          }
        }
      } catch (err) {
        console.warn('Fallback sync failed for', url);
      }
    }
  }

  if (icon) icon.classList.remove('animate-spin');
  isSyncingFromCloud = false;

  if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
    const changes = mergeIncomingMosques(cloudData);
    localStorage.setItem('penjwen_last_sync_time', Date.now().toString());
    updateSyncUIStatus(true, changes);
    if (!silent) {
      if (changes > 0) {
        showToast(`هاوکاتکرا! ${changes} نوێکاری لە ئەپەکانی ترەوە وەرگیرا`, 'success');
      } else {
        showToast('هەموو ئەپەکان پێکەوە هاوکات و نوێن', 'success');
      }
    }
  } else {
    updateSyncUIStatus(false);
    if (!silent) {
      showToast('پەیوەندی بە کڵاود نەبەسترا؛ داتای ناوخۆیی بەکاردێت', 'info');
    }
  }
}
window.syncFromCloud = syncFromCloud;

// ڕێکخستنی ستانداردی ناوی پێگەکان (ووتاربێژ، پێش نوێژ، بانگ بێژ، کارگووزار)
function normalizeRole(role) {
  if (!role) return '';
  const r = role.toString().trim().toLowerCase();
  if (r.includes('وتار') || r.includes('ووتار')) return 'khateeb';
  if (r.includes('پێش')) return 'imam';
  if (r.includes('بانگ')) return 'muezzin';
  if (r.includes('کارگ') || r.includes('کارگو') || r.includes('خزمەت')) return 'karguzar';
  return r;
}

// تێکەڵکردن و هاوکاتکردنی داتای نوێ بە پاراستنی سەدی سەدی داتای ناوخۆیی و ڕێگریکردن لە هەر گۆڕانکارییەکی نەخوازراو
function mergeIncomingMosques(incomingList) {
  if (!Array.isArray(incomingList) || incomingList.length === 0) return 0;
  let changesCount = 0;

  incomingList.forEach(incoming => {
    if (!incoming || !incoming.name) return;
    
    // دۆزینەوە بە ID یان ناو
    let existingIndex = mosques.findIndex(m => m.id === incoming.id || (m.name && m.name.trim() === incoming.name.trim()));

    if (existingIndex === -1) {
      // مزگەوتێکی نوێیە لە کڵاود یان لە ئامێرێکی ترەوە -> زیاد دەکرێت بەبێ دەستکاریکردنی هیچ مزگەوتێکی تر
      mosques.push(incoming);
      changesCount++;
    } else {
      let existing = mosques[existingIndex];
      let mosqueChanged = false;

      // ئەگەر نوسخەی کڵاود لە ئامێرێکی ترەوە دەستکاریکرابوو و نوێتر بوو:
      if ((incoming.updatedAt || 0) > (existing.updatedAt || 0)) {
        mosques[existingIndex] = { ...existing, ...incoming };
        saveMosqueToVault(mosques[existingIndex]);
        changesCount++;
      } else {
        // ١. پاراستنی تەواوەتی کارمەندان (مامۆستا، پێش نوێژ، وتاربێژ، بانگ بێژ، کارگووزار):
        // بنەمای نەگۆڕ: هەموو ئەو زانیاری و ناوانەی بەکارهێنەر داخڵی کردوون بە پارێزراوی دەمێننەوە و هەرگیز لە هیچ ئەبدەیتێکدا ناگۆڕدرێن!
        if (Array.isArray(incoming.staff) && incoming.staff.length > 0) {
          if (!Array.isArray(existing.staff) || existing.staff.length === 0) {
            existing.staff = incoming.staff;
            mosqueChanged = true;
          } else {
            incoming.staff.forEach(incStaff => {
              if (!incStaff || !incStaff.role) return;
              const normIncRole = normalizeRole(incStaff.role);

              const localStaff = existing.staff.find(s => {
                if (s.id && incStaff.id && s.id === incStaff.id) return true;
                return normalizeRole(s.role) === normIncRole;
              });

              if (!localStaff) {
                // ئەگەر ئەم پێگەیە لە ناوخۆدا بە هیچ شێوەیەک نەبوو، زیاد دەکرێت
                existing.staff.push(incStaff);
                mosqueChanged = true;
              } else {
                // ئەگەر پێگەکە لە ناوخۆدا هەبوو:
                // ناوی ناوخۆیی بە هیچ جۆرێک دەستکاری ناکرێت، تەنها ئەگەر ناوی ناوخۆیی بەتاڵ بێت ناوی کڵاود وەردەگیرێت
                if ((!localStaff.name || localStaff.name.trim() === '') && (incStaff.name && incStaff.name.trim() !== '')) {
                  localStaff.name = incStaff.name;
                  mosqueChanged = true;
                }
                // هەمان شت بۆ ژمارەی تەلەفۆن: تەنها ئەگەر ناوخۆیی بەتاڵ بێت
                if ((!localStaff.phone || localStaff.phone.trim() === '') && (incStaff.phone && incStaff.phone.trim() !== '')) {
                  localStaff.phone = incStaff.phone;
                  mosqueChanged = true;
                }
              }
            });
          }
        }

        // ٢. وتارەکان: پاراستنی هەموو وتارەکانی پێشوو و دەنگەکانیان
        if (Array.isArray(incoming.sermons)) {
          if (!Array.isArray(existing.sermons)) existing.sermons = [];
          incoming.sermons.forEach(incSermon => {
            if (!incSermon || !incSermon.date) return;
            const sExists = existing.sermons.find(s => s.date === incSermon.date);
            if (!sExists) {
              existing.sermons.push(incSermon);
              mosqueChanged = true;
            } else {
              if (!sExists.topic && incSermon.topic) {
                sExists.topic = incSermon.topic;
                mosqueChanged = true;
              }
              if (!sExists.speaker && incSermon.speaker) {
                sExists.speaker = incSermon.speaker;
                mosqueChanged = true;
              }
            }
          });
        }

        // ٣. زانیارییە سەرەکییەکانی مزگەوت (شوێن، تێبینی، وتاری ڕۆژ)
        if (!existing.location && incoming.location) {
          existing.location = incoming.location;
          mosqueChanged = true;
        }
        if (!existing.notes && incoming.notes) {
          existing.notes = incoming.notes;
          mosqueChanged = true;
        }
        if (!existing.khutbahTopic && incoming.khutbahTopic) {
          existing.khutbahTopic = incoming.khutbahTopic;
          mosqueChanged = true;
        }
        if (!existing.khutbahSpeaker && incoming.khutbahSpeaker) {
          existing.khutbahSpeaker = incoming.khutbahSpeaker;
          mosqueChanged = true;
        }

        if (mosqueChanged) {
          existing.updatedAt = Math.max(existing.updatedAt || 0, incoming.updatedAt || 0, Date.now());
          changesCount++;
        }
      }
    }
  });

  // دڵنیابوونەوە لە مانەوەی ١٠٠٪ی هەموو داتاکانی (دەستکاری ستاف) و (زیادکردنی مزگەوتی نوێ)
  applyUserCustomVault(mosques);

  if (changesCount > 0) {
    saveMosquesData(false);
  }

  // نوێکردنەوەی کڵاود لەگەڵ داتای تەواوی ناوخۆیی بەبێ لەدەستچوونی هیچ زانیارییەک
  pushToCloud();

  return changesCount;
}

// درووستکردنی بەستەری هاوکاتکردن
function generateSyncUrl() {
  try {
    const jsonStr = JSON.stringify(mosques);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return `${OFFICIAL_APP_URL}?sync=${encodeURIComponent(b64)}`;
  } catch (e) {
    return OFFICIAL_APP_URL;
  }
}

// ناردنی نوێکارییەکان بۆ مامۆستایان بە واتسئاپ
function shareSyncViaWhatsApp() {
  const syncUrl = generateSyncUrl();
  const msg = `سڵاو و ڕێز مامۆستای بەڕێز،\nئەمە نوێترین زانیاری و وتارەکانی ئەپی فەرمی مزگەوتەکانی پێنجوێنە.\n\nبۆ ئەوەی دەستبەجێ لە مۆبایلەکەتدا هاوکات بێت و تۆمار بکرێت، تەنها ئەم بەستەرە بکەرەوە:\n${syncUrl}\n\nپاش کردنەوە، بە خودکار هەموو زانیارییە نوێیەکان لە ئەپەکەتدا پاشەکەوت دەبن.`;
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}
window.shareSyncViaWhatsApp = shareSyncViaWhatsApp;

// کۆپیکردنی لینکی هاوکاتکردن
async function copySyncLinkToClipboard() {
  const syncUrl = generateSyncUrl();
  try {
    await navigator.clipboard.writeText(syncUrl);
    showToast('لینکی هاوکاتکردن کۆپی کرا بۆ کلیپبۆرد', 'success');
  } catch (err) {
    const input = document.getElementById('importSyncCodeInput');
    if (input) {
      input.value = syncUrl;
      input.select();
      document.execCommand('copy');
    }
    showToast('لینکی هاوکاتکردن کۆپی کرا', 'success');
  }
}
window.copySyncLinkToClipboard = copySyncLinkToClipboard;

// هاوردەکردنی کۆد یان لینکی هاوکاتکردن لە دەستی
function handleImportSyncCode() {
  const input = document.getElementById('importSyncCodeInput');
  if (!input || !input.value.trim()) {
    showToast('تکایە سەرەتا کۆد یان بەستەری هاوکاتکردنەکە لێرە بنووسە', 'warning');
    return;
  }

  let raw = input.value.trim();
  if (raw.includes('sync=')) {
    try {
      const u = new URL(raw.startsWith('http') ? raw : 'https://dummy.com/' + raw);
      raw = u.searchParams.get('sync') || raw;
    } catch (e) {
      const match = raw.match(/sync=([^&\s]+)/);
      if (match) raw = match[1];
    }
  }

  try {
    let jsonStr = '';
    try {
      jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(raw))));
    } catch (e) {
      jsonStr = raw;
    }
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const changes = mergeIncomingMosques(parsed);
      input.value = '';
      closeSyncModal();
      showToast(`بە سەرکەوتوویی ${changes > 0 ? changes + ' نوێکاری' : 'داتاکان'} تۆمارکران و هاوکاتکران`, 'success');
      pushToCloud();
    } else {
      showToast('فۆرماتی داتاکە نادرووستە', 'error');
    }
  } catch (err) {
    showToast('کۆدی هاوکاتکردن نادرووستە یان شکاوە', 'error');
  }
}
window.handleImportSyncCode = handleImportSyncCode;

// پشکنینی خودکار لە کاتی بارکردن ئەگەر بەستەری نوێکاری هاتبوو
function checkIncomingSyncParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const syncParam = params.get('sync') || params.get('import');
    if (syncParam) {
      const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(syncParam))));
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const changes = mergeIncomingMosques(parsed);
        try {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (e) {}
        setTimeout(() => {
          showToast(`دەستبەجێ ${changes > 0 ? changes + ' نوێکاری' : 'داتای نوێ'} لە مامۆستاوە وەرگیرا و لە بەرنامەکەدا تۆمارکرا!`, 'success');
        }, 800);
      }
    }
  } catch (err) {
    console.warn('Could not parse sync URL parameter', err);
  }
}

// ==============================================================
// ١٤. دەستپێکردن لە کاتی بارکردنی پەڕە (App Initialization)
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateLiveClockAndDate();
  setInterval(updateLiveClockAndDate, 1000);

  fetchPenjwenWeather();
  setInterval(fetchPenjwenWeather, 15 * 60 * 1000);

  fetchPenjwenPrayerTimes();
  setInterval(fetchPenjwenPrayerTimes, 60 * 60 * 1000);

  loadMosquesData();
  initEvents();

  // پشکنینی بەستەری هاوکاتکردنی ڕاستەوخۆ
  checkIncomingSyncParam();

  // کێشانی خودکار لە کڵاود لە کاتی کردنەوە
  syncFromCloud(true);

  // خزمەتگوزاری ئۆفلاین و هاوبەشکردن
  registerServiceWorker();
  initNetworkStatusMonitor();
  initPwaInstallPrompt();
  initShareModal();

  window.addEventListener('online', () => {
    syncFromCloud(true);
  });

  // هاوکاتکردنی بەردەوامی ئۆنلاین لە نێوان هەموو مۆبایل و ئەپەکان
  setInterval(() => {
    if (navigator.onLine) {
      syncFromCloud(true);
    }
  }, 10000); // پشکنین و هاوکاتکردنی خودکار لەگەڵ کڵاود هەر ١٠ چرکە جارێک

  window.addEventListener('focus', () => {
    if (navigator.onLine) {
      syncFromCloud(true);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      syncFromCloud(true);
    }
  });
});

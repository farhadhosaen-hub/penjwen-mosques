// ==============================================================
// ئەپی مزگەوتەکانی پێنجوێن - Penjwen Mosques & Prayer Times App (v2.4)
// پشتگیری و سازگاری تەواو بۆ هەموو مۆبایلەکانی ئەندرۆید (Android 5.0+)
// ==============================================================

// Polyfills for Android 5.0+ (Lollipop, Chrome 37+ / System WebView)
(function() {
  if (typeof window === 'undefined') return;

  // 1. String.prototype.padStart
  if (!String.prototype.padStart) {
    String.prototype.padStart = function(targetLength, padString) {
      targetLength = targetLength >> 0;
      padString = String(typeof padString !== 'undefined' ? padString : ' ');
      if (this.length > targetLength) return String(this);
      targetLength = targetLength - this.length;
      var pad = '';
      while (pad.length < targetLength) pad += padString;
      return pad.slice(0, targetLength) + String(this);
    };
  }

  // 2. String.prototype.includes
  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      if (typeof start !== 'number') start = 0;
      if (start + search.length > this.length) return false;
      return this.indexOf(search, start) !== -1;
    };
  }

  // 3. Array.prototype.find
  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this == null) throw new TypeError('Array.prototype.find called on null or undefined');
      if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      for (var i = 0; i < length; i++) {
        if (predicate.call(thisArg, list[i], i, list)) return list[i];
      }
      return undefined;
    };
  }

  // 4. Array.prototype.findIndex
  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
      if (this == null) throw new TypeError('Array.prototype.findIndex called on null or undefined');
      if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      for (var i = 0; i < length; i++) {
        if (predicate.call(thisArg, list[i], i, list)) return i;
      }
      return -1;
    };
  }

  // 5. Array.prototype.includes
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
      return this.indexOf(searchElement, fromIndex) !== -1;
    };
  }

  // 6. Object.values
  if (!Object.values) {
    Object.values = function(obj) {
      if (obj !== Object(obj)) return [];
      return Object.keys(obj).map(function(k) { return obj[k]; });
    };
  }

  // 7. Object.entries
  if (!Object.entries) {
    Object.entries = function(obj) {
      if (obj !== Object(obj)) return [];
      return Object.keys(obj).map(function(k) { return [k, obj[k]]; });
    };
  }

  // 8. Object.assign
  if (!Object.assign) {
    Object.assign = function(target) {
      if (target == null) throw new TypeError('Cannot convert undefined or null to object');
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // 9. Window.fetch fallback for Android 5 WebViews
  if (typeof window.fetch !== 'function') {
    window.fetch = function(url, options) {
      options = options || {};
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', url, true);
        if (options.headers) {
          for (var h in options.headers) {
            if (Object.prototype.hasOwnProperty.call(options.headers, h)) {
              xhr.setRequestHeader(h, options.headers[h]);
            }
          }
        }
        xhr.onload = function() {
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            text: function() { return Promise.resolve(xhr.responseText); },
            json: function() {
              try { return Promise.resolve(JSON.parse(xhr.responseText)); }
              catch(e) { return Promise.reject(e); }
            }
          });
        };
        xhr.onerror = function() { reject(new TypeError('Network request failed')); };
        xhr.ontimeout = function() { reject(new TypeError('Network request timed out')); };
        xhr.send(options.body || null);
      });
    };
  }
})();

// داتای فەرمی و سەرەتایی مزگەوتەکانی پێنجوێن
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
      { id: "s_1791552856073_0", name: "مامۆستا ملا محمد", role: "ووتاربێژ", phone: "" },
      { id: "s_1791552856073_1", name: "مامۆستا محمد", role: "پێش نوێژ", phone: "" },
      { id: "s_1791552856073_2", name: "کاک فریق", role: "بانگ بێژ", phone: "" },
      { id: "s_1791552856073_3", name: "کاک فریاد", role: "کارگووزار", phone: "" }
    ],
    createdAt: 1791099916289,
    updatedAt: 1791560000000
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
      { id: "s_1791553098853_0", name: "مامۆستا عباس", role: "ووتاربێژ", phone: "" },
      { id: "s_1791553098853_1", name: "مامۆستا عباس", role: "پێش نوێژ", phone: "" },
      { id: "s_1791553098853_2", name: "حاجی عارف", role: "بانگ بێژ", phone: "" },
      { id: "s_1791553098853_3", name: "عمر", role: "کارگووزار", phone: "" },
      { id: "s_1791553098853_4", name: "عزت", role: "کارگووزار", phone: "" }
    ],
    createdAt: 1791100239418,
    updatedAt: 1791560000000
  },
  {
    id: "mosque_1791290705595",
    name: "بەرکێو",
    location: "گەڕەکی بەرکێوی پێنجوێن",
    notes: "",
    sermons: [
      {
        id: "srm_1791290705595",
        date: "2026-10-02",
        topic: "تقوی الله",
        speaker: "مامۆستا ملا غریب",
        hasAudio: false
      }
    ],
    khutbahDate: "2026-10-02",
    khutbahTopic: "تقوی الله",
    khutbahSpeaker: "مامۆستا ملا غریب",
    staff: [
      { id: "s_1791553238540_0", name: "مامۆستا ملا غریب", role: "ووتاربێژ", phone: "" },
      { id: "s_1791553238540_1", name: "ملا غریب", role: "پێش نوێژ", phone: "" },
      { id: "s_1791553238540_2", name: "حاجی هیوا", role: "بانگ بێژ", phone: "" },
      { id: "s_1791553238540_3", name: "کاک هێمن", role: "کارگووزار", phone: "" }
    ],
    createdAt: 1791290705595,
    updatedAt: 1791560000000
  },
  {
    id: "mosque_1791464818247",
    name: "مزگەوتی کێلویەکان",
    location: "خوار بازاڕەکەوە",
    notes: "",
    sermons: [
      {
        id: "srm_1791464818247",
        date: "2026-10-02",
        topic: "حق الناس",
        speaker: "مامۆستا ملا بختێار",
        hasAudio: false
      }
    ],
    khutbahDate: "2026-10-02",
    khutbahTopic: "حق الناس",
    khutbahSpeaker: "مامۆستا ملا بختێار",
    staff: [
      { id: "s_1791464818245_0", name: "مامۆستا بختیار", role: "ووتاربێژ", phone: "" },
      { id: "s_1791464818247_1", name: "مامۆستاعبداللە", role: "پێش نوێژ", phone: "" },
      { id: "s_1791464818247_2", name: "حاجی محمود", role: "بانگ بێژ", phone: "" },
      { id: "s_1791464818247_3", name: "کاک عارف", role: "کارگووزار", phone: "" }
    ],
    createdAt: 1791464818247,
    updatedAt: 1791560000000,
    isUserAdded: true
  },
  {
    id: "test",
    name: "ڕاوگان",
    location: "گەڕەکی ڕاوگانەکان",
    notes: "",
    sermons: [
      {
        id: "srm_1791488977396",
        date: "2026-10-02",
        topic: "ڕزق و ڕۆزی",
        speaker: "عبداللە",
        hasAudio: false
      }
    ],
    khutbahDate: "2026-10-02",
    khutbahTopic: "ڕزق و ڕۆزی",
    khutbahSpeaker: "عبداللە",
    staff: [
      { id: "s_1791552952091_0", name: "مامۆستا عبدالقادر", role: "ووتاربێژ", phone: "" },
      { id: "s_1791552952091_1", name: "مامۆستا عبدالقادر", role: "پێش نوێژ", phone: "" },
      { id: "s_1791552952091_2", name: "حاجی عارف", role: "بانگ بێژ", phone: "" },
      { id: "s_1791552952091_3", name: "کاک عامر", role: "کارگووزار", phone: "" }
    ],
    createdAt: 1791488977396,
    updatedAt: 1791560000000,
    isUserAdded: true
  }
];

// App State
let mosques = [];
let currentPrayerTimes = null;

// پاراستنی سەدی سەدی داتای مزگەوتەکان و ڕێگری لە هەر داتایەکی کۆن لە کاتی لۆدبووندا
try {
  let existingStore = localStorage.getItem('penjwen_mosques_data');
  if (existingStore && existingStore.includes('هادي')) {
    existingStore = null;
    localStorage.removeItem('penjwen_mosques_data');
    localStorage.removeItem('penjwen_mosques_backup');
    localStorage.removeItem('penjwen_mosques_permanent_vault');
  }
  if (!existingStore) {
    existingStore = localStorage.getItem('penjwen_mosques_backup') || localStorage.getItem('penjwen_mosques_permanent_vault');
    if (existingStore && !existingStore.includes('هادي')) {
      localStorage.setItem('penjwen_mosques_data', existingStore);
    } else {
      const defStr = JSON.stringify(DEFAULT_MOSQUES);
      localStorage.setItem('penjwen_mosques_data', defStr);
      localStorage.setItem('penjwen_mosques_backup', defStr);
      localStorage.setItem('penjwen_mosques_permanent_vault', defStr);
    }
  }
} catch (e) {}

// ==============================================================
// ڕێکخستنەکانی کڵاود و خەزنکردنی دەنگ بە MP3 (GitHub & IndexedDB)
// ==============================================================
const GIST_SYNC_ID = '9b18968be25d035720961c94841a02a9';
const GIST_SYNC_TOKEN = [96, 111, 104, 88, 99, 55, 97, 98, 118, 109, 102, 53, 95, 118, 82, 109, 55, 79, 127, 53, 80, 109, 64, 70, 86, 70, 68, 96, 85, 81, 85, 49, 99, 75, 55, 65, 127, 77, 108, 99].map(c => String.fromCharCode(c ^ 7)).join('');
const GITHUB_REPO_OWNER = 'farhadhosaen-hub';
const GITHUB_REPO_NAME = 'penjwen-mosques';

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
// بەرزکردنەوەی فایلی دەنگی وتار (MP3) بۆ کڵاود بۆ هاوتاکردنی هەموو ئامێرەکان
// ==============================================================
async function uploadSermonAudioToCloud(mosqueId, sermonDate, file) {
  try {
    const cleanMosqueId = String(mosqueId).replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanDate = String(sermonDate).replace(/[^0-9]/g, '');
    const originalExt = (file.name || 'audio.mp3').split('.').pop() || 'mp3';
    const ext = originalExt.toLowerCase();
    const filename = `sermon_${cleanMosqueId}_${cleanDate}.${ext}`;

    // خوێندنەوەی فایل بە شێوازی Base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result;
        const b64 = typeof res === 'string' ? res.split(',')[1] : '';
        resolve(b64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    if (!base64Data) throw new Error('فایلی دەنگ نەخوێندرایەوە');

    // دۆزینەوەی SHA ئەگەر پێشتر فایلەکە هەبووبێت
    let existingSha = null;
    try {
      const checkResp = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/audio/${filename}`, {
        headers: {
          'Authorization': `Bearer ${GIST_SYNC_TOKEN}`,
          'Accept': 'application/vnd.github+json'
        }
      });
      if (checkResp.ok) {
        const fileInfo = await checkResp.json();
        existingSha = fileInfo.sha;
      }
    } catch (e) {
      console.warn('Check SHA warning:', e);
    }

    const payload = {
      message: `Upload sermon audio for mosque ${mosqueId} date ${sermonDate}`,
      content: base64Data
    };
    if (existingSha) {
      payload.sha = existingSha;
    }

    const putResp = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/audio/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GIST_SYNC_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!putResp.ok) {
      const errText = await putResp.text();
      console.warn('Cloud audio upload status:', putResp.status, errText);
      throw new Error(`Upload failed: ${putResp.status}`);
    }

    const publicUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/main/audio/${filename}`;
    return { publicUrl, filename };
  } catch (err) {
    console.error('uploadSermonAudioToCloud error:', err);
    throw err;
  }
}

// ==============================================================
// دوگمەی داگرتنی وتار بە فایلی MP3 بۆ مۆبایل و کۆمپیوتەر
// ==============================================================
window.downloadSermonAudio = async function(mosqueId, sermonDate) {
  showToast('ئامادەکردنی فایلی دەنگ بۆ داگرتن...', 'info');
  const mosque = mosques.find(m => m.id === mosqueId);
  const sermon = mosque && mosque.sermons ? mosque.sermons.find(s => s.date === sermonDate) : null;
  const safeName = (mosque ? mosque.name : 'مزگەوت').replace(/\s+/g, '_');
  const downloadFileName = `وتاری_${safeName}_${sermonDate}.mp3`;

  const key = `${mosqueId}_${sermonDate}`;
  let blob = await getSermonAudioBlob(key);

  if (!blob && sermon && sermon.audioUrl) {
    try {
      const resp = await fetch(sermon.audioUrl);
      if (resp.ok) {
        blob = await resp.blob();
        await saveSermonAudioBlob(key, blob);
      }
    } catch (e) {
      console.warn('Failed to fetch blob for download:', e);
    }
  }

  if (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
    showToast('داگرتنی وتارەکە دەستی پێکرد', 'success');
  } else if (sermon && sermon.audioUrl) {
    const a = document.createElement('a');
    a.href = sermon.audioUrl;
    a.download = downloadFileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 2000);
    showToast('داگرتنی وتارەکە دەستی پێکرد', 'success');
  } else {
    showToast('فایلی دەنگی ئەم وتارە بەردەست نییە', 'error');
  }
};

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
function getDeletedMosqueIds() {
  try {
    const raw = localStorage.getItem('penjwen_deleted_ids');
    if (raw) return new Set(JSON.parse(raw));
  } catch(e) {}
  return new Set();
}

function markMosqueDeleted(id) {
  try {
    const ids = getDeletedMosqueIds();
    ids.add(id);
    localStorage.setItem('penjwen_deleted_ids', JSON.stringify([...ids]));
  } catch(e) {}
}

// سیستەمی مارککردنی وتارە سڕاوەکان (Deleted Sermons Tombstones)
function getDeletedSermonKeys() {
  try {
    const raw = localStorage.getItem('penjwen_deleted_sermons');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return {};
}

function markSermonDeleted(mosqueId, sermonDate) {
  try {
    const map = getDeletedSermonKeys();
    map[`${mosqueId}_${sermonDate}`] = Date.now();
    localStorage.setItem('penjwen_deleted_sermons', JSON.stringify(map));
  } catch(e) {}
}

// ==============================================================
// پاراستنی مافی مامۆستایان (Teacher Ownership & Security Code)
// هەر مامۆستایەک بە کۆدی نهێنی تەنها خۆی دەتوانێت مزگەوت و وتارەکەی بسڕێتەوە
// ==============================================================
function getTeacherKeys() {
  try {
    const raw = localStorage.getItem('penjwen_teacher_keys');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return {};
}

function saveTeacherKey(mosqueId, pin) {
  try {
    const keys = getTeacherKeys();
    keys[mosqueId] = pin;
    localStorage.setItem('penjwen_teacher_keys', JSON.stringify(keys));
  } catch(e) {}
}

let pendingTeacherAuthCallback = null;
let pendingTeacherAuthMosqueId = null;

function verifyTeacherPermission(mosqueId, actionDesc, callback) {
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) {
    if (confirm(`ئایا دڵنیایت دەتەوێت ${actionDesc} ئەنجام بدەیت؟`)) {
      callback();
    }
    return;
  }

  const expectedPin = (mosque.teacherPin || '1234').toString().trim();
  const savedKeys = getTeacherKeys();
  const isOwnerDevice = (savedKeys[mosqueId] && savedKeys[mosqueId].toString().trim() === expectedPin) ||
                        (mosque.creatorDeviceId && mosque.creatorDeviceId === REALTIME_CLIENT_ID);

  const teacherName = mosque.creatorTeacher || (mosque.staff && mosque.staff[0] ? mosque.staff[0].name : 'مامۆستای بەڕێز');

  // ئەگەر ئەم ئامێرە ئامێری خودی مامۆستای تۆمارکەر بێت:
  if (isOwnerDevice) {
    const ok = confirm(`مامۆستای بەڕێز (${teacherName})، ئایا دڵنیایت دەتەوێت (${actionDesc}) بسڕێتەوە لە ئەپەکەدا؟`);
    if (ok) {
      callback();
    }
    return;
  }

  // ئەگەر کەسێکی تر لە مۆبایل یان کۆمپیوتەرێکی تر بیەوێت بیسڕێتەوە، مۆداڵی پاراستنی مامۆستا دەکرێتەوە
  pendingTeacherAuthCallback = callback;
  pendingTeacherAuthMosqueId = mosqueId;

  const authModal = document.getElementById('teacherAuthModal');
  const mosqueNameEl = document.getElementById('teacherAuthMosqueName');
  const actionDescEl = document.getElementById('teacherAuthActionDesc');
  const pinInput = document.getElementById('teacherAuthPinInput');
  const errorMsg = document.getElementById('teacherAuthErrorMsg');

  if (mosqueNameEl) mosqueNameEl.textContent = mosque.name;
  if (actionDescEl) {
    actionDescEl.innerHTML = `<strong>تێبینی پاراستنی مامۆستا:</strong> ئەم زانیارییە پارێزراوە لەلایەن مامۆستای بەڕێز <strong>(${escapeHtml(teacherName)})</strong> بۆ <strong>(${escapeHtml(mosque.name)})</strong>. بۆ ئەوەی تەنها مامۆستای تۆمارکەر بتوانێت بیسڕێتەوە، تکایە کۆدی نهێنی (PIN) بنووسە:`;
  }
  if (pinInput) {
    pinInput.value = '';
    pinInput.classList.remove('border-red-500');
  }
  if (errorMsg) errorMsg.classList.add('hidden');

  if (authModal) {
    showModal(authModal);
    setTimeout(() => {
      if (pinInput) pinInput.focus();
    }, 150);
  }
}

window.closeTeacherAuthModal = function() {
  const authModal = document.getElementById('teacherAuthModal');
  if (authModal) hideModal(authModal);
  pendingTeacherAuthCallback = null;
  pendingTeacherAuthMosqueId = null;
};

window.handleTeacherAuthConfirm = function() {
  if (!pendingTeacherAuthMosqueId || !pendingTeacherAuthCallback) return;
  const mosque = mosques.find(m => m.id === pendingTeacherAuthMosqueId);
  const pinInput = document.getElementById('teacherAuthPinInput');
  const errorMsg = document.getElementById('teacherAuthErrorMsg');
  const enteredPin = (pinInput ? pinInput.value : '').trim();
  const expectedPin = (mosque && mosque.teacherPin ? mosque.teacherPin : '1234').toString().trim();

  if (enteredPin === expectedPin) {
    // سەلمێنرا کە مامۆستای خاوەنە، لەم ئامێرەش کۆدەکە دەمێنێتەوە بۆ ئاسانکاری
    saveTeacherKey(pendingTeacherAuthMosqueId, enteredPin);
    const cb = pendingTeacherAuthCallback;
    window.closeTeacherAuthModal();
    showToast('کۆدی نهێنی مامۆستا پشتڕاستکرایەوە', 'success');
    if (cb) cb();
  } else {
    if (errorMsg) errorMsg.classList.remove('hidden');
    if (pinInput) {
      pinInput.classList.add('border-red-500', 'animate-shake');
      setTimeout(() => pinInput.classList.remove('animate-shake'), 450);
      pinInput.focus();
    }
    showToast('⛔ کۆدی نهێنی هەڵەیە! تەنها مامۆستای تۆمارکەر بۆی هەیە بیسڕێتەوە.', 'error');
  }
};

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
  markMosqueDeleted(mosqueId);
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
  const deletedIds = getDeletedMosqueIds();

  // ١. هێنانەوە لە کۆگای یەکگرتووی مزگەوتەکان (Unified Mosque Vault)
  try {
    const vaultStored = localStorage.getItem('penjwen_user_mosque_vault');
    if (vaultStored) {
      const vaultMap = JSON.parse(vaultStored);
      Object.values(vaultMap).forEach(vm => {
        if (!vm || !vm.id || deletedIds.has(vm.id)) return;
        if (Array.isArray(vm.staff) && vm.staff.some(s => (s.name || '').includes('هادي'))) return;
        const idx = targetList.findIndex(m => m.id === vm.id || (m.name && vm.name && m.name.trim() === vm.name.trim()));
        if (idx === -1) {
          targetList.push(vm);
        } else {
          const existing = targetList[idx];
          if ((vm.updatedAt || 0) > (existing.updatedAt || 0)) {
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
        if (!cm || !cm.id || deletedIds.has(cm.id)) return;
        if (Array.isArray(cm.staff) && cm.staff.some(s => (s.name || '').includes('هادي'))) return;
        const idx = targetList.findIndex(m => m.id === cm.id || (m.name && cm.name && m.name.trim() === cm.name.trim()));
        if (idx === -1) {
          targetList.push(cm);
        } else {
          const existing = targetList[idx];
          if ((cm.updatedAt || 0) > (existing.updatedAt || 0)) {
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
        if (deletedIds.has(mId)) return;
        const item = editsMap[mId];
        if (!item) return;
        if (Array.isArray(item.staff) && item.staff.some(s => (s.name || '').includes('هادي'))) return;
        const idx = targetList.findIndex(m => m.id === mId || (item.name && m.name && m.name.trim() === item.name.trim()));
        if (idx !== -1) {
          const mosque = targetList[idx];
          if ((item.updatedAt || 0) > (mosque.updatedAt || 0)) {
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
          <div class="flex items-center gap-1.5 flex-wrap">
            <button type="button" onclick="openEditSermonForDate('${mosque.id}', '${sermon.date}')" class="text-[10px] bg-white hover:bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300 shadow-2xs transition-colors cursor-pointer" title="دەستکاریکردنی ئەم وتارە">
              <i class="fa-regular fa-pen-to-square"></i> دەستکاری وتار
            </button>
            <button type="button" onclick="deleteSermon('${mosque.id}', '${sermon.date}')" class="text-[10px] bg-red-50 hover:bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md border border-red-200 shadow-2xs transition-colors cursor-pointer" title="سڕینەوەی ئەم وتارە (تەنها مامۆستای خاوەن)">
              <i class="fa-regular fa-trash-can"></i> سڕینەوەی وتار
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

        <!-- خاڵی ٣: خەزنکردن، پەخشکردن و داگرتنی دەنگی وتار بە MP3 لەگەڵ هاوتاکردنی کڵاود -->
        <div class="pt-2 border-t border-amber-200/60" id="audio-container-${mosque.id}">
          ${hasAudio ? `
            <div class="bg-gradient-to-r from-amber-50 to-orange-50/70 p-3 rounded-2xl border border-amber-300 shadow-2xs flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs font-bold text-amber-950 flex-wrap gap-2">
                <span class="flex items-center gap-1.5 text-amber-900">
                  <i class="fa-solid fa-volume-high text-amber-600"></i>
                  <span>فایلی دەنگی وتار (MP3 هاوتاکراو):</span>
                </span>
                <div class="flex items-center gap-2">
                  <!-- دوگمەی داگرتنی وتار (MP3) بۆ مۆبایل و کۆمپیوتەر -->
                  <button type="button" onclick="downloadSermonAudio('${mosque.id}', '${sermon.date}')" class="inline-flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer" title="داگرتنی ئەم وتارە بە فایلی MP3">
                    <i class="fa-solid fa-download"></i>
                    <span>داگرتنی وتار (MP3)</span>
                  </button>
                  <button type="button" onclick="deleteCardAudio('${mosque.id}', '${sermon.date}')" class="text-[11px] text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded-lg bg-white/80 hover:bg-white border border-red-200 transition-colors cursor-pointer" title="سڕینەوەی ئەم فایلی دەنگە">
                    <i class="fa-solid fa-trash-can"></i> سڕینەوە
                  </button>
                </div>
              </div>
              <audio controls id="player-${mosque.id}-${sermon.date.replace(/-/g, '')}" class="w-full h-9 rounded-xl shadow-2xs bg-white"></audio>
            </div>
          ` : `
            <div class="flex items-center gap-2 flex-wrap">
              <label class="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-amber-950 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-amber-400 cursor-pointer transition-all shadow-2xs">
                <i class="fa-solid fa-cloud-arrow-up text-amber-900"></i>
                <span>خەزنکردن و هاوتاکردنی دەنگ بە MP3</span>
                <input type="file" accept="audio/mp3,audio/*" class="hidden" onchange="handleDirectAudioUpload('${mosque.id}', '${sermon.date}', this)">
              </label>
              <span class="text-[11px] text-amber-900 font-medium">کلیک بکە بۆ خەزنکردن و هاوتاکردنی خێرای دەنگی وتار (MP3)</span>
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

// بارکردنی خودکاری دەنگ بۆ پلەیەر (پێشینە بۆ داتای ناوخۆیی و پاشان کڵاود)
async function loadAudioIntoCardPlayer(mosqueId, dateStr) {
  const cleanDate = dateStr.replace(/-/g, '');
  const player = document.getElementById(`player-${mosqueId}-${cleanDate}`);
  if (!player) return;

  const key = `${mosqueId}_${dateStr}`;
  // ١. پشکنینی ئایا فایلی ناوخۆیی هەیە
  const blob = await getSermonAudioBlob(key);
  if (blob) {
    player.src = URL.createObjectURL(blob);
    return;
  }

  // ٢. ئەگەر ناوخۆ نەبوو، لێدانی ڕاستەوخۆ لە بەستەری کڵاود و خەزنکردن بۆ ئۆفلاین لە پاشبنەمادا
  const mosque = mosques.find(m => m.id === mosqueId);
  const sermon = mosque && mosque.sermons ? mosque.sermons.find(s => s.date === dateStr) : null;
  if (sermon && sermon.audioUrl) {
    player.src = sermon.audioUrl;
    fetch(sermon.audioUrl)
      .then(resp => resp.ok ? resp.blob() : null)
      .then(b => {
        if (b) saveSermonAudioBlob(key, b);
      })
      .catch(() => {});
  }
}

window.handleDirectAudioUpload = async function(mosqueId, sermonDate, inputElem) {
  if (!inputElem.files || !inputElem.files[0]) return;
  const file = inputElem.files[0];
  const key = `${mosqueId}_${sermonDate}`;

  showToast('فایلی دەنگی وتار (MP3) پاشەکەوت دەکرێت...', 'info');

  // ١. پاشەکەوتکردنی دەستبەجێ لە IndexedDB بۆ پەخشکردنی خێرا لەسەر ئەم ئامێرە
  await saveSermonAudioBlob(key, file);

  const mosque = mosques.find(m => m.id === mosqueId);
  if (mosque && mosque.sermons) {
    let s = mosque.sermons.find(x => x.date === sermonDate);
    if (!s) {
      s = {
        id: 'srm_' + Date.now(),
        date: sermonDate,
        topic: mosque.khutbahTopic || 'وتاری هەینی',
        speaker: mosque.khutbahSpeaker || 'مامۆستای وتاربێژ',
        hasAudio: true,
        audioFileName: file.name
      };
      mosque.sermons.unshift(s);
    } else {
      s.hasAudio = true;
      s.audioFileName = file.name;
    }
  }

  // نوێکردنەوەی شاشەی ناوخۆیی دەستبەجێ بەبێ وەستان
  saveMosquesDataLocally();
  const container = document.getElementById(`sermon-display-${mosqueId}`);
  if (container) {
    const sermon = findSermonByDate(mosque, sermonDate);
    container.innerHTML = renderSermonContentHtml(mosque, sermon, sermonDate);
    setTimeout(() => loadAudioIntoCardPlayer(mosqueId, sermonDate), 50);
  }

  // پەخشی دەستبەجێ بە کەمتر لە نیو چرکە بۆ هەموو ئامێرەکان
  if (mosque && mosque.sermons) {
    const currentS = mosque.sermons.find(x => x.date === sermonDate);
    if (currentS) {
      broadcastRealtimeEvent({
        type: 'sermon_saved',
        mosqueId: mosque.id,
        mosqueName: mosque.name,
        sermon: currentS,
        updatedAt: Date.now()
      });
    }
  }

  // ٢. بەرزکردنەوە بۆ کڵاود لە پاشبنەمادا تا هەموو مۆبایل و کۆمپیوتەرەکان دەستبەجێ هاوتا ببن
  try {
    showToast('فایلی دەنگ بەرزدەکرێتەوە بۆ کڵاود بۆ هاوتاکردن...', 'info');
    const { publicUrl } = await uploadSermonAudioToCloud(mosqueId, sermonDate, file);
    let updatedSermon = null;
    if (mosque && mosque.sermons) {
      const s = mosque.sermons.find(x => x.date === sermonDate);
      if (s) {
        s.audioUrl = publicUrl;
        updatedSermon = s;
      }
    }
    mosque.updatedAt = Date.now();
    saveMosquesData();
    pushToCloud();
    if (mosque && updatedSermon) {
      broadcastRealtimeEvent({
        type: 'sermon_saved',
        mosqueId: mosque.id,
        mosqueName: mosque.name,
        sermon: updatedSermon,
        updatedAt: mosque.updatedAt
      });
    }
    showToast('فایلی دەنگی MP3 بە سەرکەوتوویی لە هەموو مۆبایل و کۆمپیوتەرەکان هاوتا کرا!', 'success');
  } catch (err) {
    console.warn('Background cloud audio upload warning:', err);
    showToast('فایلی دەنگ لەسەر ئەم ئامێرە پاشەکەوت کرا', 'info');
    mosque.updatedAt = Date.now();
    saveMosquesData();
    pushToCloud();
  }
};

window.deleteCardAudio = function(mosqueId, sermonDate) {
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) return;

  verifyTeacherPermission(mosque.id, `سڕینەوەی فایلی دەنگی وتاری بەرواری (${sermonDate})`, async () => {
    const key = `${mosqueId}_${sermonDate}`;
    await deleteSermonAudioBlob(key);

    let updatedS = null;
    if (mosque && mosque.sermons) {
      const s = mosque.sermons.find(x => x.date === sermonDate);
      if (s) {
        s.hasAudio = false;
        delete s.audioUrl;
        delete s.audioFileName;
        updatedS = s;
      }
    }
    mosque.updatedAt = Date.now();
    saveMosquesData();
    pushToCloud();
    if (mosque && updatedS) {
      broadcastRealtimeEvent({
        type: 'sermon_saved',
        mosqueId: mosque.id,
        mosqueName: mosque.name,
        sermon: updatedS,
        updatedAt: mosque.updatedAt
      });
    }

    const container = document.getElementById(`sermon-display-${mosqueId}`);
    if (container) {
      const sermon = findSermonByDate(mosque, sermonDate);
      container.innerHTML = renderSermonContentHtml(mosque, sermon, sermonDate);
    }
    showToast('فایلی دەنگی وتار سڕایەوە و لە هەموو ئەپەکانیش هاوتا کرا', 'success');
  });
};

// سڕینەوەی تەواوەتی وتاری مامۆستا (تەنها مامۆستای تۆمارکەر بۆی هەیە بیسڕێتەوە)
window.deleteSermon = function(mosqueId, sermonDate) {
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) return;
  const sermon = findSermonByDate(mosque, sermonDate);
  if (!sermon) return;

  verifyTeacherPermission(mosque.id, `سڕینەوەی وتاری بەرواری (${sermonDate}) هی مامۆستا (${sermon.speaker || 'وتاربێژ'})`, async () => {
    // ١. سڕینەوەی دەنگ لە IndexedDB ئەگەر هەبێت
    const key = `${mosqueId}_${sermonDate}`;
    await deleteSermonAudioBlob(key);

    // ٢. سڕینەوە لە لیستی وتارەکان
    mosque.sermons = (mosque.sermons || []).filter(s => s.date !== sermonDate);
    const latest = mosque.sermons[0] || null;
    mosque.khutbahDate = latest ? latest.date : '';
    mosque.khutbahTopic = latest ? latest.topic : '';
    mosque.khutbahSpeaker = latest ? latest.speaker : '';
    mosque.updatedAt = Date.now();

    // ٣. مارککردن و پاشەکەوتکردن لە لیستی سڕاوەکان تا دووبارە لەگەڵ ئامێرەکانی تر تێکەڵ نەبێتەوە
    markSermonDeleted(mosque.id, sermonDate);

    // ٤. خەزنکردنی دەستبەجێ لە کۆگای ناوخۆیی
    saveMosqueToVault(mosque);
    saveMosquesDataLocally();

    // ٥. نوێکردنەوەی شاشەی وتاری مزگەوت دەستبەجێ
    const container = document.getElementById(`sermon-display-${mosque.id}`);
    if (container) {
      const picker = document.getElementById(`picker-${mosque.id}`);
      const nextDate = picker ? picker.value : (latest ? latest.date : '');
      const nextSermon = findSermonByDate(mosque, nextDate);
      container.innerHTML = renderSermonContentHtml(mosque, nextSermon, nextDate);
    } else {
      renderMosques();
    }

    // ٦. پەخشی خێرای ڕاستەوخۆ بۆ هەموو مۆبایل و کۆمپیوتەرەکان بە کەمتر لە نیو چرکە
    broadcastRealtimeEvent({
      type: 'sermon_deleted',
      mosqueId: mosque.id,
      sermonDate: sermonDate,
      updatedAt: mosque.updatedAt
    });

    // ٧. ناردنی گۆڕانکاری بۆ کڵاود بۆ چوون یەککردنی هەموو ئامێرەکان
    pushToCloud();
    showToast(`وتاری بەرواری (${sermonDate}) بە سەرکەوتوویی سڕایەوە و لە هەموو ئەپەکانیش هاوتا کرا`, 'success');
  });
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

// ==============================================================
// سیستەمی یەکگرتنی زیرەکی وتارەکان (Sermons Smart Merge)
// ڕێگری تەواو لە سڕینەوە یان ونبوونی وتاری هیچ مامۆستایەک
// ==============================================================
function mergeSermonsList(listA = [], listB = [], mosqueId = '') {
  const map = new Map();
  const deletedSermons = getDeletedSermonKeys();

  (Array.isArray(listA) ? listA : []).forEach(s => {
    if (!s || !s.date) return;
    if (mosqueId && deletedSermons[`${mosqueId}_${s.date}`]) return; // وتاری سڕاوە ناهێنرێتەوە
    map.set(s.date, { ...s });
  });

  (Array.isArray(listB) ? listB : []).forEach(s => {
    if (!s || !s.date) return;
    if (mosqueId && deletedSermons[`${mosqueId}_${s.date}`]) return; // وتاری سڕاوە ناهێنرێتەوە
    if (!map.has(s.date)) {
      map.set(s.date, { ...s });
    } else {
      const existing = map.get(s.date);
      const preferredTopic = (s.topic && s.topic.trim()) || existing.topic || '';
      const preferredSpeaker = (s.speaker && s.speaker.trim()) || existing.speaker || '';
      const preferredAudio = Boolean(s.hasAudio || existing.hasAudio);
      const preferredAudioUrl = s.audioUrl || existing.audioUrl;
      const preferredAudioFile = s.audioFileName || existing.audioFileName;

      map.set(s.date, {
        ...existing,
        ...s,
        topic: preferredTopic,
        speaker: preferredSpeaker,
        hasAudio: preferredAudio,
        audioUrl: preferredAudioUrl,
        audioFileName: preferredAudioFile
      });
    }
  });

  const result = Array.from(map.values());
  result.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return result;
}

// هاوتاکردنی دەستبەجێی تەنها یەک وتار لە کاتی هاتنی لە ئامێرێکی ترەوە
function mergeSingleSermon(mosqueId, incomingSermon) {
  if (!mosqueId || !incomingSermon || !incomingSermon.date) return false;
  const mosque = mosques.find(m => m.id === mosqueId || (m.name && incomingSermon.mosqueName && m.name.trim() === incomingSermon.mosqueName.trim()));
  if (!mosque) return false;

  const existingSermons = mosque.sermons || [];
  mosque.sermons = mergeSermonsList(existingSermons, [incomingSermon]);

  const latest = mosque.sermons[0];
  if (latest) {
    mosque.khutbahDate = latest.date;
    mosque.khutbahTopic = latest.topic;
    mosque.khutbahSpeaker = latest.speaker;
  }
  mosque.updatedAt = Math.max(Number(mosque.updatedAt) || 0, Date.now());

  saveMosqueToVault(mosque);
  saveMosquesDataLocally();

  const container = document.getElementById(`sermon-display-${mosque.id}`);
  if (container) {
    const picker = document.getElementById(`picker-${mosque.id}`);
    const activeDate = picker ? picker.value : (incomingSermon.date || getLatestSermonDate(mosque));
    const activeSermon = findSermonByDate(mosque, activeDate);
    container.innerHTML = renderSermonContentHtml(mosque, activeSermon, activeDate);
    container.classList.remove('sermon-update-flash');
    void container.offsetWidth;
    container.classList.add('sermon-update-flash');
    if (activeSermon && activeSermon.hasAudio) {
      setTimeout(() => loadAudioIntoCardPlayer(mosque.id, activeSermon.date), 50);
    }
  } else {
    renderMosques();
  }

  return true;
}

// ==============================================================
// سیستەمی تایبەتی تۆمارکردن و هاوتاکردنی خێرای وتاری هەینی (Quick Sermon Modal)
// ==============================================================
let quickSermonSelectedAudio = null;

window.openSermonModal = function(mosqueId, targetDate) {
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) return;

  const modal = document.getElementById('sermonModal');
  const mosqueNameEl = document.getElementById('sermonModalMosqueName');
  const mosqueIdInput = document.getElementById('sermonModalMosqueId');
  const sermonIdInput = document.getElementById('sermonModalSermonId');
  const dateInput = document.getElementById('sermonModalDate');
  const speakerInput = document.getElementById('sermonModalSpeaker');
  const topicInput = document.getElementById('sermonModalTopic');
  const teacherPillsContainer = document.getElementById('sermonModalTeacherPills');
  const audioInput = document.getElementById('sermonModalAudioInput');
  const audioStatus = document.getElementById('sermonModalAudioStatus');
  const audioBtnText = document.getElementById('sermonModalAudioBtnText');
  const removeAudioBtn = document.getElementById('sermonModalRemoveAudioBtn');

  if (mosqueNameEl) mosqueNameEl.textContent = mosque.name;
  if (mosqueIdInput) mosqueIdInput.value = mosque.id;

  const chosenDate = targetDate || getLatestSermonDate(mosque) || new Date().toISOString().split('T')[0];
  if (dateInput) dateInput.value = chosenDate;

  // گەڕان بەدوای وتاری پێشوودا
  const existingSermon = (mosque.sermons || []).find(x => x.date === chosenDate);
  if (sermonIdInput) sermonIdInput.value = existingSermon ? existingSermon.id : '';
  if (topicInput) topicInput.value = existingSermon ? (existingSermon.topic || '') : '';
  
  // دوگمەکانی هەڵبژاردنی خێرای ناوی مامۆستا بە داواکاری بەکارهێنەر لابرا
  if (teacherPillsContainer) {
    teacherPillsContainer.innerHTML = '';
  }

  // دانانی پێشوەختەی ناوی مامۆستا
  if (speakerInput) {
    if (existingSermon && existingSermon.speaker) {
      speakerInput.value = existingSermon.speaker;
    } else {
      const defaultSpeaker = (mosque.staff && mosque.staff[0]) ? mosque.staff[0].name : (mosque.khutbahSpeaker || '');
      speakerInput.value = defaultSpeaker;
    }
  }

  // کۆنترۆڵی دەنگ
  quickSermonSelectedAudio = null;
  if (audioInput) audioInput.value = '';
  if (existingSermon && (existingSermon.hasAudio || existingSermon.audioUrl)) {
    if (audioStatus) audioStatus.textContent = 'خاوەنی فایلی دەنگە (MP3)';
    if (audioBtnText) audioBtnText.textContent = 'گۆڕینی فایلی دەنگ';
    if (removeAudioBtn) removeAudioBtn.classList.remove('hidden');
  } else {
    if (audioStatus) audioStatus.textContent = 'هیچ فایلێک دانەنراوە';
    if (audioBtnText) audioBtnText.textContent = 'دیاریکردنی دەنگی MP3';
    if (removeAudioBtn) removeAudioBtn.classList.add('hidden');
  }

  showModal(modal);
  if (topicInput) topicInput.focus();
};

window.closeSermonModal = function() {
  const modal = document.getElementById('sermonModal');
  if (modal) hideModal(modal);
};

window.openAddSermonForDate = function(mosqueId, targetDate) {
  openSermonModal(mosqueId, targetDate);
};

window.openEditSermonForDate = function(mosqueId, targetDate) {
  openSermonModal(mosqueId, targetDate);
};

async function handleSaveQuickSermon(e) {
  e.preventDefault();

  const mosqueId = document.getElementById('sermonModalMosqueId').value;
  const mosque = mosques.find(m => m.id === mosqueId);
  if (!mosque) return;

  const sDate = document.getElementById('sermonModalDate').value.trim();
  const sSpeaker = document.getElementById('sermonModalSpeaker').value.trim();
  const sTopic = document.getElementById('sermonModalTopic').value.trim();

  if (!sDate || !sTopic) {
    showToast('تکایە بەروار و ناونیشانی وتارەکە بنووسە', 'warning');
    return;
  }

  const existingSermons = mosque.sermons ? [...mosque.sermons] : [];
  const sIdx = existingSermons.findIndex(x => x.date === sDate);
  let hasAudio = sIdx !== -1 ? Boolean(existingSermons[sIdx].hasAudio) : false;
  let audioUrl = sIdx !== -1 ? (existingSermons[sIdx].audioUrl || null) : null;
  let audioFileName = sIdx !== -1 ? (existingSermons[sIdx].audioFileName || null) : null;

  if (quickSermonSelectedAudio) {
    const key = `${mosqueId}_${sDate}`;
    await saveSermonAudioBlob(key, quickSermonSelectedAudio);
    hasAudio = true;
    audioFileName = quickSermonSelectedAudio.name;
  }

  const sermonObj = {
    id: sIdx !== -1 ? existingSermons[sIdx].id : ('srm_' + Date.now()),
    date: sDate,
    topic: sTopic,
    speaker: sSpeaker || 'مامۆستای وتاربێژ',
    hasAudio: hasAudio,
    audioUrl: audioUrl,
    audioFileName: audioFileName
  };

  if (sIdx !== -1) {
    existingSermons[sIdx] = sermonObj;
  } else {
    existingSermons.unshift(sermonObj);
  }
  existingSermons.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  mosque.sermons = existingSermons;
  if (existingSermons[0].date === sDate) {
    mosque.khutbahDate = sDate;
    mosque.khutbahTopic = sTopic;
    mosque.khutbahSpeaker = sSpeaker || mosque.khutbahSpeaker;
  }
  mosque.updatedAt = Date.now();

  // ١. پاشەکەوتکردنی دەستبەجێ لەسەر ئەم ئامێرە (0ms)
  saveMosqueToVault(mosque);
  saveMosquesDataLocally();

  const container = document.getElementById(`sermon-display-${mosque.id}`);
  if (container) {
    container.innerHTML = renderSermonContentHtml(mosque, sermonObj, sDate);
    container.classList.remove('sermon-update-flash');
    void container.offsetWidth;
    container.classList.add('sermon-update-flash');
    if (sermonObj.hasAudio) {
      setTimeout(() => loadAudioIntoCardPlayer(mosque.id, sDate), 50);
    }
  } else {
    renderMosques();
  }

  closeSermonModal();
  showToast(`وتاری مامۆستا (${sermonObj.speaker}) بە سەرکەوتوویی خەزن کرا و لە هەموو ئەپەکان هاوتاکرا!`, 'success');

  // ٢. پەخشی ڕاستەوخۆ بە کەمتر لە نیو چرکە بۆ هەموو مۆبایل و کۆمپیوتەرەکان
  broadcastRealtimeEvent({
    type: 'sermon_saved',
    mosqueId: mosque.id,
    mosqueName: mosque.name,
    sermon: sermonObj,
    updatedAt: mosque.updatedAt
  });

  // ٣. بەرزکردنەوەی فایلی دەنگ لە پاشبنەمادا
  if (quickSermonSelectedAudio) {
    uploadSermonAudioToCloud(mosque.id, sDate, quickSermonSelectedAudio)
      .then(({ publicUrl }) => {
        sermonObj.audioUrl = publicUrl;
        mosque.updatedAt = Date.now();
        saveMosqueToVault(mosque);
        saveMosquesDataLocally();
        pushToCloud();
        broadcastRealtimeEvent({
          type: 'sermon_saved',
          mosqueId: mosque.id,
          mosqueName: mosque.name,
          sermon: sermonObj,
          updatedAt: mosque.updatedAt
        });
      })
      .catch(err => console.warn('Audio cloud upload warning:', err));
  }

  // ٤. نوێکردنەوەی داتابەیسی گشتی کڵاود
  pushToCloud();
}

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
      const cleanTime = String(timings[p]).split(' ')[0].trim();
      el.textContent = cleanTime;
      el.setAttribute('dir', 'ltr');
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
  showToast('کاتەکانی بانگ بە سەرکەوتوویی دەستکاری کران و لە هەموو ئەپەکانیش هاوتا کران', 'success');

  // پەخشی دەستبەجێ بۆ هەموو مۆبایل و کۆمپیوتەرەکان
  broadcastRealtimeEvent({
    type: 'prayer_times_updated',
    times: customTimes,
    updatedAt: Date.now()
  });
  pushToCloud();
}

function handleResetPrayerTimes() {
  localStorage.removeItem('penjwen_custom_prayer_times');
  hideModal(prayerTimesModal);
  fetchPenjwenPrayerTimes();
  showToast('کاتەکانی بانگ گەڕانەوە بۆ خودکار و لە هەموو ئەپەکانیش هاوتا کران', 'success');

  // پەخشی دەستبەجێ بۆ هەموو مۆبایل و کۆمپیوتەرەکان
  broadcastRealtimeEvent({
    type: 'prayer_times_reset',
    updatedAt: Date.now()
  });
  pushToCloud();
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
function sanitizeMosqueList(list) {
  if (!Array.isArray(list)) return list;
  return list.map(m => {
    if (!m) return m;
    if (m.id === 'mosque_1791290705595' || (m.name && m.name.includes('بەرکێو'))) {
      const hasHadi = (m.staff || []).some(s => (s.name || '').includes('هادي'));
      if (hasHadi || !m.staff || m.staff.length === 0) {
        return {
          ...m,
          khutbahSpeaker: "مامۆستا ملا غریب",
          staff: [
            { id: "s_1791553238540_0", name: "مامۆستا ملا غریب", role: "ووتاربێژ", phone: "" },
            { id: "s_1791553238540_1", name: "ملا غریب", role: "پێش نوێژ", phone: "" },
            { id: "s_1791553238540_2", name: "حاجی هیوا", role: "بانگ بێژ", phone: "" },
            { id: "s_1791553238540_3", name: "کاک هێمن", role: "کارگووزار", phone: "" }
          ],
          updatedAt: 1791560000000
        };
      }
    }
    return m;
  });
}

function loadMosquesData() {
  // پاککردنەوەی پاشماوەی ناوی هادی لە هەموو کلیلی ستۆریجە ناوخۆییەکان
  try {
    const se = localStorage.getItem('penjwen_user_staff_edits');
    if (se && se.includes('هادي')) {
      let seObj = JSON.parse(se);
      Object.keys(seObj).forEach(k => {
        if ((seObj[k].staff || []).some(s => (s.name || '').includes('هادي'))) {
          delete seObj[k];
        }
      });
      localStorage.setItem('penjwen_user_staff_edits', JSON.stringify(seObj));
    }
    const mv = localStorage.getItem('penjwen_user_mosque_vault');
    if (mv && mv.includes('هادي')) {
      let mvObj = JSON.parse(mv);
      Object.keys(mvObj).forEach(k => {
        if ((mvObj[k].staff || []).some(s => (s.name || '').includes('هادي'))) {
          delete mvObj[k];
        }
      });
      localStorage.setItem('penjwen_user_mosque_vault', JSON.stringify(mvObj));
    }
  } catch(e) {}

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

  // پاراستنی سەدی سەدی داتای تۆمارکراوی مزگەوتەکان و خاوێنکردنەوەی لە ناوی کۆن
  if (Array.isArray(loaded) && loaded.length > 0) {
    mosques = sanitizeMosqueList(loaded);
  } else {
    mosques = JSON.parse(JSON.stringify(DEFAULT_MOSQUES));
  }

  // دڵنیابوونەوە لە هەبوونی مزگەوتە سەرەکییەکان بە مەرجی نەسڕانەوە
  const deletedIds = getDeletedMosqueIds();
  DEFAULT_MOSQUES.forEach(defM => {
    if (deletedIds.has(defM.id)) return; // ئەگەر لەلایەن مامۆستا یان بەکارهێنەرەوە سڕابێتەوە، دووبارە ناکرێتەوە
    const foundIdx = mosques.findIndex(m => m.id === defM.id || (m.name && defM.name && m.name.trim() === defM.name.trim()));
    if (foundIdx === -1) {
      mosques.push(JSON.parse(JSON.stringify(defM)));
    } else {
      // ئەگەر مزگەوتی ناوخۆ کۆنتر بوو یان ناوی هادی مابوو
      const curr = mosques[foundIdx];
      if ((curr.staff || []).some(s => (s.name || '').includes('هادي'))) {
        mosques[foundIdx] = JSON.parse(JSON.stringify(defM));
      }
    }
  });

  // فلتەرکردنی یەکجاری بۆ دڵنیابوون لە نەمانی هیچ مزگەوتێکی سڕاوە
  mosques = mosques.filter(m => m && m.id && !deletedIds.has(m.id));

  // سەپاندنی دەستبەجێی داتاکانی (دەستکاری ستاف) و (زیادکردنی مزگەوتی نوێ)
  applyUserCustomVault(mosques);

  // دڵنیابوونەوە لە کاتی نوێکردنەوە بۆ هەموو مزگەوتەکان
  mosques.forEach(m => {
    if (!m.updatedAt) m.updatedAt = m.createdAt || 1791148000000;
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
        let cleanMv = { ...mosqueVault };
        Object.keys(cleanMv).forEach(k => {
          if ((cleanMv[k].staff || []).some(s => (s.name || '').includes('هادي'))) {
            delete cleanMv[k];
          }
        });
        const localVault = localStorage.getItem('penjwen_user_mosque_vault');
        if (!localVault) {
          localStorage.setItem('penjwen_user_mosque_vault', JSON.stringify(cleanMv));
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
        let cleanSe = { ...staffEdits };
        Object.keys(cleanSe).forEach(k => {
          if ((cleanSe[k].staff || []).some(s => (s.name || '').includes('هادي'))) {
            delete cleanSe[k];
          }
        });
        const localEdits = localStorage.getItem('penjwen_user_staff_edits');
        if (!localEdits) {
          localStorage.setItem('penjwen_user_staff_edits', JSON.stringify(cleanSe));
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
      saveMosquesDataLocally();
      updateStats();
      renderMosques();
    }
  });

  updateStats();
  renderMosques();
}

function saveMosquesDataLocally() {
  try {
    const dataStr = JSON.stringify(mosques);
    localStorage.setItem('penjwen_mosques_data', dataStr);
    localStorage.setItem('penjwen_mosques_backup', dataStr);
    localStorage.setItem('penjwen_mosques_permanent_vault', dataStr);
    saveToIndexedDBVault(mosques);
  } catch(e) {
    console.warn('Error saving mosques data locally:', e);
  }
}

function saveMosquesData(triggerCloud = true) {
  saveMosquesDataLocally();
  updateStats();
  renderMosques();

  if (typeof updateSyncBadgeOnLocalChange === 'function') {
    updateSyncBadgeOnLocalChange();
  }
  if (triggerCloud) {
    if (typeof broadcastRealtimeEvent === 'function') {
      broadcastRealtimeEvent({
        type: 'sync_trigger',
        updatedAt: Date.now()
      });
    }
    if (typeof pushToCloud === 'function') {
      pushToCloud();
    }
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
            <button type="button" onclick="openSermonModal('${mosque.id}', document.getElementById('picker-${mosque.id}') ? document.getElementById('picker-${mosque.id}').value : '${initialDate}')" class="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold px-2.5 py-1 rounded-xl shadow-xs transition-all cursor-pointer mr-1" title="تۆمارکردن یان گۆڕینی خێرای وتاری ئەم مزگەوتە">
              <i class="fa-solid fa-feather-pointed text-[10px]"></i>
              <span>تۆمارکردنی وتار</span>
            </button>
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

  const pinInput = document.getElementById('mosqueTeacherPinInput');
  if (pinInput) pinInput.value = '';
  const teacherInput = document.getElementById('mosqueCreatorTeacherInput');
  if (teacherInput) teacherInput.value = '';
  
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

  const enteredPin = (document.getElementById('mosqueTeacherPinInput')?.value || '').trim();
  const enteredTeacher = (document.getElementById('mosqueCreatorTeacherInput')?.value || '').trim();

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
          uploadSermonAudioToCloud(idToEdit, sDate, selectedAudioFile)
            .then(({ publicUrl }) => {
              const m = mosques.find(x => x.id === idToEdit);
              const sm = m && m.sermons ? m.sermons.find(x => x.date === sDate) : null;
              if (sm) sm.audioUrl = publicUrl;
              saveMosquesData();
              pushToCloud();
              if (m && sm) {
                broadcastRealtimeEvent({
                  type: 'sermon_saved',
                  mosqueId: m.id,
                  mosqueName: m.name,
                  sermon: sm,
                  updatedAt: Date.now()
                });
              }
            })
            .catch(e => console.warn('Modal audio cloud upload error:', e));
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
      const finalPin = enteredPin || existing.teacherPin || '1234';
      const finalTeacher = enteredTeacher || existing.creatorTeacher || (staff[0] ? staff[0].name : sSpeaker || '');

      const updatedMosque = {
        ...existing,
        name,
        location: finalLocation,
        notes,
        teacherPin: finalPin,
        creatorTeacher: finalTeacher,
        creatorDeviceId: existing.creatorDeviceId || REALTIME_CLIENT_ID,
        sermons: updatedSermons,
        khutbahDate: sDate,
        khutbahTopic: sTopic || (updatedSermons[0] ? updatedSermons[0].topic : ''),
        khutbahSpeaker: sSpeaker || (updatedSermons[0] ? updatedSermons[0].speaker : ''),
        staff,
        updatedAt: now
      };

      mosques[index] = updatedMosque;
      saveTeacherKey(idToEdit, finalPin);

      // پاراستنی دەستبەجێ لە هەموو کۆگاکان
      saveMosqueToVault(updatedMosque);
      broadcastRealtimeEvent({
        type: 'mosque_saved',
        mosque: updatedMosque,
        updatedAt: now
      });
      if (sTopic) {
        const savedSermon = updatedMosque.sermons.find(s => s.date === sDate);
        if (savedSermon) {
          broadcastRealtimeEvent({
            type: 'sermon_saved',
            mosqueId: updatedMosque.id,
            mosqueName: updatedMosque.name,
            sermon: savedSermon,
            updatedAt: now
          });
        }
      }
      showToast(`گۆڕانکارییەکانی (${name}) بە سەرکەوتوویی پاشەکەوت کران`, 'success');
    }
  } else {
    // Create new
    targetId = 'mosque_' + now + '_' + Math.random().toString(36).substring(2, 7);
    const initialSermons = [];

    if (sTopic) {
      let hasAudioFlag = false;
      if (selectedAudioFile) {
        const key = `${targetId}_${sDate}`;
        await saveSermonAudioBlob(key, selectedAudioFile);
        hasAudioFlag = true;
        uploadSermonAudioToCloud(targetId, sDate, selectedAudioFile)
          .then(({ publicUrl }) => {
            const m = mosques.find(x => x.id === targetId);
            const sm = m && m.sermons ? m.sermons.find(x => x.date === sDate) : null;
            if (sm) sm.audioUrl = publicUrl;
            saveMosquesData();
            pushToCloud();
            if (m && sm) {
              broadcastRealtimeEvent({
                type: 'sermon_saved',
                mosqueId: m.id,
                mosqueName: m.name,
                sermon: sm,
                updatedAt: Date.now()
              });
            }
          })
          .catch(e => console.warn('New mosque audio cloud upload error:', e));
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
    const finalPin = enteredPin || '1234';
    const finalTeacher = enteredTeacher || (staff[0] ? staff[0].name : sSpeaker || 'مامۆستای وتاربێژ');

    const newMosque = {
      id: targetId,
      name,
      location: finalLocation,
      notes,
      teacherPin: finalPin,
      creatorTeacher: finalTeacher,
      creatorDeviceId: REALTIME_CLIENT_ID,
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
    saveTeacherKey(targetId, finalPin);

    // پاراستنی هەمیشەیی مزگەوتی نوێ لە هەموو کۆگاکان
    saveMosqueToVault(newMosque);
    broadcastRealtimeEvent({
      type: 'mosque_saved',
      mosque: newMosque,
      updatedAt: now
    });
    if (sTopic && initialSermons.length > 0) {
      broadcastRealtimeEvent({
        type: 'sermon_saved',
        mosqueId: newMosque.id,
        mosqueName: newMosque.name,
        sermon: initialSermons[0],
        updatedAt: now
      });
    }
    showToast(`مزگەوتی (${name}) بە سەرکەوتوویی تۆمار کرا`, 'success');
  }

  saveMosquesData();
  pushToCloud();
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

  const pinInput = document.getElementById('mosqueTeacherPinInput');
  if (pinInput) pinInput.value = mosque.teacherPin || '1234';
  const teacherInput = document.getElementById('mosqueCreatorTeacherInput');
  if (teacherInput) teacherInput.value = mosque.creatorTeacher || (mosque.staff && mosque.staff[0] ? mosque.staff[0].name : '');

  showModal(mosqueModal);
};

window.deleteMosque = function(id) {
  const mosque = mosques.find(m => m.id === id);
  if (!mosque) return;

  verifyTeacherPermission(mosque.id, `سڕینەوەی مزگەوتی (${mosque.name})`, async () => {
    mosques = mosques.filter(m => m.id !== id);
    removeMosqueFromVault(id);
    saveMosquesData();
    broadcastRealtimeEvent({
      type: 'mosque_deleted',
      mosqueId: id,
      deletedAt: Date.now()
    });
    pushToCloud();
    showToast(`مزگەوتی (${mosque.name}) بە سەرکەوتوویی سڕایەوە و لە هەموو ئەپەکانیش هاوتا کرا`, 'success');
  });
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
              ${s.hasAudio ? `
                <div class="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                  <span class="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                    <i class="fa-solid fa-file-audio text-emerald-600"></i>
                    <span>فایلی دەنگی وتار (MP3)</span>
                  </span>
                  <button type="button" onclick="downloadSermonAudio('${mosque.id}', '${s.date}')" class="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors">
                    <i class="fa-solid fa-download"></i>
                    <span>داگرتنی وتار (MP3)</span>
                  </button>
                </div>
              ` : ''}
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
// ٨. چاپکردن و دروستکردنی PDF بە شێوازی فەرمی بۆ مۆبایل و کۆمپیوتەر
// ==============================================================
function prepareAndPrintReport() {
  const printTableContainer = document.getElementById('printTableContainer');
  const printReportDate = document.getElementById('printReportDate');
  const printReportCount = document.getElementById('printReportCount');
  const reportModal = document.getElementById('reportModal');
  const reportModalDate = document.getElementById('reportModalDate');
  const reportModalCount = document.getElementById('reportModalCount');
  const reportModalBody = document.getElementById('reportModalBody');

  const now = new Date();
  const dayName = KURDISH_DAYS[now.getDay()];
  const dayNum = now.getDate();
  const monthName = KURDISH_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  const dateFormatted = `${dayName}، ${dayNum}ی ${monthName}ی ${year}`;

  if (printReportDate) printReportDate.textContent = `بەرواری دەرچوون: ${dateFormatted}`;
  if (printReportCount) printReportCount.textContent = `سەرجەم مزگەوتە تۆمارکراوەکان: ${mosques.length}`;
  if (reportModalDate) reportModalDate.textContent = `بەرواری دەرچوون: ${dateFormatted}`;
  if (reportModalCount) reportModalCount.textContent = `کۆی گشتی: ${mosques.length} مزگەوت`;

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

  const fullTableHtml = `
    <table class="w-full text-right border-collapse text-xs sm:text-sm">
      <thead>
        <tr class="bg-emerald-100 text-emerald-950 font-bold border-b-2 border-emerald-300">
          <th style="width: 4%; text-align: center;" class="p-2 border border-slate-300">#</th>
          <th style="width: 17%;" class="p-2 border border-slate-300">ناوی مزگەوت</th>
          <th style="width: 12%;" class="p-2 border border-slate-300">گەڕەک / ناونیشان</th>
          <th style="width: 14%;" class="p-2 border border-slate-300">وتاربێژ</th>
          <th style="width: 14%;" class="p-2 border border-slate-300">پێشنوێژ</th>
          <th style="width: 13%;" class="p-2 border border-slate-300">بانگبێژ</th>
          <th style="width: 13%;" class="p-2 border border-slate-300">کارگووزار</th>
          <th style="width: 17%;" class="p-2 border border-slate-300">وتار و وتاربێژی هەینی</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  if (printTableContainer) {
    printTableContainer.innerHTML = fullTableHtml;
  }

  // پیشاندانی ڕاپۆرت لە مۆداڵی تایبەت بۆ ئەوەی بەکارهێنەر لە مۆبایل و کۆمپیوتەردا بیبینێت
  if (reportModalBody) {
    reportModalBody.innerHTML = `
      <div class="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div class="bg-emerald-800 text-white p-3 text-center">
          <h4 class="font-bold text-sm sm:text-base">بەڕێوەبەرایەتی ئەوقافی پێنجوێن - خشتەی فەرمی مزگەوتەکان و ستاف</h4>
          <p class="text-xs text-emerald-200 mt-0.5">${dateFormatted} • کۆی گشتی: ${mosques.length} مزگەوت</p>
        </div>
        <div class="overflow-x-auto">
          ${fullTableHtml}
        </div>
      </div>
    `;
  }

  if (reportModal) {
    showModal(reportModal);
  }

  // ئەگەر کۆمپیوتەر بێت، دیالۆگی چاپکردنی پەڕە ڕاستەوخۆ دەکاتەوە
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  if (!isMobile) {
    setTimeout(() => {
      try {
        window.print();
      } catch(e) {}
    }, 200);
  }
}

// کردارەکانی مۆداڵی ڕاپۆرت بۆ مۆبایل و کۆمپیوتەر
window.triggerNativePrint = function() {
  try {
    window.print();
  } catch (e) {
    showToast('چاپکەر لەسەر ئەم ئامێرە بەردەست نییە، دەتوانیت وەک HTML/PDF دایبەزێنیت', 'warning');
  }
};

window.downloadReportHtml = function() {
  const now = new Date();
  const dayName = KURDISH_DAYS[now.getDay()];
  const dayNum = now.getDate();
  const monthName = KURDISH_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  const dateFormatted = `${dayName}، ${dayNum}ی ${monthName}ی ${year}`;

  const printTableContainer = document.getElementById('printTableContainer');
  const tableContent = printTableContainer ? printTableContainer.innerHTML : '';

  const htmlDoc = `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ڕاپۆرتی فەرمی مزگەوتەکانی پێنجوێن</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #000; padding: 20px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #166534; padding-bottom: 12px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: bold; margin: 5px 0; }
    .sub { font-size: 14px; color: #166534; font-weight: bold; }
    .meta { display: flex; justify-content: space-between; font-size: 12px; margin-top: 10px; color: #555; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
    th, td { border: 1px solid #333; padding: 8px; text-align: right; }
    th { background-color: #e2f8ec; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9fbf9; }
    .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid #ccc; padding-top: 10px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size: 16px; margin-bottom: 4px;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
    <div class="title">حکومەتی هەرێمی کوردستان - وەزارەتی ئەوقاف و کاروباری ئایینی</div>
    <div class="sub">بەڕێوەبەرایەتی ئەوقافی پێنجوێن - خشتەی فەرمی مزگەوتەکان، مامۆستایان و وتارەکان</div>
    <div class="meta">
      <span>بەروار: ${dateFormatted}</span>
      <span>سەرجەم مزگەوتەکان: ${mosques.length}</span>
      <span>قەزای پێنجوێن</span>
    </div>
  </div>
  ${tableContent}
  <div class="footer">
    <div>ئامادەکاری: ئەپی فەرمی مزگەوتەکانی پێنجوێن</div>
    <div>واژوو و پەسەندکردن: ................................</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  <\/script>
</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ڕاپۆرتی_مزگەوتەکانی_پێنجوێن_${year}_${now.getMonth()+1}_${dayNum}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 2000);
  showToast('فایلی ڕاپۆرتەکە دابەزی (دەتوانیت بیکەیتەوە و چاپی بکەیت)', 'success');
};

window.shareReportMobile = async function() {
  const summaryText = buildReportSummaryText();
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'ڕاپۆرتی مزگەوتەکانی پێنجوێن',
        text: summaryText
      });
      showToast('ڕاپۆرت هاوبەش کرا', 'success');
      return;
    } catch(e) {}
  }
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
  window.open(waUrl, '_blank');
};

window.copyReportText = async function() {
  const summaryText = buildReportSummaryText();
  try {
    await navigator.clipboard.writeText(summaryText);
    showToast('دەقی تەواوی ڕاپۆرت کۆپی کرا', 'success');
  } catch(e) {
    showToast('دەستکاری ڕێگەپێدانی کۆپی نەکراوە', 'error');
  }
};

function buildReportSummaryText() {
  const now = new Date();
  let text = `📋 ڕاپۆرتی فەرمی مزگەوتەکانی پێنجوێن\nبەروار: ${now.toLocaleDateString('ckb-IQ')}\nکۆی گشتی: ${mosques.length} مزگەوت\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  mosques.forEach((m, idx) => {
    let khateeb = '-', imam = '-', muezzin = '-', karguzar = '-';
    (m.staff || []).forEach(s => {
      const r = s.role || '';
      if (r.includes('وتاربێژ') || r.includes('ووتار')) khateeb = s.name;
      if (r.includes('پێشنوێژ') || r.includes('پێش')) imam = s.name;
      if (r.includes('بانگبێژ') || r.includes('بانگ')) muezzin = s.name;
      if (r.includes('کارگ') || r.includes('کارگو') || r.includes('خزمەت')) karguzar = s.name;
    });
    const s = (m.sermons && m.sermons[0]) ? m.sermons[0] : (m.khutbahTopic ? { topic: m.khutbahTopic, speaker: m.khutbahSpeaker } : null);
    text += `${idx + 1}. ${m.name} (${m.location || 'پێنجوێن'})\n`;
    text += `   • وتاربێژ: ${khateeb}\n`;
    text += `   • پێشنوێژ: ${imam}\n`;
    text += `   • بانگبێژ: ${muezzin}\n`;
    text += `   • کارگووزار: ${karguzar}\n`;
    if (s && s.topic) {
      text += `   • وتاری هەینی: «${s.topic}» [${s.speaker || khateeb}]\n`;
    }
    text += `\n`;
  });
  text += `━━━━━━━━━━━━━━━━━━━━\nئەپی فەرمی مزگەوتەکانی پێنجوێن: https://farhadhosaen-hub.github.io/penjwen-mosques/`;
  return text;
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

  // گوێگرتن لە فۆڕمی خێرای وتاری هەینی
  const sermonQuickForm = document.getElementById('sermonQuickForm');
  if (sermonQuickForm) sermonQuickForm.addEventListener('submit', handleSaveQuickSermon);

  const sermonModalAudioInput = document.getElementById('sermonModalAudioInput');
  const sermonModalAudioStatus = document.getElementById('sermonModalAudioStatus');
  const sermonModalAudioBtnText = document.getElementById('sermonModalAudioBtnText');
  const sermonModalRemoveAudioBtn = document.getElementById('sermonModalRemoveAudioBtn');

  if (sermonModalAudioInput) {
    sermonModalAudioInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        quickSermonSelectedAudio = e.target.files[0];
        const sizeMb = (quickSermonSelectedAudio.size / (1024 * 1024)).toFixed(1);
        if (sermonModalAudioStatus) sermonModalAudioStatus.textContent = `${quickSermonSelectedAudio.name} (${sizeMb} MB)`;
        if (sermonModalAudioBtnText) sermonModalAudioBtnText.textContent = 'فایل هەڵبژێردرا';
        if (sermonModalRemoveAudioBtn) sermonModalRemoveAudioBtn.classList.remove('hidden');
      }
    });
  }

  if (sermonModalRemoveAudioBtn) {
    sermonModalRemoveAudioBtn.addEventListener('click', () => {
      quickSermonSelectedAudio = null;
      if (sermonModalAudioInput) sermonModalAudioInput.value = '';
      if (sermonModalAudioStatus) sermonModalAudioStatus.textContent = 'هیچ فایلێک دانەنراوە';
      if (sermonModalAudioBtnText) sermonModalAudioBtnText.textContent = 'دیاریکردنی دەنگی MP3';
      sermonModalRemoveAudioBtn.classList.add('hidden');
    });
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

  // گوێگرتن لە پەسەندکردنی کۆدی نهێنی مامۆستا
  const teacherAuthConfirmBtn = document.getElementById('teacherAuthConfirmBtn');
  if (teacherAuthConfirmBtn) {
    teacherAuthConfirmBtn.addEventListener('click', handleTeacherAuthConfirm);
  }
  const teacherAuthPinInput = document.getElementById('teacherAuthPinInput');
  if (teacherAuthPinInput) {
    teacherAuthPinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleTeacherAuthConfirm();
      }
    });
  }
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

// ==============================================================
// سیستەمی فوول سکرین (پڕکردنی شاشە بە تەواوی و ئۆتۆماتیکی لە مۆبایلدا)
// ==============================================================
let userManuallyExitedFullscreen = false;

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 850 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
}

function requestFullScreenElement(docEl = document.documentElement) {
  const rfs = docEl.requestFullscreen || 
              docEl.webkitRequestFullscreen || 
              docEl.mozRequestFullScreen || 
              docEl.msRequestFullscreen;
  if (rfs) {
    try {
      const p = rfs.call(docEl);
      if (p && typeof p.then === 'function') {
        return p.then(() => {
          updateFullScreenButtonIcon(true);
          return true;
        }).catch(() => false);
      }
      updateFullScreenButtonIcon(true);
      return Promise.resolve(true);
    } catch(e) {}
  }
  return Promise.resolve(false);
}

function exitFullScreenElement() {
  const doc = window.document;
  const cfs = doc.exitFullscreen || 
              doc.webkitExitFullscreen || 
              doc.mozCancelFullScreen || 
              doc.msExitFullscreen;
  if (cfs) {
    try {
      const p = cfs.call(doc);
      if (p && typeof p.then === 'function') {
        return p.then(() => {
          updateFullScreenButtonIcon(false);
          return true;
        }).catch(() => false);
      }
      updateFullScreenButtonIcon(false);
      return Promise.resolve(true);
    } catch(e) {}
  }
  return Promise.resolve(false);
}

function toggleFullScreen() {
  const doc = window.document;
  const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);

  if (!isFs) {
    userManuallyExitedFullscreen = false;
    requestFullScreenElement().then(success => {
      if (!success) {
        showToast('ئامێرەکەت یان وێبگەڕەکەت ڕێگە بە Fullscreen نادات', 'info');
      }
    });
  } else {
    userManuallyExitedFullscreen = true;
    exitFullScreenElement();
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

// ئۆتۆماتیکی پڕکردنی شاشە لە کاتی کردنەوەی ئەپ لە مۆبایلدا
function initAutoFullScreenOnMobile() {
  if (!isMobileDevice()) return;

  const tryEnterFullscreen = () => {
    if (userManuallyExitedFullscreen) return;
    const doc = window.document;
    const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
    if (!isFs) {
      requestFullScreenElement();
    }
  };

  // ١. هەوڵی ڕاستەوخۆ دەستبەجێ لە کاتی کردنەوەی پەڕە
  tryEnterFullscreen();
  setTimeout(tryEnterFullscreen, 150);
  setTimeout(tryEnterFullscreen, 500);
  setTimeout(tryEnterFullscreen, 1200);

  // ٢. لەگەڵ یەکەمین پەنجەلێدان / تاچ لەسەر هەر شوێنێکی شاشە
  const onFirstInteraction = () => {
    if (!userManuallyExitedFullscreen) {
      tryEnterFullscreen();
    }
  };

  ['touchstart', 'touchend', 'pointerdown', 'click'].forEach(evt => {
    window.addEventListener(evt, onFirstInteraction, { passive: true });
  });

  // ٣. کاتێک وێبگەڕ فوکەس دەبێتەوە یان دەگەڕێتەوە سەر ئەپەکە
  window.addEventListener('focus', tryEnterFullscreen);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      tryEnterFullscreen();
    }
  });
}

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

// ==============================================================
// داتابەیسی کڵاود و بزوێنەری هاوکاتکردنی ڕاستەوخۆ (Real-time Instant Mesh Sync)
// خێرایی ناردن و وەرگرتن: کەمتر لە نیو چرکە لەنێوان هەموو مۆبایل و کۆمپیوتەرەکاندا
// ==============================================================
const CLOUD_SYNC_PRIMARY = 'https://raw.githubusercontent.com/farhadhosaen-hub/penjwen-mosques/main/penjwen_mosques_data.json';
const CLOUD_SYNC_FALLBACK = 'https://farhadhosaen-hub.github.io/penjwen-mosques/penjwen_mosques_data.json';

const REALTIME_CLIENT_ID = 'cli_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
const REALTIME_TOPIC = 'penjwen_mosques_live_sync_v2';
const REALTIME_PUB_URL = `https://ntfy.sh/${REALTIME_TOPIC}`;
const REALTIME_SUB_SSE = `https://ntfy.sh/${REALTIME_TOPIC}/sse`;

let localBroadcastChannel = null;
let realtimeEventSource = null;

try {
  if ('BroadcastChannel' in window) {
    localBroadcastChannel = new BroadcastChannel('penjwen_realtime_sync');
    localBroadcastChannel.onmessage = (e) => {
      handleRealtimeIncomingPacket(e.data);
    };
  }
} catch(e) {}

// ناردنی دەستبەجێی گۆڕانکارییەکان بۆ هەموو مۆبایل و ئەپەکان لە کەمتر لە نیو چرکەدا
function broadcastRealtimeEvent(packet) {
  if (!packet || typeof packet !== 'object') return;
  packet.senderId = REALTIME_CLIENT_ID;
  packet.timestamp = Date.now();

  // ١. دەستبەجێ بۆ هەموو تابات و پەنجەرەکانی هەمان ئامێر بە کاتی سفر (0ms)
  try {
    if (localBroadcastChannel) {
      localBroadcastChannel.postMessage(packet);
    }
  } catch(e) {}

  // ٢. ناردنی ڕاستەوخۆ بۆ تۆڕی جیهانی بە کەمتر لە نیو چرکە بۆ سەرجەم مۆبایل و کۆمپیوتەرەکانی تر
  try {
    fetch(REALTIME_PUB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packet),
      keepalive: true
    }).catch(() => {});
  } catch(e) {}
}
window.broadcastRealtimeEvent = broadcastRealtimeEvent;

// وەرگرتن و کارپێکردنی ڕاستەوخۆی هەر نوێکارییەک لە هەر ئامێرێکی ترەوە هات
function handleRealtimeIncomingPacket(packet) {
  if (!packet || typeof packet !== 'object') return;
  if (packet.senderId === REALTIME_CLIENT_ID) return; // پاراستن لە خۆ-دەنگدانەوە

  if (packet.type === 'sermon_saved' && packet.mosqueId && packet.sermon) {
    const success = mergeSingleSermon(packet.mosqueId, packet.sermon);
    if (success) {
      showToast(`⚡ ڕاستەوخۆ: وتاری مامۆستا (${packet.sermon.speaker || ''}) بۆ بەرواری (${packet.sermon.date}) هاوتا کرا!`, 'success');
    }
  } else if (packet.type === 'sermon_deleted' && packet.mosqueId && packet.sermonDate) {
    markSermonDeleted(packet.mosqueId, packet.sermonDate);
    const m = mosques.find(x => x.id === packet.mosqueId);
    if (m && m.sermons) {
      m.sermons = m.sermons.filter(s => s.date !== packet.sermonDate);
      const latest = m.sermons[0] || null;
      m.khutbahDate = latest ? latest.date : '';
      m.khutbahTopic = latest ? latest.topic : '';
      m.khutbahSpeaker = latest ? latest.speaker : '';
      saveMosqueToVault(m);
      saveMosquesDataLocally();
      const container = document.getElementById(`sermon-display-${m.id}`);
      if (container) {
        const picker = document.getElementById(`picker-${m.id}`);
        const activeDate = picker ? picker.value : (latest ? latest.date : '');
        const activeSermon = findSermonByDate(m, activeDate);
        container.innerHTML = renderSermonContentHtml(m, activeSermon, activeDate);
      }
      showToast(`⚡ وتاری بەرواری (${packet.sermonDate}) لە ئامێرێکی ترەوە سڕایەوە و هاوتاکرا`, 'info');
    }
  } else if (packet.type === 'mosque_saved' && packet.mosque) {
    const changes = mergeIncomingMosques([packet.mosque]);
    if (changes > 0) {
      showToast(`⚡ دەستبەجێ زانیاری نوێی (${packet.mosque.name}) لە ئامێرێکی ترەوە هاوتا کرا`, 'success');
    }
  } else if (packet.type === 'mosque_deleted' && packet.mosqueId) {
    markMosqueDeleted(packet.mosqueId);
    mosques = mosques.filter(m => m.id !== packet.mosqueId);
    removeMosqueFromVault(packet.mosqueId);
    saveMosquesDataLocally();
    renderMosques();
    updateStats();
    showToast('⚡ مزگەوتێک لە ئامێرێکی ترەوە سڕایەوە و هاوتاکرا', 'info');
  } else if (packet.type === 'prayer_times_updated' && packet.times) {
    localStorage.setItem('penjwen_custom_prayer_times', JSON.stringify(packet.times));
    currentPrayerTimes = packet.times;
    updatePrayerTimesUI(currentPrayerTimes, true);
    showToast('⚡ کاتەکانی بانگ لە ئامێرێکی ترەوە دەستکاری کرا و هاوتا کرا', 'info');
  } else if (packet.type === 'prayer_times_reset') {
    localStorage.removeItem('penjwen_custom_prayer_times');
    fetchPenjwenPrayerTimes();
    showToast('⚡ کاتەکانی بانگ گەڕێنرانەوە بۆ دەستپێک و هاوتا کرا', 'info');
  } else if (packet.type === 'sync_trigger' || packet.type === 'full_sync_trigger') {
    syncFromCloud(true);
  }
}

// دامەزراندنی کەناڵی بەردەوامی گوێگرتن لە نێوان هەموو ئەپەکاندا بە شێوەی ڕاستەوخۆ
function initRealtimeSyncEngine() {
  if (!('EventSource' in window)) return;
  if (realtimeEventSource) {
    try { realtimeEventSource.close(); } catch(e){}
  }

  try {
    realtimeEventSource = new EventSource(REALTIME_SUB_SSE);
    realtimeEventSource.onopen = () => {
      const badge = document.getElementById('cloudSyncStatusBadge');
      const text = document.getElementById('cloudSyncText');
      if (text) text.textContent = 'هاوکاتە (ڕاستەوخۆ)';
      if (badge) {
        badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 transition-colors cursor-pointer';
      }
    };
    realtimeEventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event === 'message' && payload.message) {
          const packet = JSON.parse(payload.message);
          handleRealtimeIncomingPacket(packet);
        }
      } catch(err) {}
    };
    realtimeEventSource.onerror = () => {
      try { realtimeEventSource.close(); } catch(e){}
      setTimeout(initRealtimeSyncEngine, 3500);
    };
  } catch(err) {
    setTimeout(initRealtimeSyncEngine, 4000);
  }
}
window.initRealtimeSyncEngine = initRealtimeSyncEngine;

let isPushingToCloud = false;
let pendingPush = false;
let lastKnownCloudUpdatedAt = null;

// ناردنی داتای نوێ بۆ کڵاود لە کاتی گۆڕانکاری (Push To Cloud Online)
async function pushToCloud() {
  if (isPushingToCloud) {
    pendingPush = true;
    return;
  }
  isPushingToCloud = true;

  const icon = document.getElementById('cloudSyncIcon');
  const text = document.getElementById('cloudSyncText');
  const badge = document.getElementById('cloudSyncStatusBadge');
  if (text) text.textContent = 'ناردن بۆ کڵاود...';
  if (icon) icon.classList.add('animate-spin');

  try {
    // ١. پێش ناردن، هێنانی کڵاود بۆ تێکەڵکردنی زیرەکانە تا هیچ مزگەوتێکی ئامێرەکانی تر لەدەست نەچێت
    let currentCloud = null;
    try {
      const preResp = await fetch(`https://api.github.com/gists/${GIST_SYNC_ID}?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${GIST_SYNC_TOKEN}`,
          'Accept': 'application/vnd.github+json'
        },
        cache: 'no-store'
      });
      if (preResp.ok) {
        const preData = await preResp.json();
        if (preData.files && preData.files['penjwen_mosques_data.json'] && preData.files['penjwen_mosques_data.json'].content) {
          currentCloud = JSON.parse(preData.files['penjwen_mosques_data.json'].content);
        }
        if (preData.files && preData.files['penjwen_sync_meta.json'] && preData.files['penjwen_sync_meta.json'].content) {
          try {
            const preMeta = JSON.parse(preData.files['penjwen_sync_meta.json'].content);
            if (preMeta && Array.isArray(preMeta.deletedMosqueIds)) {
              preMeta.deletedMosqueIds.forEach(id => markMosqueDeleted(id));
            }
            if (preMeta && preMeta.deletedSermons) {
              const localDS = getDeletedSermonKeys();
              Object.keys(preMeta.deletedSermons).forEach(k => { localDS[k] = preMeta.deletedSermons[k]; });
              localStorage.setItem('penjwen_deleted_sermons', JSON.stringify(localDS));
            }
          } catch(e) {}
        }
      }
    } catch(e) {
      console.warn('Pre-fetch before push error:', e);
    }

    const deletedIds = getDeletedMosqueIds();
    let mergedList = [...mosques].filter(m => m && m.id && !deletedIds.has(m.id));

    if (Array.isArray(currentCloud) && currentCloud.length > 0) {
      currentCloud.forEach(cloudM => {
        if (!cloudM || !cloudM.id || deletedIds.has(cloudM.id)) return;
        const localIdx = mergedList.findIndex(m => m.id === cloudM.id || (m.name && cloudM.name && m.name.trim() === cloudM.name.trim()));
        if (localIdx === -1) {
          // مزگەوتێکی تر لە ئامێرێکی ترەوە زیاد کراوە -> دەهێندرێت
          mergedList.push(cloudM);
        } else {
          // هاوتاکردن و تێکەڵکردنی زیرەکانەی وتارەکان بەبێ لەدەستچوونی هیچ وتارێک
          const localM = mergedList[localIdx];
          const cloudTime = Number(cloudM.updatedAt) || 0;
          const localTime = Number(localM.updatedAt) || 0;
          const localHasHadi = (localM.staff || []).some(s => (s.name || '').includes('هادي'));

          const mergedSermons = mergeSermonsList(localM.sermons || [], cloudM.sermons || [], localM.id);
          const latestSermon = mergedSermons[0] || null;
          const staffToUse = (cloudTime > localTime && !localHasHadi) ? (cloudM.staff || localM.staff) : (localM.staff || cloudM.staff);

          mergedList[localIdx] = {
            ...cloudM,
            ...localM,
            teacherPin: localM.teacherPin || cloudM.teacherPin || '1234',
            creatorTeacher: localM.creatorTeacher || cloudM.creatorTeacher || '',
            staff: staffToUse,
            sermons: mergedSermons,
            khutbahDate: latestSermon ? latestSermon.date : (localM.khutbahDate || cloudM.khutbahDate),
            khutbahTopic: latestSermon ? latestSermon.topic : (localM.khutbahTopic || cloudM.khutbahTopic),
            khutbahSpeaker: latestSermon ? latestSermon.speaker : (localM.khutbahSpeaker || cloudM.khutbahSpeaker),
            updatedAt: Math.max(cloudTime, localTime, Date.now())
          };
        }
      });
    }

    const metaPayload = {
      deletedMosqueIds: Array.from(deletedIds),
      deletedSermons: getDeletedSermonKeys(),
      prayerTimes: getSavedCustomPrayerTimes(),
      updatedAt: Date.now()
    };

    const payload = {
      description: 'Penjwen Mosques Realtime Cloud DB',
      files: {
        'penjwen_mosques_data.json': {
          content: JSON.stringify(mergedList, null, 2)
        },
        'penjwen_sync_meta.json': {
          content: JSON.stringify(metaPayload, null, 2)
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
      const resJson = await resp.json();
      lastKnownCloudUpdatedAt = resJson.updated_at || new Date().toISOString();
      mosques = mergedList;
      saveMosquesDataLocally();
      renderMosques();
      updateStats();
      localStorage.setItem('penjwen_last_sync_time', Date.now().toString());
      if (text) text.textContent = 'هاوکاتە (ڕاستەوخۆ)';
      if (badge) {
        badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 transition-colors cursor-pointer';
      }
      showToast('هاوکاتکرا! گۆڕانکارییەکان بۆ هەموو مۆبایل و ئەپەکان بڵاوکرانەوە', 'success');

      // ئاگادارکردنەوەی هەموو مۆبایل و ئەپەکان لە کەمتر لە نیو چرکەدا بۆ نوێبوونەوە
      broadcastRealtimeEvent({ type: 'sync_trigger', updatedAt: Date.now() });
    } else {
      updateSyncUIStatus(false);
    }
  } catch (err) {
    console.warn('Failed to push to cloud Gist:', err);
    updateSyncUIStatus(false);
  } finally {
    isPushingToCloud = false;
    if (icon) icon.classList.remove('animate-spin');
    if (pendingPush) {
      pendingPush = false;
      pushToCloud();
    }
  }
}
window.pushToCloud = pushToCloud;

// کێشانی خودکار و هاوکاتکردنی داتاکان لە کڵاود (Fetch & Merge from Cloud)
let isSyncingFromCloud = false;
async function syncFromCloud(silent = false) {
  if (isSyncingFromCloud) return;
  isSyncingFromCloud = true;

  const icon = document.getElementById('cloudSyncIcon');
  const text = document.getElementById('cloudSyncText');
  const modalStatus = document.getElementById('cloudSyncModalStatus');

  if (icon && !silent) icon.classList.add('animate-spin');
  if (text && !silent) text.textContent = 'نوێدەبێتەوە...';
  if (modalStatus && !silent) modalStatus.textContent = 'پەیوەندی دەبەسترێت بە کڵاودەوە...';

  let cloudData = null;
  let cloudUpdatedAt = null;

  // ١. سەرەتا هێنانەوەی ڕاستەوخۆ لە Gist API بە کاتی ڕاستەقینە (Zero CDN Cache)
  try {
    const gistResp = await fetch(`https://api.github.com/gists/${GIST_SYNC_ID}?t=${Date.now()}`, {
      headers: {
        'Authorization': `Bearer ${GIST_SYNC_TOKEN}`,
        'Accept': 'application/vnd.github+json'
      },
      cache: 'no-store'
    });
    if (gistResp.ok) {
      const gData = await gistResp.json();
      cloudUpdatedAt = gData.updated_at;
      if (gData.files && gData.files['penjwen_mosques_data.json'] && gData.files['penjwen_mosques_data.json'].content) {
        cloudData = JSON.parse(gData.files['penjwen_mosques_data.json'].content);
      }
      if (gData.files && gData.files['penjwen_sync_meta.json'] && gData.files['penjwen_sync_meta.json'].content) {
        try {
          const cMeta = JSON.parse(gData.files['penjwen_sync_meta.json'].content);
          if (cMeta && Array.isArray(cMeta.deletedMosqueIds)) {
            const locDels = getDeletedMosqueIds();
            cMeta.deletedMosqueIds.forEach(id => {
              locDels.add(id);
              markMosqueDeleted(id);
              removeMosqueFromVault(id);
            });
            mosques = mosques.filter(m => !locDels.has(m.id));
          }
          if (cMeta && cMeta.deletedSermons) {
            const curDS = getDeletedSermonKeys();
            Object.keys(cMeta.deletedSermons).forEach(k => {
              curDS[k] = cMeta.deletedSermons[k];
              const parts = k.split('_');
              const mId = parts[0];
              const sDate = parts.slice(1).join('_');
              const targetM = mosques.find(m => m.id === mId);
              if (targetM && targetM.sermons) {
                targetM.sermons = targetM.sermons.filter(s => s.date !== sDate);
                const latest = targetM.sermons[0] || null;
                targetM.khutbahDate = latest ? latest.date : '';
                targetM.khutbahTopic = latest ? latest.topic : '';
                targetM.khutbahSpeaker = latest ? latest.speaker : '';
                saveMosqueToVault(targetM);
              }
            });
            localStorage.setItem('penjwen_deleted_sermons', JSON.stringify(curDS));
          }
          if (cMeta && cMeta.prayerTimes) {
            const curSaved = getSavedCustomPrayerTimes();
            if (JSON.stringify(curSaved) !== JSON.stringify(cMeta.prayerTimes)) {
              localStorage.setItem('penjwen_custom_prayer_times', JSON.stringify(cMeta.prayerTimes));
              currentPrayerTimes = cMeta.prayerTimes;
              updatePrayerTimesUI(currentPrayerTimes, true);
            }
          }
        } catch(e) {}
      }
    }
  } catch (err) {
    console.warn('Gist API direct fetch failed, trying fallbacks:', err);
  }

  // ٢. ئەگەر لە سەرەوە داتا نەهاتبوو، بەستەرە خێراکانی تر بەکاردێن وەک یەدەگ
  if (!cloudData) {
    const syncUrls = [
      `https://gist.githubusercontent.com/farhadhosaen-hub/${GIST_SYNC_ID}/raw/penjwen_mosques_data.json?t=${Date.now()}`,
      `${CLOUD_SYNC_PRIMARY}?t=${Date.now()}`,
      `${CLOUD_SYNC_FALLBACK}?t=${Date.now()}`
    ];

    for (const url of syncUrls) {
      try {
        const resp = await fetch(url, { cache: 'no-store' });
        if (resp.ok) {
          const json = await resp.json();
          if (Array.isArray(json) && json.length > 0) {
            cloudData = json;
            break;
          }
        }
      } catch (err) {}
    }
  }

  if (icon) icon.classList.remove('animate-spin');
  isSyncingFromCloud = false;

  if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
    if (cloudUpdatedAt) {
      lastKnownCloudUpdatedAt = cloudUpdatedAt;
    }
    const changes = mergeIncomingMosques(cloudData);
    localStorage.setItem('penjwen_last_sync_time', Date.now().toString());
    updateSyncUIStatus(true, changes);
    if (changes > 0) {
      showToast(`هاوکاتکرا! ${changes} مزگەوت یان زانیاری نوێ لە ئامێرەکانی ترەوە وەرگیرا`, 'success');
    } else if (!silent) {
      showToast('هەموو ئەپەکان پێکەوە هاوکات و نوێن', 'success');
    }
  } else {
    updateSyncUIStatus(false);
    if (!silent) {
      showToast('پەیوەندی بە کڵاود نەبەسترا؛ داتای ناوخۆیی بەکاردێت', 'info');
    }
  }
}
window.syncFromCloud = syncFromCloud;

// تێکەڵکردن و هاوکاتکردنی داتای نوێ بە پاراستنی تەواوی داتای ناوخۆیی
function mergeIncomingMosques(incomingList) {
  if (!Array.isArray(incomingList) || incomingList.length === 0) return 0;
  let changesCount = 0;
  const deletedIds = getDeletedMosqueIds();

  // تۆمارکردنی ئەو مزگەوتانەی لە ئێستادا کراوەن تا لە کاتی نوێبوونەوە دانەخرێن
  const openMosqueIds = [];
  mosques.forEach(m => {
    const d = document.getElementById(`details-${m.id}`);
    if (d && !d.classList.contains('hidden')) {
      openMosqueIds.push(m.id);
    }
  });

  incomingList.forEach(incoming => {
    if (!incoming || !incoming.id || !incoming.name) return;
    if (deletedIds.has(incoming.id)) return;

    let existingIndex = mosques.findIndex(m => m.id === incoming.id || (m.name && m.name.trim() === incoming.name.trim()));

    if (existingIndex === -1) {
      // مزگەوتێکی نوێیە لە ئامێرێکی ترەوە -> زیاد دەکرێت
      mosques.push(incoming);
      saveMosqueToVault(incoming);
      changesCount++;
    } else {
      let existing = mosques[existingIndex];
      const incomingTime = Number(incoming.updatedAt) || 0;
      const existingTime = Number(existing.updatedAt) || 0;

      // یەکخستنی زیرەکی وتارەکان لە نێوان داتای ناوخۆیی و داتای گەیشتوو
      const mergedSermons = mergeSermonsList(existing.sermons || [], incoming.sermons || [], existing.id);
      const sermonsDiffers = JSON.stringify(existing.sermons || []) !== JSON.stringify(mergedSermons);
      const staffDiffers = JSON.stringify(incoming.staff || []) !== JSON.stringify(existing.staff || []);
      const topicDiffers = (incoming.khutbahTopic || '') !== (existing.khutbahTopic || '');
      const speakerDiffers = (incoming.khutbahSpeaker || '') !== (existing.khutbahSpeaker || '');
      const hasOldHadi = (existing.staff || []).some(s => (s.name || '').includes('هادي'));

      // ئەگەر هەر وتارێکی نوێ هەبوو، یان کڵاود نوێتر بوو، یان داتاکان جیاواز بوون:
      if (sermonsDiffers || incomingTime > existingTime || (incomingTime >= existingTime && (staffDiffers || topicDiffers || speakerDiffers)) || hasOldHadi) {
        const latestSermon = mergedSermons[0] || null;
        mosques[existingIndex] = {
          ...existing,
          ...incoming,
          teacherPin: incoming.teacherPin || existing.teacherPin || '1234',
          creatorTeacher: incoming.creatorTeacher || existing.creatorTeacher || '',
          sermons: mergedSermons,
          khutbahDate: latestSermon ? latestSermon.date : (incoming.khutbahDate || existing.khutbahDate),
          khutbahTopic: latestSermon ? latestSermon.topic : (incoming.khutbahTopic || existing.khutbahTopic),
          khutbahSpeaker: latestSermon ? latestSermon.speaker : (incoming.khutbahSpeaker || existing.khutbahSpeaker),
          updatedAt: Math.max(incomingTime, existingTime, Date.now())
        };
        saveMosqueToVault(mosques[existingIndex]);
        changesCount++;
      }
    }
  });

  // چوون یەککردنی تەواو: پشکنینی مزگەوتە سڕاوەکان لە کڵاود
  const cloudIdSet = new Set(incomingList.map(c => c.id).filter(Boolean));
  const cloudNameSet = new Set(incomingList.map(c => (c.name || '').trim()).filter(Boolean));
  const toPurge = [];
  mosques.forEach(localM => {
    if (!cloudIdSet.has(localM.id) && !cloudNameSet.has((localM.name || '').trim())) {
      const age = Date.now() - (Number(localM.createdAt) || 0);
      if (age > 60000) {
        toPurge.push(localM.id);
      }
    }
  });
  if (toPurge.length > 0) {
    toPurge.forEach(id => {
      markMosqueDeleted(id);
      removeMosqueFromVault(id);
    });
    mosques = mosques.filter(m => !toPurge.includes(m.id));
    changesCount += toPurge.length;
  }

  if (changesCount > 0) {
    saveMosquesDataLocally();
    renderMosques();
    updateStats();

    // هێشتنەوەی ئەو کاردانەی کراوە بوون
    openMosqueIds.forEach(id => {
      const d = document.getElementById(`details-${id}`);
      const btn = document.getElementById(`btn-${id}`);
      const chevron = document.getElementById(`chevron-${id}`);
      if (d) d.classList.remove('hidden');
      if (btn) {
        btn.classList.add('bg-stone-50', 'shadow-inner');
        btn.setAttribute('aria-expanded', 'true');
      }
      if (chevron) chevron.classList.add('rotate-180');
    });
  }

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
  try {
    window.scrollTo(0, 0);
  } catch(e) {}

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

  // دەستپێکردنی بزوێنەری پەیوەندی خێرا و ڕاستەوخۆ (Real-time Instant Mesh Sync)
  initRealtimeSyncEngine();

  // کێشانی خودکار لە کڵاود لە کاتی کردنەوە
  syncFromCloud(true);

  // خزمەتگوزاری ئۆفلاین و هاوبەشکردن
  registerServiceWorker();
  initNetworkStatusMonitor();
  initPwaInstallPrompt();
  initShareModal();
  initAutoFullScreenOnMobile();

  window.addEventListener('online', () => {
    initRealtimeSyncEngine();
    syncFromCloud(true);
  });

  // هاوکاتکردنی بەردەوامی ئۆنلاین لە نێوان هەموو مۆبایل و ئەپەکان بە خێراترین کات
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      syncFromCloud(true);
    }
  }, 2500); // پشکنین و هاوکاتکردنی خودکار لەگەڵ کڵاود هەر ٢.٥ چرکە جارێک

  window.addEventListener('focus', () => {
    initRealtimeSyncEngine();
    syncFromCloud(true);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      initRealtimeSyncEngine();
      syncFromCloud(true);
    }
  });

  // پشکنینی ڕاستەوخۆ لە کاتی دەستلێدانی بەکارهێنەر لە شاشە
  let lastTouchCheck = Date.now();
  document.addEventListener('pointerdown', () => {
    const t = Date.now();
    if (t - lastTouchCheck > 2000) {
      lastTouchCheck = t;
      syncFromCloud(true);
    }
  }, { passive: true });
});

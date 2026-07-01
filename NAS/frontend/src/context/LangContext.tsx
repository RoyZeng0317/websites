import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

export interface Translations {
  // App / Login
  appName: string
  loginWith: string
  username: string
  password: string
  loggingIn: string
  loginBtn: string
  // 2FA page
  twoFactor: string
  twoFactorDesc: string
  twoFactorSuffix: string
  verifying: string
  verifyBtn: string
  verifyFailed: string
  backToLogin: string
  // Home
  settingsNav: string
  rootDir: string
  newFolder: string
  uploadFolder: string
  uploadFiles: string
  uploading: string
  dropToUpload: string
  dropSupport: string
  noFiles: string
  dragHere: string
  colName: string
  colModified: string
  colSize: string
  detailsBtn: string
  shareBtn: string
  deleteBtn: string
  loadFailed: string
  uploadDone: string
  uploadFailed: string
  deleteDone: string
  deleteFailed: string
  folderCreated: string
  folderCreateFailed: string
  folderNamePrompt: string
  confirmDelete: (name: string) => string
  sortAsc: string
  sortDesc: string
  // Settings
  settingsTitle: string
  backBtn: string
  accountLabel: string
  roleLabel: string
  roleAdmin: string
  roleUser: string
  changePassword: string
  curPwd: string
  newPwd: string
  confirmPwd: string
  pwdMismatch: string
  pwdUpdated: string
  updatingPwd: string
  updatePwdBtn: string
  updateFailed: string
  tfSetting: string
  tfEnabled: string
  tfDisabled: string
  tfSetupTitle: string
  tfStep1: string
  tfStep2: string
  tfStep3: string
  tfStep4: string
  enabling: string
  enableTfBtn: string
  tfEnabledMsg: string
  disableTfBtn: string
  disabling: string
  tfDisabledMsg: string
  disableHint: string
  enableFailed: string
  disableFailed: string
  adminUsers: string
  systemSettings: string
  signOut: string
  language: string
  langZh: string
  langEn: string
  // Sidebar
  sidebarQuickAccess: string
  sidebarExtDrives: string
  sidebarNoDrives: string
  sidebarDownloads: string
  sidebarDesktop: string
  sidebarDocuments: string
  sidebarPictures: string
  sidebarMusic: string
  sidebarVideos: string
  openVSCode: string
  // FileDetailPanel
  fileInfo: string
  typeLabel: string
  sizeLabel: string
  modifiedLabel: string
  pathLabel: string
  downloadBtn: string
  catFolder: string
  catImage: string
  catVideo: string
  catAudio: string
  catPdf: string
  catDoc: string
  catSheet: string
  catSlide: string
  catArchive: string
  catCode: string
  catText: string
  catOther: string
  // ShareDialog
  shareTitle: string
  createShareTab: string
  manageShareTab: (n: number) => string
  accessPerm: string
  permView: string
  permDownload: string
  permEdit: string
  descView: string
  descDownload: string
  descEditFolder: string
  descEditFile: string
  pwdProtect: string
  enterSharePwd: string
  oneTime: string
  expiry: string
  expNever: string
  exp1d: string
  exp3d: string
  exp7d: string
  exp30d: string
  creating: string
  createLinkBtn: string
  linkCreated: string
  copyBtn: string
  copiedBtn: string
  noLinks: string
  revokeBtn: string
  revokeConfirm: string
  revokedMsg: string
  revokeFailed: string
  usedLabel: string
  oneTimeLabel: string
  expiredLabel: string
  expiresOn: (date: string) => string
  createdAt: string
  enterPwdFirst: string
  rename: String
  // File list footer (home.tsx)
  foldersCount: (n: number) => string
  filesCount: (n: number) => string
  itemsSummary: (total: number, parts: string) => string
  selectedOne: (name: string, size: string) => string
  selectedMany: (count: number, parts: string) => string
  listSep: string
  // QuickConnect (login page)
  qcPlaceholder: string
  qcConnect: string
  qcConnecting: string
  qcConnected: (name: string) => string
  qcReset: string
  qcOr: string
  installApp: string
  externalTag: string
  mediaDownloader: string
  deleteSelected: string
  dragToBulkMove: string
  download: string
  dlBestQualityVbr: string
  dlBestVideoQuality: string
  chooseSaveFolder: string
  loadingText: string
  noSubfolders: string
  chooseThisLocation: string
  // Downloader (media downloader window)
  dlStatusPending: string
  dlStatusDone: string
  dlStatusError: string
  cancel: string
  dlCollapse: string
  dlExpandError: string
  dlFillTokenCt0: string
  dlCookieSaved: string
  dlCookieUploaded: string
  dlCookieRemoved: string
  dlUrlLabel: string
  dlUrlPlaceholder: string
  dlFormat: string
  dlFmtVideo: string
  dlFmtAudio: string
  dlFmtImage: string
  dlQuality: string
  dlSaveFolder: string
  dlRootClickToPick: string
  dlClearToRoot: string
  dlNetflixNote: string
  dlNetflixLi1: string
  dlNetflixLi2: string
  dlNetflixLi3: string
  dlAdding: string
  dlStartDownload: string
  dlCookieMgmt: string
  dlCookieSet: string
  dlCookieUnset: string
  dlRemove: string
  dlDouyinUpload: string
  dlDouyinDesc: string
  dlUploading: string
  dlChooseCookieUpload: string
  dlTwitterCookie: string
  dlSaving: string
  dlSaveTwitterCookie: string
  dlTwitterHint: string
  dlHistory: string
  dlRefresh: string
  dlClearDone: string
  dlNoHistory: string
  dlInProgress: string
  dlEnterUrl: string
  dlNetflixNeedCookies: string
  dlAddedToQueue: string
  // Quartus panel
  quartusDownload: string
  quartusDownloadSub: string
  quartusDocs: string
  quartusDocsSub: string
  quartusForum: string
  quartusForumSub: string
  quartusModelsim: string
  quartusModelsimSub: string
  quartusDesignTool: string
  quartusInstallNote: string
  // Quick Folders
  quickFolders: string
  quickFoldersDesc: string
  quickFoldersDone: (n: number) => string
  quickFoldersFail: string
  quickFoldersExist: string
}

const zh: Translations = {
  appName: 'Vaultix NAS',
  loginWith: '使用 NAS 帳號登入',
  username: '帳號',
  password: '密碼',
  loggingIn: '登入中...',
  loginBtn: '登入',
  twoFactor: '二步驗證',
  twoFactorDesc: '請開啟手機 App，解鎖後輸入',
  twoFactorSuffix: '的 6 位數驗證碼',
  verifying: '驗證中…',
  verifyBtn: '確認',
  verifyFailed: '驗證失敗',
  backToLogin: '返回登入',
  settingsNav: '設定',
  rootDir: '根目錄',
  newFolder: '+ 資料夾',
  uploadFolder: '上傳資料夾',
  uploadFiles: '上傳檔案',
  uploading: '上傳中',
  dropToUpload: '放開以上傳',
  dropSupport: '支援檔案與資料夾',
  noFiles: '目前沒有檔案',
  dragHere: '拖曳檔案或資料夾到這裡上傳',
  colName: '名稱',
  colModified: '修改時間',
  colSize: '大小',
  detailsBtn: '詳情',
  shareBtn: '分享',
  deleteBtn: '刪除',
  loadFailed: '載入失敗',
  uploadDone: '上傳完成',
  uploadFailed: '上傳失敗',
  deleteDone: '已刪除',
  deleteFailed: '刪除失敗',
  folderCreated: '資料夾已建立',
  folderCreateFailed: '建立失敗',
  folderNamePrompt: '資料夾名稱',
  confirmDelete: n => `確定要刪除「${n}」？`,
  sortAsc: '遞增',
  sortDesc: '遞減',
  settingsTitle: '設定',
  backBtn: '← 返回',
  accountLabel: '帳號',
  roleLabel: '角色',
  roleAdmin: '管理員',
  roleUser: '使用者',
  changePassword: '修改密碼',
  curPwd: '目前密碼',
  newPwd: '新密碼（至少 8 字元）',
  confirmPwd: '確認新密碼',
  pwdMismatch: '兩次輸入的新密碼不一致',
  pwdUpdated: '密碼已更新！',
  updatingPwd: '更新中…',
  updatePwdBtn: '確認修改',
  updateFailed: '修改失敗',
  tfSetting: '二步驗證 (2FA)',
  tfEnabled: '已啟用',
  tfDisabled: '未啟用',
  tfSetupTitle: '設定步驟：',
  tfStep1: '1. 在手機安裝 Vaultix NAS Authenticator App',
  tfStep2: '2. 開啟 App → 新增帳號 → 輸入 NAS 網址、帳號、密碼',
  tfStep3: '3. App 會顯示 6 位數驗證碼，每 1 分鐘更新',
  tfStep4: '4. 在下方輸入 App 上顯示的驗證碼並按下「啟用」',
  enabling: '啟用中…',
  enableTfBtn: '驗證並啟用',
  tfEnabledMsg: '二步驗證已啟用！',
  disableTfBtn: '確認停用',
  disabling: '停用中…',
  tfDisabledMsg: '二步驗證已停用。',
  disableHint: '輸入 App 上的驗證碼以停用二步驗證：',
  enableFailed: '啟用失敗',
  disableFailed: '停用失敗',
  adminUsers: '使用者管理',
  systemSettings: '系統設定',
  signOut: '登出',
  language: '語言',
  langZh: '繁體中文',
  langEn: 'English',
  sidebarQuickAccess: '快速存取',
  sidebarExtDrives: '外接裝置',
  sidebarNoDrives: '無外接裝置',
  sidebarDownloads: '下載',
  sidebarDesktop: '桌面',
  sidebarDocuments: '文件',
  sidebarPictures: '圖片',
  sidebarMusic: '音樂',
  sidebarVideos: '影片',
  openVSCode: '開啟 VS Code',
  fileInfo: '檔案資訊',
  typeLabel: '類型',
  sizeLabel: '大小',
  modifiedLabel: '修改時間',
  pathLabel: '路徑',
  downloadBtn: '下載',
  catFolder: '資料夾',
  catImage: '圖片',
  catVideo: '影片',
  catAudio: '音訊',
  catPdf: 'PDF 文件',
  catDoc: 'Word 文件',
  catSheet: '試算表',
  catSlide: '簡報',
  catArchive: '壓縮檔',
  catCode: '程式碼',
  catText: '文字檔',
  catOther: '檔案',
  shareTitle: '分享',
  createShareTab: '建立新分享',
  manageShareTab: n => `管理分享（${n}）`,
  accessPerm: '存取權限',
  permView: '僅查看',
  permDownload: '僅下載',
  permEdit: '可編輯',
  descView: '只能瀏覽，無法下載或上傳',
  descDownload: '可以下載檔案，無法上傳',
  descEditFolder: '可以上傳、下載及瀏覽',
  descEditFile: '可以下載',
  pwdProtect: '設定密碼保護',
  enterSharePwd: '輸入分享密碼',
  oneTime: '一次性（使用後立即失效）',
  expiry: '有效期限',
  expNever: '永不過期',
  exp1d: '1 天',
  exp3d: '3 天',
  exp7d: '7 天',
  exp30d: '30 天',
  creating: '建立中…',
  createLinkBtn: '建立分享連結',
  linkCreated: '✓ 分享連結已建立',
  copyBtn: '複製',
  copiedBtn: '✓ 已複製',
  noLinks: '此檔案尚無分享連結',
  revokeBtn: '撤銷',
  revokeConfirm: '確定要撤銷這個分享連結？',
  revokedMsg: '已撤銷',
  revokeFailed: '撤銷失敗',
  usedLabel: '已使用',
  oneTimeLabel: '一次性',
  expiredLabel: '已過期',
  expiresOn: d => `${d} 到期`,
  createdAt: '建立於',
  enterPwdFirst: '請輸入密碼',
  rename: "重命名",
  foldersCount: n => `${n} 個資料夾`,
  filesCount: n => `${n} 個檔案`,
  itemsSummary: (total, parts) => `共 ${total} 個項目（${parts}）`,
  selectedOne: (name, size) => `已選取 1 個項目：${name}${size ? `（${size}）` : ''}`,
  selectedMany: (count, parts) => `已選取 ${count} 個項目（${parts}）`,
  listSep: '、',
  qcPlaceholder: '輸入 Vaultix ID 連線',
  qcConnect: '連線',
  qcConnecting: '連線中…',
  qcConnected: name => `已連線至 ${name}`,
  qcReset: '改用其他 ID',
  qcOr: '或使用帳號密碼登入',
  installApp: '安裝 App',
  externalTag: '外接',
  mediaDownloader: '媒體下載器',
  deleteSelected: '刪除選取項目',
  dragToBulkMove: '拖曳到資料夾可批量移動',
  download: '下載',
  dlBestQualityVbr: '最佳品質 (VBR)',
  dlBestVideoQuality: '最佳畫質',
  chooseSaveFolder: '選擇儲存資料夾',
  loadingText: '載入中...',
  noSubfolders: '無子資料夾',
  chooseThisLocation: '選擇此位置：',
  dlStatusPending: '等待中',
  dlStatusDone: '完成',
  dlStatusError: '失敗',
  cancel: '取消',
  dlCollapse: '收起',
  dlExpandError: '展開錯誤訊息',
  dlFillTokenCt0: '請同時填入 auth_token 與 ct0',
  dlCookieSaved: 'Cookie 已儲存',
  dlCookieUploaded: 'cookies.txt 已上傳',
  dlCookieRemoved: 'Cookie 已移除',
  dlUrlLabel: '影片 / 音樂網址',
  dlUrlPlaceholder: '貼上網址或抖音 / TikTok 分享文字，自動擷取連結',
  dlFormat: '格式',
  dlFmtVideo: '影片',
  dlFmtAudio: '音訊',
  dlFmtImage: '圖片',
  dlQuality: '品質',
  dlSaveFolder: '儲存資料夾',
  dlRootClickToPick: '根目錄（點擊選擇資料夾）',
  dlClearToRoot: '清除（存至根目錄）',
  dlNetflixNote: 'Netflix 注意事項',
  dlNetflixLi1: '需上傳 cookies.txt（瀏覽器登入 Netflix 後用 Get cookies.txt LOCALLY 匯出）',
  dlNetflixLi2: 'DRM 限制，最高僅能下載 540p',
  dlNetflixLi3: 'Pi 上的 yt-dlp 需為最新版（pip install -U yt-dlp）',
  dlAdding: '加入中...',
  dlStartDownload: '開始下載',
  dlCookieMgmt: 'Cookie 管理',
  dlCookieSet: 'cookies.txt 已設定',
  dlCookieUnset: '未設定',
  dlRemove: '移除',
  dlDouyinUpload: '抖音 / 通用 cookies.txt 上傳',
  dlDouyinDesc: '適用抖音、YouTube 等需要 Cookie 的平台。使用瀏覽器擴充功能「Get cookies.txt LOCALLY」匯出後上傳。',
  dlUploading: '上傳中...',
  dlChooseCookieUpload: '選擇 cookies.txt 上傳',
  dlTwitterCookie: 'Twitter / X Cookie（手動輸入）',
  dlSaving: '儲存中...',
  dlSaveTwitterCookie: '儲存 Twitter Cookie',
  dlTwitterHint: 'F12 → Application → Cookies → x.com，複製 auth_token 與 ct0',
  dlHistory: '下載記錄',
  dlRefresh: '重新整理',
  dlClearDone: '清除已完成',
  dlNoHistory: '尚無下載記錄',
  dlInProgress: '個進行中',
  dlEnterUrl: '請輸入 URL',
  dlNetflixNeedCookies: 'Netflix 需要 cookies 才能下載。請先登入 Netflix → 用 Get cookies.txt LOCALLY 匯出 → 上傳',
  dlAddedToQueue: '已加入下載佇列',
  quartusDownload: 'Quartus Prime 下載',
  quartusDownloadSub: 'intel.com — 下載 Lite / Standard / Pro 版本',
  quartusDocs: 'Intel FPGA 文件中心',
  quartusDocsSub: 'intel.com — Quartus 使用手冊 & 技術文件',
  quartusForum: 'Intel FPGA 社群論壇',
  quartusForumSub: 'community.intel.com — 技術支援 & 討論',
  quartusModelsim: 'ModelSim 模擬器',
  quartusModelsimSub: 'intel.com — FPGA 功能模擬工具',
  quartusDesignTool: 'FPGA / CPLD 設計工具',
  quartusInstallNote: 'Quartus Prime 需在本機安裝，點擊連結前往官網下載',
  quickFolders: '快速建立資料夾',
  quickFoldersDesc: '點擊即可在目前目錄建立常用資料夾',
  quickFoldersDone: (n: any) => `已建立 ${n} 個資料夾`,
  quickFoldersFail: '部分資料夾建立失敗',
  quickFoldersExist: '（已存在的跳過）',
}

const en: Translations = {
  appName: 'Vaultix NAS',
  loginWith: 'Sign in with your NAS account',
  username: 'Username',
  password: 'Password',
  loggingIn: 'Signing in...',
  loginBtn: 'Sign In',
  twoFactor: 'Two-Factor Auth',
  twoFactorDesc: 'Open the mobile app, unlock, then enter',
  twoFactorSuffix: "'s 6-digit verification code",
  verifying: 'Verifying…',
  verifyBtn: 'Confirm',
  verifyFailed: 'Verification failed',
  backToLogin: 'Back to Sign In',
  settingsNav: 'Settings',
  rootDir: 'Root',
  newFolder: '+ Folder',
  uploadFolder: 'Upload Folder',
  uploadFiles: 'Upload Files',
  uploading: 'Uploading',
  dropToUpload: 'Drop to upload',
  dropSupport: 'Files and folders supported',
  noFiles: 'No files here',
  dragHere: 'Drag files or folders here to upload',
  colName: 'Name',
  colModified: 'Modified',
  colSize: 'Size',
  detailsBtn: 'Details',
  shareBtn: 'Share',
  deleteBtn: 'Delete',
  loadFailed: 'Failed to load',
  uploadDone: 'Upload complete',
  uploadFailed: 'Upload failed',
  deleteDone: 'Deleted',
  deleteFailed: 'Delete failed',
  folderCreated: 'Folder created',
  folderCreateFailed: 'Create failed',
  folderNamePrompt: 'Folder name',
  confirmDelete: n => `Delete "${n}"?`,
  sortAsc: 'Ascending',
  sortDesc: 'Descending',
  settingsTitle: 'Settings',
  backBtn: '← Back',
  accountLabel: 'Account',
  roleLabel: 'Role',
  roleAdmin: 'Admin',
  roleUser: 'User',
  changePassword: 'Change Password',
  curPwd: 'Current password',
  newPwd: 'New password (min. 8 chars)',
  confirmPwd: 'Confirm new password',
  pwdMismatch: 'Passwords do not match',
  pwdUpdated: 'Password updated!',
  updatingPwd: 'Updating…',
  updatePwdBtn: 'Update Password',
  updateFailed: 'Update failed',
  tfSetting: 'Two-Factor Auth (2FA)',
  tfEnabled: 'Enabled',
  tfDisabled: 'Disabled',
  tfSetupTitle: 'Setup steps:',
  tfStep1: '1. Install Vaultix NAS Authenticator on your phone',
  tfStep2: '2. Open App → Add account → Enter NAS URL, username, password',
  tfStep3: '3. App shows a 6-digit code, refreshes every minute',
  tfStep4: '4. Enter the code below and tap "Enable"',
  enabling: 'Enabling…',
  enableTfBtn: 'Verify & Enable',
  tfEnabledMsg: 'Two-factor auth enabled!',
  disableTfBtn: 'Confirm Disable',
  disabling: 'Disabling…',
  tfDisabledMsg: 'Two-factor auth disabled.',
  disableHint: 'Enter the app code to disable 2FA:',
  enableFailed: 'Enable failed',
  disableFailed: 'Disable failed',
  adminUsers: 'User Management',
  systemSettings: 'System Settings',
  signOut: 'Sign Out',
  language: 'Language',
  langZh: '繁體中文',
  langEn: 'English',
  sidebarQuickAccess: 'Quick Access',
  sidebarExtDrives: 'External Drives',
  sidebarNoDrives: 'No external drives',
  sidebarDownloads: 'Downloads',
  sidebarDesktop: 'Desktop',
  sidebarDocuments: 'Documents',
  sidebarPictures: 'Pictures',
  sidebarMusic: 'Music',
  sidebarVideos: 'Videos',
  openVSCode: 'Open VS Code',
  fileInfo: 'File Info',
  typeLabel: 'Type',
  sizeLabel: 'Size',
  modifiedLabel: 'Modified',
  pathLabel: 'Path',
  downloadBtn: 'Download',
  catFolder: 'Folder',
  catImage: 'Image',
  catVideo: 'Video',
  catAudio: 'Audio',
  catPdf: 'PDF Document',
  catDoc: 'Word Document',
  catSheet: 'Spreadsheet',
  catSlide: 'Presentation',
  catArchive: 'Archive',
  catCode: 'Source Code',
  catText: 'Text File',
  catOther: 'File',
  shareTitle: 'Share',
  createShareTab: 'Create Link',
  manageShareTab: n => `Manage Links (${n})`,
  accessPerm: 'Access Permission',
  permView: 'View only',
  permDownload: 'Download only',
  permEdit: 'Editable',
  descView: 'Browse only, no download or upload',
  descDownload: 'Can download, no upload',
  descEditFolder: 'Can upload, download and browse',
  descEditFile: 'Can download',
  pwdProtect: 'Password protect',
  enterSharePwd: 'Enter share password',
  oneTime: 'One-time (expires after first use)',
  expiry: 'Expiry',
  expNever: 'Never',
  exp1d: '1 day',
  exp3d: '3 days',
  exp7d: '7 days',
  exp30d: '30 days',
  creating: 'Creating…',
  createLinkBtn: 'Create Share Link',
  linkCreated: '✓ Share link created',
  copyBtn: 'Copy',
  copiedBtn: '✓ Copied',
  noLinks: 'No share links for this file',
  revokeBtn: 'Revoke',
  revokeConfirm: 'Revoke this share link?',
  revokedMsg: 'Revoked',
  revokeFailed: 'Revoke failed',
  usedLabel: 'Used',
  oneTimeLabel: 'One-time',
  expiredLabel: 'Expired',
  expiresOn: d => `Expires ${d}`,
  createdAt: 'Created',
  enterPwdFirst: 'Please enter a password',
  rename: "Rename",
  foldersCount: n => `${n} ${n === 1 ? 'folder' : 'folders'}`,
  filesCount: n => `${n} ${n === 1 ? 'file' : 'files'}`,
  itemsSummary: (total, parts) => `${total} ${total === 1 ? 'item' : 'items'} (${parts})`,
  selectedOne: (name, size) => `1 selected: ${name}${size ? ` (${size})` : ''}`,
  selectedMany: (count, parts) => `${count} selected (${parts})`,
  listSep: ', ',
  qcPlaceholder: 'Enter Vaultix ID to connect',
  qcConnect: 'Connect',
  qcConnecting: 'Connecting…',
  qcConnected: name => `Connected to ${name}`,
  qcReset: 'Use another ID',
  qcOr: 'or sign in with account',
  installApp: 'Install App',
  externalTag: 'External',
  mediaDownloader: 'Media Downloader',
  deleteSelected: 'Delete selected',
  dragToBulkMove: 'Drag onto a folder to move in bulk',
  download: 'Download',
  dlBestQualityVbr: 'Best quality (VBR)',
  dlBestVideoQuality: 'Best quality',
  chooseSaveFolder: 'Choose save folder',
  loadingText: 'Loading...',
  noSubfolders: 'No subfolders',
  chooseThisLocation: 'Select this location: ',
  dlStatusPending: 'Pending',
  dlStatusDone: 'Done',
  dlStatusError: 'Failed',
  cancel: 'Cancel',
  dlCollapse: 'Collapse',
  dlExpandError: 'Show error log',
  dlFillTokenCt0: 'Please fill in both auth_token and ct0',
  dlCookieSaved: 'Cookie saved',
  dlCookieUploaded: 'cookies.txt uploaded',
  dlCookieRemoved: 'Cookie removed',
  dlUrlLabel: 'Video / Audio URL',
  dlUrlPlaceholder: 'Paste a URL or Douyin / TikTok share text — links are auto-extracted',
  dlFormat: 'Format',
  dlFmtVideo: 'Video',
  dlFmtAudio: 'Audio',
  dlFmtImage: 'Image',
  dlQuality: 'Quality',
  dlSaveFolder: 'Save folder',
  dlRootClickToPick: 'Root (click to choose a folder)',
  dlClearToRoot: 'Clear (save to root)',
  dlNetflixNote: 'Netflix notes',
  dlNetflixLi1: 'Upload cookies.txt (log in to Netflix in your browser, then export with “Get cookies.txt LOCALLY”)',
  dlNetflixLi2: 'DRM-limited — 540p max',
  dlNetflixLi3: 'yt-dlp on the Pi must be up to date (pip install -U yt-dlp)',
  dlAdding: 'Adding...',
  dlStartDownload: 'Start download',
  dlCookieMgmt: 'Cookie management',
  dlCookieSet: 'cookies.txt set',
  dlCookieUnset: 'Not set',
  dlRemove: 'Remove',
  dlDouyinUpload: 'Douyin / generic cookies.txt upload',
  dlDouyinDesc: 'For Douyin, YouTube and other sites that need cookies. Export with the “Get cookies.txt LOCALLY” browser extension, then upload.',
  dlUploading: 'Uploading...',
  dlChooseCookieUpload: 'Choose cookies.txt to upload',
  dlTwitterCookie: 'Twitter / X Cookie (manual)',
  dlSaving: 'Saving...',
  dlSaveTwitterCookie: 'Save Twitter Cookie',
  dlTwitterHint: 'F12 → Application → Cookies → x.com, copy auth_token and ct0',
  dlHistory: 'Download history',
  dlRefresh: 'Refresh',
  dlClearDone: 'Clear completed',
  dlNoHistory: 'No download history yet',
  dlInProgress: 'in progress',
  dlEnterUrl: 'Please enter a URL',
  dlNetflixNeedCookies: 'Netflix needs cookies to download. Log in to Netflix → export with “Get cookies.txt LOCALLY” → upload.',
  dlAddedToQueue: 'Added to download queue',
  quartusDownload: 'Quartus Prime Download',
  quartusDownloadSub: 'intel.com — download Lite / Standard / Pro editions',
  quartusDocs: 'Intel FPGA Documentation',
  quartusDocsSub: 'intel.com — Quartus manuals & technical docs',
  quartusForum: 'Intel FPGA Community Forum',
  quartusForumSub: 'community.intel.com — support & discussion',
  quartusModelsim: 'ModelSim Simulator',
  quartusModelsimSub: 'intel.com — FPGA functional simulation tool',
  quartusDesignTool: 'FPGA / CPLD design tool',
  quartusInstallNote: 'Quartus Prime must be installed locally — click a link to download from the official site',
  quickFolders: 'Quick Create Folders',
  quickFoldersDesc: 'Click to create common folders in the current directory',
  quickFoldersDone: (n: any) => `Created ${n} folder(s)`,
  quickFoldersFail: 'Some folders could not be created',
  quickFoldersExist: '(existing ones skipped)',
}

const DICT: Record<Lang, Translations> = { zh, en }

interface LangCtx { lang: Lang; t: Translations; setLang: (l: Lang) => void }

const LangContext = createContext<LangCtx>({ lang: 'zh', t: zh, setLang: () => {} })

function detectLang(): Lang {
  const stored = localStorage.getItem('nas_lang')
  if (stored === 'zh' || stored === 'en') return stored
  return navigator.language.startsWith('zh') ? 'zh' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('nas_lang', l)
  }

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en'
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, t: DICT[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() { return useContext(LangContext) }

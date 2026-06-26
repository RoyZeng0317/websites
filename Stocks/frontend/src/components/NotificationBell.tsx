import { useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'warning' | 'info' | 'success'
  icon: string
  message: string
  time: string
}

const NOTIFICATIONS: Notification[] = [
  /*
  {
    id: '1',
    type: 'warning',
    icon: '\u26A0',
    message: '05/30(六) 00:00-12:00 將進行平台維護作業，各項功能將暫停使用。造成不便，敬請見諒。',
    time: '系統通知',
  },
  */
  {
    id: '2',
    type: 'info',
    icon: '\u2139',
    message: 'AI 諮詢功能的對話有限，如需更多完整股票建議，需要付費諮詢。其他功能目前持續免費使用。',
    time: '系統通知',
  },
  {
    id: '3',
    type: 'success',
    icon: '\u2714',
    message: '即時報價功能已全面升級，支援美股、台股、港股即時股價更新。',
    time: '系統通知',
  },
  {
    id: '3',
    type: 'info',
    icon: '\u2139',
    message: '親愛的用戶您好，06/27(六)將進行系統伺服器維護，各項功能將暫停使用，維護時間為:  10:00-14:00，網路應用與手機應用皆屬暫停使用，造成您的不便敬請見諒',
    time: '系統通知',
  },
  {
    id: '4',
    type: 'success',
    icon: '\u2714',
    message: '新版功能上線啦!台股即時盤面有即時漲跌資訊，點選後可進入查看詳細股票資訊，讓你一眼就能看見!有任何問題，歡迎點擊下方信件icon進行發問',
    time: '系統通知',
  },
  {
    id: '5',
    type: 'success',
    icon: '\u2714',
    message: '新版功能上線啦!台股、美股與港股的新聞將每日更新，點選市場快訊按鈕查看今日市場走勢!',
    time: '系統通知'
  }
]

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('notifReadIds') || '[]'))
    } catch {
      return new Set<string>()
    }
  })

  useEffect(() => {
    localStorage.setItem('notifReadIds', JSON.stringify([...readIds]))
  }, [readIds])

  const unread = NOTIFICATIONS.filter((n) => !readIds.has(n.id))

  function markAllRead() {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)))
  }

  function markRead(id: string) {
    const next = new Set(readIds)
    next.add(id)
    setReadIds(next)
  }

  return (
    <>
      <button
        type="button"
        className="notif-bell-btn"
        onClick={() => setOpen(true)}
        aria-label="通知"
      >
        <i className="fa-regular fa-bell" />
        {unread.length > 0 && (
          <span className="notif-badge">{unread.length}</span>
        )}
      </button>

      {open && (
        <div
          className="notif-overlay open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="notif-window">
            <div className="notif-header">
              <h2>通知</h2>
              <button onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="notif-body">
              {unread.length > 0 && (
                <button
                  className="notif-mark-all-read"
                  onClick={markAllRead}
                  type="button"
                >
                  全部已讀
                </button>
              )}
              {NOTIFICATIONS.map((n) => {
                const isRead = readIds.has(n.id)
                return (
                  <div
                    key={n.id}
                    className={`notif-item ${n.type} ${isRead ? 'notif-read' : ''}`}
                  >
                    <span className="icon">{n.icon}</span>
                    <div className="msg">
                      <p>{n.message}</p>
                      <span className="time">{n.time}</span>
                    </div>
                    {!isRead && (
                      <button
                        className="notif-mark-read"
                        onClick={() => markRead(n.id)}
                        type="button"
                        title="標記已讀"
                      >
                        <i className="fa-regular fa-circle-check" />
                      </button>
                    )}
                  </div>
                )
              })}
              {NOTIFICATIONS.length === 0 && (
                <div className="notif-empty">目前沒有通知</div>
              )}
            </div>
          </div>
        </div>
      )}

      {open && (
        <div
          className="notif-overlay-bg"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

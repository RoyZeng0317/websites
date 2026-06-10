import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'

const PRIVACY_POLICY = `Velix 隱私權政策

01. 本隱私權政策適用於使用者使用本平台網站、應用程式及相關服務時所涉及之個人資料蒐集、處理及利用行為

02. 為確保本平台僅供年滿十八歲之使用者使用，本平台可能要求使用者提供政府核發之身分證明文件進行年齡驗證。
    使用者於上傳時須於文件上註明「僅供velix平台註冊驗證使用」，未依規定加註者，本平台得退回申請或拒絕完成註冊程序。
    經過驗證審核通過後，將於驗證後三天內刪除。
    身分驗證將不提供給第三方服務。
    使用者可根據是否使用本服務決定提供資料與否。

03. 我們蒐集以下資料
    1. 帳戶資料
       (1) 使用者名稱
       (2) 電子郵件地址
       (3) 密碼
       (4) 個人簡介
       (5) 頭貼
       (6) 個人身分資料
    2. 使用紀錄
       (1) 發文內容
       (2) 留言內容
       (3) 按讚紀錄
       (4) 追蹤關係
       (5) 搜尋紀錄
    3. 裝置與技術資訊
       (1) 瀏覽器類型
       (2) IP 位址
       (3) 作業系統
       (4) 裝置識別碼
       (5) 登入時間
    4. Cookie 與分析資料
       (1) Cookie
       (2) Firebase Analytics
       (3) Crashlytics
       (4) 使用行為統計

04. 蒐集資料用途
    (1) 提供平台服務
    (2) 維護帳戶安全
    (3) 防止詐騙與濫用
    (4) 改善使用體驗
    (5) 推薦內容
    (6) 產生統計分析
    (7) 回復客服問題
    (8) 年齡驗證及防止冒用身分

05. 第三方服務
    (1) Firebase
    (2) Firestore
    (3) Google Analytics
    (4) Google Sign-In
    (5) Cloudinary

06. Cookie 政策
    (1) 平台會使用 Cookie
    (2) 紀錄登入狀態
    (3) 改善使用體驗
    (4) 分析流量

07. 資料分享原則
    除法律要求、司法機關命令或使用者同意外，本平台不會出售、出租或任意提供使用者個人資料予第三人

08. 資料儲存期限
    使用者刪除帳號後，部分資料可能因備份、法律義務或爭議處理需要而暫時保留

09. 使用者權限
    (1) 查詢資料
    (2) 更正資料
    (3) 刪除資料
    (4) 撤回同意
    (5) 停止帳號使用

10. 未成年使用者
    未滿法定年齡 18 歲者無法使用本服務

11. 資料安全
    (1) E2E 加密技術
    (2) 不可逆雜湊 (Hash) 方式儲存
    (3) 權限控管
    (4) 防火牆
    (5) 定期安全更新

12. 隱私權政策修改
    本平台得視需要修訂本政策，更新後將公告於網站通知欄與應用程式內

13. 聯絡方式
    客服信箱：velix.help@gmail.com`;

const CONTENT_RULES = `velix 平台社群規範
01. 平台得透過自動化系統及人工審核方式進行審查，並得依社群規範限制、下架或移除相關內容
02. 平台內容嚴禁上傳使用ai製作如電影解說、課程教學內容、兒童卡通等影片內容，否則將被判為違反平台規定，凍結用戶
03. 請勿在velix上上傳、發布、展示或公開以下內容:
      01. 顯示、包含或提及:
          01. 任何18歲以下或個人(或一般提及18以下的個人)之性暗示影像、圖片或錄音檔
          02. 除非您您有書面文件證明您的內容中顯示、包含或提及的所有個人須滿18歲，且您已獲得每個個人書面同意書使用他們的名字或圖像(或兩者)在內容中
      02. 發布、推播廣告或提及:
          01. 槍械、刀具、武器或任何其銷售、擁有或使用受到禁止或限制的商品
          02. 藥物或藥物工具
          03. 自殘或自殺
          04. 近親相姦
          05. 與動物發生性行為
          06. 暴力、強姦、無同意、催眠、醉酒、性侵、折磨、虐待或硬核束腹、極端插拳或生殖器殘害
          07. 戀屍
          08. 與尿液、糞便或排泄物相關的材料(包含將其馬賽克)
          09. "復仇色情"(即未經事先、明確和充分知情同意的任何人的性暴露材料(a)被拍攝、捕捉或以其他方式記錄，或(b)在velix上被發布和分享
          10. 性交易或賣淫
04. 上傳內容是屬於色情影片請分類到色情影片類別，一般日常類別僅能上傳無三點裸露的照片及影片，否則將會被下架，且被記點數兩點
05. 本平台僅供18歲之成年人做使用，需上傳身份證件才可以使用，以防有學生族群或未滿十八歲瀏覽本平台，為避免有身份盜用之問題，進而影響到平台與實用者的權益，上傳證件前務必加上浮水印，寫明:「僅供velix平台使用」如未加上浮水印則會被退件重新補件處理，平台審核通過後會刪除其身份證件不保留於伺服器當中，請放心使用
06. 為保護使用者的使用權益，將會要求用戶做到定期更換密碼，密碼規則適用特殊符號、數字及英文。但是不得包含生日或極為容易被破解之密碼，平台採用哈希值作為暗碼儲存，無法將其密碼轉換為明碼(使用者密碼)進行盜用
07. 為避免使用者忘記密碼登入使用，有設定使用指紋或面部別進行登入使用，可到設定做開啟使用
08. 平台皆會定期進行維護作業，如果有任何問題未被發現，請聯絡email: vlex.help@gmail.com
09. 平台會有檢測詐騙連結或文章相關內容，經檢測後會被下架該貼文並凍結用戶
10. 平台嚴禁帶有鼓勵自殺或帶有家暴等行為發生，本平台得依法向主管機關或司法機關提供必要協助
11. 嚴禁以侮辱以侮辱、歧視、騷擾、羞辱等方式攻擊他人，且會檢測違規字眼，訊息會判定無法傳送，並且違規記三點
12. 違規記點達到十點後將凍結用戶，請用戶須謹慎注意
13. 嚴禁發布帶有針對故個人智力、能力或判斷進行貶低、嘲諷或羞辱等內容
14. 未經授權，不得從事大量廣告、垃圾訊息、假推薦或商業推廣行為
15. 嚴禁傳播帶有個人資料之內容，包含身分證字號、出生地址或戶籍地
16. 不得違反個人著作權轉傳他人之影像，用戶上傳圖片會附帶用戶ID浮水印
17. 平台得依不同服務採取 TLS 傳輸加密、資料庫加密及其他安全措施
18. 使用者不得利用 AI 技術生成、散布或偽造足以誤導他人、侵害他人權益或違反法律之內容
19. 帳號停權及申訴機制
    (1) 2點
        為警告，平添將會通知您有違規與違規內容，可以繼續使用本服務
    (2) 5點
        將被停權使用7天
    (3) 10點
        平台將用戶永久停權
    如有任何異議可向: velix.help@gmail.com 進行申訴
    客服營業時間為平日周一至周五 上午09:00 至 下午06:00`;

const IP_RULES = [
  '您發布的內容版權歸您所有，但您授予 Velix 非獨家、免費的授權以在平台上展示該內容。',
  'Velix 的商標、標誌及平台設計受著作權保護，未經授權不得使用。',
]

const DISCLAIMER = 
  `Velix 免責聲明
01. 本平台提供使用者發布、分享及交流內容之服務。所有由使用者發布之文字、圖片、影片、連結及其他內容，均由發布者自行負責，本平台不保證其真實性、正確性、完整性或合法性
02. 使用者於本平台發表之意見、評論及觀點，僅代表其個人立場，不代表本平台之立場、意見或價值觀
03. 本平台可能包含第三方網站或服務之連結。本平台無法控制第三方網站之內容、隱私政策或服務品質，使用者應自行判斷並承擔相關風險
04. 本平台可能因系統維護、設備故障、網路異常、駭客攻擊、不可抗力事件或其他因素導致服務中斷、延遲或資料遺失，本平台將盡合理努力維持服務運作，但不保證服務持續不中斷或完全無錯誤
05. 使用者應妥善保管帳號、密碼及驗證資訊。因使用者保管不當、洩漏或遭本平台有權依社群規範審查、限制、下架或移除任何內容，但不保證能即時發現或處理所有違規內容。第三人使用所產生之損失，本平台不負相關責任
06. 本平台提供之 AI 生成內容可能存在錯誤、遺漏或不準確之情況。使用者應自行判斷內容之正確性與適用性，本平台不對因使用 AI 生成內容所造成之損失負責
07. 在法律允許之最大範圍內，本平台對於因使用或無法使用本服務所產生之任何直接、間接、附帶、特殊或衍生性損害，不承擔責任
08.本平台保留隨時修改、暫停、中止或終止全部或部分服務之權利，並得視需要修訂本服務條款及社群規範`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-dark-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-dark-surface text-left"
      >
        <span className="font-semibold text-sm text-dark-text">{title}</span>
        {open ? <ChevronUp size={16} className="text-dark-muted" /> : <ChevronDown size={16} className="text-dark-muted" />}
      </button>
      {open && <div className="px-4 py-3 border-t border-dark-border">{children}</div>}
    </div>
  )
}

export default function Policy() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-dark-muted hover:text-dark-text">
          <ChevronLeft size={22} />
        </button>
        <span className="font-bold text-dark-text">規範與政策</span>
      </div>

      <div className="p-4 space-y-3 pb-12">
        <p className="text-xs text-dark-muted">最後更新：2026 年 6 月</p>

        <Section title="隱私權政策">
          <pre className="text-xs text-dark-muted leading-relaxed whitespace-pre-wrap font-sans">
            {PRIVACY_POLICY}
          </pre>
        </Section>

        <Section title="內容規範">
          <pre className="text-xs text-dark-muted leading-relaxed whitespace-pre-wrap font-sans">
            {CONTENT_RULES}
          </pre>
        </Section>

        <Section title="智慧財產權">
          <ul className="space-y-2">
            {IP_RULES.map((r, i) => (
              <li key={i} className="text-sm text-dark-muted leading-relaxed flex gap-2">
                <span className="text-dark-border">•</span>{r}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="免責聲明">
          <pre className="text-xs text-dark-muted leading-relaxed whitespace-pre-wrap font-sans">
            {DISCLAIMER}
          </pre>
        </Section>

        <p className="text-xs text-dark-muted pt-2">
          如有任何問題，請來信：velix.help@gmail.com
        </p>
      </div>
    </div>
  )
}

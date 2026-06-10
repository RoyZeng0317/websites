export default function TermsContent() {
  return (
    <div className="text-sm text-dark-muted leading-relaxed space-y-5">

      {/* Privacy Policy */}
      <section>
        <h2 className="text-dark-text font-bold text-base mb-3">Velix 隱私權政策</h2>

        <div className="space-y-3">
          <p><span className="text-dark-text font-medium">01.</span> 本隱私權政策適用於使用者使用本平台網站、應用程式及相關服務時所涉及之個人資料蒐集、處理及利用行為。</p>

          <p><span className="text-dark-text font-medium">02.</span> 為確保本平台僅供年滿十八歲之使用者使用，本平台可能要求使用者提供政府核發之身分證明文件進行年齡驗證。使用者於上傳時須於文件上註明「僅供 Velix 平台註冊驗證使用」，未依規定加註者，本平台得退回申請或拒絕完成註冊程序。經驗證審核通過後，將於三天內刪除相關文件。身分驗證資料不提供給第三方服務，使用者可自行決定是否提供。</p>

          <div>
            <p className="text-dark-text font-medium mb-1.5">03. 我們蒐集以下資料</p>
            <div className="pl-3 space-y-2">
              <div>
                <p className="text-dark-text/80 font-medium mb-1">1. 帳戶資料</p>
                <ul className="pl-3 space-y-0.5 list-none">
                  {['使用者名稱', '電子郵件地址', '密碼', '個人簡介', '頭貼', '個人身分資料'].map(i => (
                    <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-dark-text/80 font-medium mb-1">2. 使用紀錄</p>
                <ul className="pl-3 space-y-0.5 list-none">
                  {['發文內容', '留言內容', '按讚紀錄', '追蹤關係', '搜尋紀錄'].map(i => (
                    <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-dark-text/80 font-medium mb-1">3. 裝置與技術資訊</p>
                <ul className="pl-3 space-y-0.5 list-none">
                  {['瀏覽器類型', 'IP 位址', '作業系統', '裝置識別碼', '登入時間'].map(i => (
                    <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-dark-text/80 font-medium mb-1">4. Cookie 與分析資料</p>
                <ul className="pl-3 space-y-0.5 list-none">
                  {['Cookie', 'Firebase Analytics', 'Crashlytics', '使用行為統計'].map(i => (
                    <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <p className="text-dark-text font-medium mb-1.5">04. 蒐集資料用途</p>
            <ul className="pl-3 space-y-0.5 list-none">
              {['提供平台服務', '維護帳戶安全', '防止詐騙與濫用', '改善使用體驗', '推薦內容', '產生統計分析', '回復客服問題', '年齡驗證及防止冒用身分'].map(i => (
                <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-dark-text font-medium mb-1.5">05. 第三方服務</p>
            <ul className="pl-3 space-y-0.5 list-none">
              {['Firebase', 'Firestore', 'Google Analytics', 'Google Sign-In', 'Cloudinary'].map(i => (
                <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-dark-text font-medium mb-1.5">06. Cookie 政策</p>
            <ul className="pl-3 space-y-0.5 list-none">
              {['平台會使用 Cookie', '紀錄登入狀態', '改善使用體驗', '分析流量'].map(i => (
                <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
              ))}
            </ul>
          </div>

          <p><span className="text-dark-text font-medium">07. 資料分享原則：</span>除法律要求、司法機關命令或使用者同意外，本平台不會出售、出租或任意提供使用者個人資料予第三人。</p>

          <p><span className="text-dark-text font-medium">08. 資料儲存期限：</span>使用者刪除帳號後，部分資料可能因備份、法律義務或爭議處理需要而暫時保留。</p>

          <div>
            <p className="text-dark-text font-medium mb-1.5">09. 使用者權限</p>
            <ul className="pl-3 space-y-0.5 list-none">
              {['查詢資料', '更正資料', '刪除資料', '撤回同意', '停止帳號使用'].map(i => (
                <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
              ))}
            </ul>
          </div>

          <p><span className="text-dark-text font-medium">10. 未成年使用者：</span>未滿法定年齡 18 歲者無法使用本服務。</p>

          <div>
            <p className="text-dark-text font-medium mb-1.5">11. 資料安全</p>
            <ul className="pl-3 space-y-0.5 list-none">
              {['TSL加密技術', '哈希值雜湊', '權限控管', '防火牆', '定期安全更新'].map(i => (
                <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
              ))}
            </ul>
          </div>

          <p><span className="text-dark-text font-medium">12. 隱私權政策修改：</span>本平台得視需要修訂本政策，更新後將公告於網站通知欄與應用程式內。</p>

          <p><span className="text-dark-text font-medium">客服信箱：</span>velix.helpme@gmail.com</p>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="border-t border-dark-border pt-5">
        <h2 className="text-dark-text font-bold text-base mb-3">Velix 平台社群規範</h2>

        <div className="space-y-3">
          <p><span className="text-dark-text font-medium">01.</span> 這是一個社群平台傳播媒體，所有上傳內容皆有審核才可上架到平台。</p>

          <p><span className="text-dark-text font-medium">02.</span> 平台內容嚴禁上傳使用 AI 製作如電影解說、課程教學內容、兒童卡通等影片內容，否則將被判為違反平台規定，凍結用戶。</p>

          <div>
            <p className="text-dark-text font-medium mb-2">03. 請勿在 Velix 上上傳、發布、展示或公開以下內容：</p>
            <div className="pl-3 space-y-2">
              <div>
                <p className="text-dark-text/80 font-medium mb-1">顯示、包含或提及：</p>
                <ul className="pl-3 space-y-1 list-none">
                  <li className="before:content-['·'] before:mr-1.5">任何 18 歲以下個人之性暗示影像、圖片或錄音檔</li>
                  <li className="before:content-['·'] before:mr-1.5">除非您持有書面文件證明內容中所有個人均滿 18 歲，且已獲得每位當事人書面同意使用其姓名或圖像</li>
                </ul>
              </div>
              <div>
                <p className="text-dark-text/80 font-medium mb-1">發布、推播廣告或提及：</p>
                <ul className="pl-3 space-y-1 list-none">
                  {[
                    '槍械、刀具、武器或任何其銷售、擁有或使用受到禁止或限制的商品',
                    '藥物或藥物工具',
                    '自殘或自殺',
                    '近親相姦',
                    '與動物發生性行為',
                    '暴力、強姦、無同意、催眠、醉酒、性侵、折磨、虐待或硬核束縛、極端插拳或生殖器殘害',
                    '戀屍',
                    '與尿液、糞便或排泄物相關的材料（包含馬賽克處理）',
                    '復仇色情（即未經事先、明確和充分知情同意之性暴露材料）',
                    '性交易或賣淫',
                  ].map(i => (
                    <li key={i} className="before:content-['·'] before:mr-1.5">{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p><span className="text-dark-text font-medium">04.</span> 上傳色情影片內容請分類至色情影片類別，一般日常類別僅能上傳無三點裸露的照片及影片，違規將被下架並記點兩點。</p>

          <p><span className="text-dark-text font-medium">05.</span> 本平台僅供 18 歲以上成年人使用，需上傳身份證件方可使用。上傳前務必加上浮水印，標明「僅供 Velix 平台使用」，未加浮水印將被退件補件。審核通過後平台將刪除身份證件，不保留於伺服器。</p>

          <p><span className="text-dark-text font-medium">06.</span> 為保護帳號安全，平台將定期要求更換密碼。密碼需包含特殊符號、數字及英文，不得包含生日或容易被破解之字串。平台採用哈希值儲存密碼，無法將密碼轉換為明碼。</p>

          <p><span className="text-dark-text font-medium">07.</span> 為避免忘記密碼，可在設定中開啟指紋或臉部辨識登入。</p>

          <p><span className="text-dark-text font-medium">08.</span> 平台定期進行維護作業，如發現問題請聯絡 velix.helpme@gmail.com。</p>

          <p><span className="text-dark-text font-medium">09.</span> 平台具備詐騙連結及內容檢測機制，違規貼文將被下架並凍結用戶。</p>

          <p><span className="text-dark-text font-medium">10.</span> 嚴禁發布鼓勵自殺或帶有家暴等行為之內容，違反者將依法究辦。</p>

          <p><span className="text-dark-text font-medium">11.</span> 系統偵測違規字眼，違規訊息無法傳送並記點三點。</p>

          <p><span className="text-dark-text font-medium">12.</span> 違規記點累計達十點後將凍結帳號，請用戶謹慎注意。</p>

          <p><span className="text-dark-text font-medium">13.</span> 嚴禁發布針對個人智力、能力或判斷進行貶低、嘲諷或羞辱等內容。</p>

          <p><span className="text-dark-text font-medium">14.</span> 嚴禁發布廣告、個人營銷或假推薦文，如有個人營銷需求需申請成為營銷帳戶，審核通過後方可使用。</p>

          <p><span className="text-dark-text font-medium">15.</span> 嚴禁傳播含有個人資料之內容，包含身分證字號、出生地址或戶籍地。</p>

          <p><span className="text-dark-text font-medium">16.</span> 不得違反個人著作權轉傳他人影像，用戶上傳圖片將附帶用戶 ID 浮水印。</p>
        </div>
      </section>

    </div>
  )
}

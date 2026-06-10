import { useState } from "react";

const theme = {
  bg: "#000000",
  surface: "#16181C",
  border: "#2F3336",
  accent: "#1D9BF0",
  text: "#E7E9EA",
  muted: "#71767B",
  like: "#F91880",
  follow: "#1D9BF0",
  comment: "#00BA7C",
};

const Avatar = ({ name, color, size = 38 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: color,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 500, color: "#fff", flexShrink: 0,
  }}>{name[0].toUpperCase()}</div>
);

const PostCard = ({ post }) => (
  <div style={{ padding: "12px 16px", borderBottom: `0.5px solid ${theme.border}`, display: "flex", gap: 10 }}>
    <Avatar name={post.name} color={post.color} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{post.name}</span>
        <span style={{ fontSize: 13, color: theme.muted }}>@{post.handle}</span>
        <span style={{ fontSize: 12, color: theme.muted, marginLeft: "auto" }}>{post.time}</span>
      </div>
      <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.5, marginBottom: 10 }}>{post.content}</div>
      {post.hasImage && (
        <div style={{
          width: "100%", borderRadius: 12, height: 100, background: "#1a2a3a",
          marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center",
          border: `0.5px solid ${theme.border}`, fontSize: 12, color: theme.muted,
        }}>📷 Image</div>
      )}
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: theme.muted, fontSize: 13 }}>
          💬 {post.comments}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: post.liked ? theme.like : theme.muted }}>
          {post.liked ? "❤️" : "🤍"} {post.likes}
        </div>
      </div>
    </div>
  </div>
);

const TabBar = ({ active }) => {
  const tabs = [
    { id: "feed", icon: "🏠", label: "首頁" },
    { id: "search", icon: "🔍", label: "搜尋" },
    { id: "notif", icon: "🔔", label: "通知" },
    { id: "profile", icon: "👤", label: "個人" },
  ];
  return (
    <div style={{ height: 52, background: "rgba(0,0,0,0.95)", borderTop: `0.5px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", flexShrink: 0 }}>
      {tabs.map(t => (
        <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: active === t.id ? 1 : 0.4 }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: theme.accent }} />}
        </div>
      ))}
    </div>
  );
};

const Phone = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{
      width: 280, height: 580, background: "#000", borderRadius: 32,
      border: `2px solid ${theme.border}`, overflow: "hidden",
      display: "flex", flexDirection: "column", position: "relative",
    }}>
      {/* Status bar */}
      <div style={{ height: 26, background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: theme.text }}>9:41</span>
        <span style={{ fontSize: 11, color: theme.text }}>●●●</span>
      </div>
      {children}
    </div>
    <div style={{ fontSize: 13, color: theme.muted, marginTop: 8 }}>{label}</div>
  </div>
);

const AppBar = ({ title, left, right }) => (
  <div style={{ height: 46, background: "rgba(0,0,0,0.9)", borderBottom: `0.5px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", flexShrink: 0 }}>
    <div style={{ width: 28 }}>{left}</div>
    <span style={{ fontSize: 17, fontWeight: 500, color: theme.text }}>{title}</span>
    <div style={{ width: 28 }}>{right}</div>
  </div>
);

const ScrollArea = ({ children }) => (
  <div style={{ flex: 1, overflowY: "auto", background: "#000", scrollbarWidth: "none" }}>
    {children}
  </div>
);

const posts = [
  { name: "Roy Chen", handle: "roychen", color: "#1d4ed8", time: "2m", content: "Flutter + Firebase 真的是完美組合，開發速度快到不行 🔥", likes: 48, comments: 12, liked: true },
  { name: "Alice Wang", handle: "alice", color: "#7c3aed", time: "18m", content: "剛上線新功能，UI 比上一版乾淨很多，大家覺得如何？", likes: 21, comments: 5, hasImage: true },
  { name: "Kevin Liu", handle: "kevinliu", color: "#0f766e", time: "1h", content: "Riverpod 2.0 的 AsyncNotifier 真的香，以後不再需要 FutureBuilder 了", likes: 107, comments: 33 },
  { name: "Mei Zhang", handle: "meizhang", color: "#b45309", time: "3h", content: "今天咖啡喝太多根本停不下來，code review 到深夜", likes: 62, comments: 7, liked: true },
];

const FeedScreen = () => (
  <>
    <AppBar title="Velix" left={<Avatar name="R" color="#1d4ed8" size={26} />} right={<span style={{ fontSize: 16 }}>⚙️</span>} />
    <div style={{ display: "flex", borderBottom: `0.5px solid ${theme.border}`, flexShrink: 0 }}>
      {["For you", "Following"].map((t, i) => (
        <div key={t} style={{
          flex: 1, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: i === 0 ? theme.text : theme.muted,
          fontWeight: i === 0 ? 500 : 400, position: "relative",
        }}>
          {t}
          {i === 0 && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 44, height: 3, background: theme.accent, borderRadius: 2 }} />}
        </div>
      ))}
    </div>
    <ScrollArea>
      {posts.map((p, i) => <PostCard key={i} post={p} />)}
    </ScrollArea>
    <div style={{ position: "absolute", bottom: 62, right: 14, width: 46, height: 46, borderRadius: "50%", background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✏️</div>
    <TabBar active="feed" />
  </>
);

const ProfileScreen = () => (
  <>
    <AppBar title="Roy Chen" left={<span style={{ color: theme.text }}>←</span>} />
    <ScrollArea>
      <div style={{ height: 72, background: "#1a2a3a", display: "flex", alignItems: "center", justifyContent: "center", color: theme.muted, fontSize: 12 }}>Cover photo</div>
      <div style={{ padding: "0 14px 12px", borderBottom: `0.5px solid ${theme.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: -22, marginBottom: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: theme.accent, border: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 500 }}>R</div>
          <button style={{ height: 28, padding: "0 14px", borderRadius: 20, border: `0.5px solid ${theme.muted}`, background: "transparent", color: theme.text, fontSize: 13, cursor: "pointer" }}>Edit profile</button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>Roy Chen</div>
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 6 }}>@roychen</div>
        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.4, marginBottom: 8 }}>Building Velix 🚀 Flutter & Firebase. Based in Taiwan.</div>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontSize: 13, color: theme.muted }}><span style={{ color: theme.text, fontWeight: 500 }}>128</span> Following</span>
          <span style={{ fontSize: 13, color: theme.muted }}><span style={{ color: theme.text, fontWeight: 500 }}>340</span> Followers</span>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: `0.5px solid ${theme.border}` }}>
        {["Posts", "Replies", "Media"].map((t, i) => (
          <div key={t} style={{ flex: 1, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: i === 0 ? theme.text : theme.muted, position: "relative" }}>
            {t}
            {i === 0 && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 36, height: 3, background: theme.accent, borderRadius: 2 }} />}
          </div>
        ))}
      </div>
      {posts.slice(0, 2).map((p, i) => <PostCard key={i} post={p} />)}
    </ScrollArea>
    <TabBar active="profile" />
  </>
);

const NotifScreen = () => {
  const notifs = [
    { icon: "❤️", color: "#f918801a", textColor: theme.like, text: <>  <b style={{ color: theme.text }}>Alice Wang</b> <span style={{ color: theme.muted }}>and 3 others liked your post</span><br /><span style={{ color: theme.muted, fontSize: 12 }}>Flutter + Firebase 真的是完美…</span></>, unread: true },
    { icon: "👤", color: "#1d9bf01a", textColor: theme.follow, text: <><b style={{ color: theme.text }}>Kevin Liu</b> <span style={{ color: theme.muted }}>started following you</span></>, unread: true },
    { icon: "💬", color: "#00ba7c1a", textColor: theme.comment, text: <><b style={{ color: theme.text }}>Mei Zhang</b> <span style={{ color: theme.muted }}>replied to your post</span><br /><span style={{ color: theme.muted, fontSize: 12 }}>同意！Riverpod 真的太好用</span></>, unread: true },
    { icon: "❤️", color: "#f918801a", textColor: theme.like, text: <><b style={{ color: theme.text }}>Daniel Ho</b> <span style={{ color: theme.muted }}>liked your post</span></>, unread: false },
    { icon: "👤", color: "#1d9bf01a", textColor: theme.follow, text: <><b style={{ color: theme.text }}>Sara Lin</b> <span style={{ color: theme.muted }}>started following you</span></>, unread: false },
  ];
  return (
    <>
      <AppBar title="Notifications" />
      <ScrollArea>
        <div style={{ padding: "8px 16px", borderBottom: `0.5px solid ${theme.border}` }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>New</span>
        </div>
        {notifs.map((n, i) => (
          <div key={i} style={{ padding: "12px 16px", borderBottom: `0.5px solid ${theme.border}`, display: "flex", alignItems: "flex-start", gap: 8 }}>
            {n.unread ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, marginTop: 6, flexShrink: 0 }} /> : <div style={{ width: 8, flexShrink: 0 }} />}
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: n.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{n.text}</div>
          </div>
        ))}
      </ScrollArea>
      <TabBar active="notif" />
    </>
  );
};

const SearchScreen = () => (
  <>
    <AppBar title="Explore" />
    <ScrollArea>
      <div style={{ padding: "10px 14px", borderBottom: `0.5px solid ${theme.border}` }}>
        <div style={{ height: 34, borderRadius: 20, background: theme.surface, border: `0.5px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 8, padding: "0 12px" }}>
          <span style={{ fontSize: 15 }}>🔍</span>
          <span style={{ fontSize: 14, color: theme.muted }}>Search Velix</span>
        </div>
      </div>
      <div style={{ padding: "8px 14px 4px", borderBottom: `0.5px solid ${theme.border}` }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>Trending</span>
      </div>
      {[
        { cat: "Technology · Trending", tag: "#Flutter", count: "8,421 posts" },
        { cat: "Developer · Trending", tag: "#Firebase", count: "5,102 posts" },
        { cat: "Taiwan · Trending", tag: "#台灣開發者", count: "3,890 posts" },
      ].map((t, i) => (
        <div key={i} style={{ padding: "10px 14px", borderBottom: `0.5px solid ${theme.border}` }}>
          <div style={{ fontSize: 12, color: theme.muted }}>{t.cat}</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{t.tag}</div>
          <div style={{ fontSize: 12, color: theme.muted }}>{t.count}</div>
        </div>
      ))}
      <div style={{ padding: "8px 14px 4px", borderBottom: `0.5px solid ${theme.border}`, marginTop: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>Who to follow</span>
      </div>
      {[
        { name: "Alice Wang", handle: "@alice", color: "#7c3aed", followers: "1.2K followers", following: false },
        { name: "Kevin Liu", handle: "@kevinliu", color: "#0f766e", followers: "842 followers", following: true },
      ].map((u, i) => (
        <div key={i} style={{ padding: "10px 14px", borderBottom: `0.5px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={u.name} color={u.color} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{u.name}</div>
            <div style={{ fontSize: 12, color: theme.muted }}>{u.handle} · {u.followers}</div>
          </div>
          <button style={{
            height: 28, padding: "0 14px", borderRadius: 20,
            border: u.following ? `0.5px solid ${theme.muted}` : "none",
            background: u.following ? "transparent" : "#e7e9ea",
            color: u.following ? theme.text : "#000", fontSize: 13, cursor: "pointer", fontWeight: 500,
          }}>{u.following ? "Following" : "Follow"}</button>
        </div>
      ))}
    </ScrollArea>
    <TabBar active="search" />
  </>
);

const screens = [
  { id: "feed", label: "Feed 主頁", component: FeedScreen },
  { id: "profile", label: "個人頁", component: ProfileScreen },
  { id: "notif", label: "通知", component: NotifScreen },
  { id: "search", label: "搜尋", component: SearchScreen },
];

export default function App() {
  const [active, setActive] = useState("feed");
  const current = screens.find(s => s.id === active);
  const Screen = current.component;

  return (
    <div style={{ background: "transparent", padding: "1rem 0" }}>
      {/* Tab selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {screens.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
            border: active === s.id ? "none" : `0.5px solid var(--color-border-tertiary)`,
            background: active === s.id ? theme.accent : "transparent",
            color: active === s.id ? "#fff" : "var(--color-text-secondary)",
            fontWeight: active === s.id ? 500 : 400,
          }}>{s.label}</button>
        ))}
      </div>

      {/* Phone mockup */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 280, height: 580, background: "#000", borderRadius: 32, border: `2px solid ${theme.border}`, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
            <div style={{ height: 26, background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: theme.text }}>9:41</span>
              <span style={{ fontSize: 11, color: theme.text }}>●●●</span>
            </div>
            <Screen />
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 8 }}>{current.label}</div>
        </div>
      </div>
    </div>
  );
}

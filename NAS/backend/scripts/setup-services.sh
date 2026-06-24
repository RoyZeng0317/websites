#!/bin/bash
# 在樹莓派執行：bash ~/casaos-nas/backend/scripts/setup-services.sh
set -e

NAS_DIR="/home/roy/casaos-nas/backend/data/files"
BACKEND_USER="roy"

echo "=== CasaOS NAS 網路服務安裝腳本 ==="
echo ""

# ── 1. vsftpd (FTP) ───────────────────────────────────────
echo "[1/4] 安裝 vsftpd (FTP)..."
sudo apt-get install -y vsftpd db5.3-util

sudo tee /etc/vsftpd.conf > /dev/null << 'VSFCONF'
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
chroot_local_user=YES
allow_writeable_chroot=YES
secure_chroot_dir=/var/run/vsftpd/empty
pam_service_name=vsftpd.virtual
guest_enable=YES
guest_username=ftp
user_sub_token=$USER
local_root=/home/roy/casaos-nas/backend/data/files/$USER
virtual_use_local_privs=YES
pasv_enable=YES
pasv_min_port=10000
pasv_max_port=10100
VSFCONF

# PAM 設定
sudo tee /etc/pam.d/vsftpd.virtual > /dev/null << 'PAMCONF'
auth required pam_userdb.so db=/etc/vsftpd/login
account required pam_userdb.so db=/etc/vsftpd/login
PAMCONF

sudo mkdir -p /etc/vsftpd
sudo touch /etc/vsftpd/virtual_users.txt
sudo touch /etc/vsftpd/login.db
sudo chmod 600 /etc/vsftpd/login.db

# 確保 ftp 使用者存在
id ftp &>/dev/null || sudo useradd -r -d /var/ftp -s /usr/sbin/nologin ftp
sudo usermod -d /var/ftp ftp

sudo systemctl enable vsftpd
sudo systemctl restart vsftpd
echo "✓ vsftpd 安裝完成 (port 21)"

# ── 2. Samba (SMB) ────────────────────────────────────────
echo ""
echo "[2/4] 安裝 Samba..."
sudo apt-get install -y samba samba-common-bin

sudo tee /etc/samba/smb.conf > /dev/null << SAMBACONF
[global]
   workgroup = WORKGROUP
   server string = CasaOS NAS
   security = user
   map to guest = bad user
   passdb backend = tdbsam
   log file = /var/log/samba/log.%m
   max log size = 1000
   dns proxy = no

[files]
   comment = CasaOS NAS Files
   path = ${NAS_DIR}
   browseable = yes
   writable = yes
   valid users = @nasusers
   create mask = 0660
   directory mask = 0770
SAMBACONF

# 建立 nasusers 群組（若不存在）
getent group nasusers &>/dev/null || sudo groupadd nasusers

sudo systemctl enable smbd nmbd
sudo systemctl restart smbd nmbd
echo "✓ Samba 安裝完成 (port 445)"

# ── 3. 建立 NAS 系統帳號 ──────────────────────────────────
echo ""
echo "[3/4] 建立 NAS 系統帳號（FTP + Samba 共用）..."

# 為每個 NAS 使用者建立系統帳號（無殼層，家目錄指向各自的 NAS 目錄）
declare -A NAS_USERS
NAS_USERS=(["boyud9.5"]="boyud9_5" ["judy4359"]="judy4359" ["zengziting"]="zengziting" ["boiudy75"]="boiudy75")

for NAS_USER in "${!NAS_USERS[@]}"; do
  SYS_USER="${NAS_USERS[$NAS_USER]}"
  USER_DIR="${NAS_DIR}/${NAS_USER}"
  mkdir -p "$USER_DIR"
  if ! id "$SYS_USER" &>/dev/null; then
    sudo useradd -r -d "$USER_DIR" -s /usr/sbin/nologin "$SYS_USER"
    echo "  ✓ 建立系統帳號：$SYS_USER"
  else
    echo "  - 已存在：$SYS_USER"
  fi
  sudo chown "$SYS_USER:nasusers" "$USER_DIR"
  sudo chmod 750 "$USER_DIR"
  sudo usermod -aG nasusers "$SYS_USER"
done
echo "✓ 系統帳號設定完成"

# ── 4. sudoers 規則（讓 Node.js 可控制服務） ─────────────
echo ""
echo "[4/4] 設定 sudoers 規則..."
sudo tee /etc/sudoers.d/casaos-nas > /dev/null << 'SUDOERS'
# CasaOS NAS backend service control
roy ALL=(ALL) NOPASSWD: /bin/systemctl start vsftpd
roy ALL=(ALL) NOPASSWD: /bin/systemctl stop vsftpd
roy ALL=(ALL) NOPASSWD: /bin/systemctl restart vsftpd
roy ALL=(ALL) NOPASSWD: /bin/systemctl start smbd
roy ALL=(ALL) NOPASSWD: /bin/systemctl stop smbd
roy ALL=(ALL) NOPASSWD: /bin/systemctl restart smbd
roy ALL=(ALL) NOPASSWD: /usr/bin/db_load -T -t hash -f /etc/vsftpd/virtual_users.txt /etc/vsftpd/login.db
roy ALL=(ALL) NOPASSWD: /bin/chmod 600 /etc/vsftpd/login.db
roy ALL=(ALL) NOPASSWD: /usr/bin/smbpasswd
SUDOERS
sudo chmod 440 /etc/sudoers.d/casaos-nas
echo "✓ sudoers 規則已套用"

echo ""
echo "======================================"
echo "安裝完成！接下來請為每個使用者設定密碼："
echo ""
echo "  方法 1：在網頁管理介面登入後「修改密碼」（會自動同步 FTP + Samba）"
echo ""
echo "  方法 2：手動設定 Samba 密碼："
echo "    sudo smbpasswd -a judy4359"
echo ""
echo "  Windows 掛載 Samba："
echo "    檔案總管 → 右鍵「本機」→「連線網路磁碟機」"
echo "    資料夾：\\\\$(hostname -I | awk '{print $1}')\\files"
echo ""
echo "  WebDAV（免安裝，已內建）："
echo "    http://$(hostname -I | awk '{print $1}'):3000/webdav"
echo "    Windows：「新增網路位置」→ 輸入上方 URL"
echo "======================================"

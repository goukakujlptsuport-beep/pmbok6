# Deployment Guide

## Server Info

| Thông tin | Giá trị |
|-----------|---------|
| Provider | Oracle Cloud Always Free |
| Region | ap-tokyo-1 |
| Shape | VM.Standard.A1.Flex (ARM64 Ampere) |
| OS | Ubuntu 20.04 LTS |
| Public IP | 138.2.6.44 |
| SSH User | ubuntu |
| SSH Key | `~/Downloads/ssh-key-2025-03-29.key` |
| App path | `/opt/pmp` |
| Node.js | v18.20.8 (arm64) |

## Services

| Service | Command | Port |
|---------|---------|------|
| PMP App | `systemctl status pmp` | 3000 |
| Nginx | `systemctl status nginx` | 80 |
| SSH | sshd | 22, 443 |

## Cách kết nối vào server

**Qua Oracle Cloud Shell** (khuyến nghị — không bị Zscaler chặn):
1. Vào [cloud.oracle.com](https://cloud.oracle.com)
2. Click icon `>_` (Cloud Shell) góc trên phải
3. Upload `ssh-key-2025-03-29.key` nếu chưa có
4. Chạy:
```bash
chmod 600 ~/ssh-key-2025-03-29.key
ssh -i ~/ssh-key-2025-03-29.key ubuntu@138.2.6.44
```

> **Lưu ý:** SSH trực tiếp từ Mac công ty không được do Zscaler chặn.  
> Cloud Shell dùng internal Oracle network nên bypass được.

## GitHub Actions — Auto Deploy

File: `.github/workflows/deploy.yml`

Trigger: mỗi khi push lên `main`

Flow:
```
git push main
    → GitHub Actions runner
    → SSH vào 138.2.6.44
    → git pull
    → npm install
    → systemctl restart pmp
    → health check
```

**Secret cần thiết:** `DEPLOY_SSH_KEY` — nội dung file `ssh-key-2025-03-29.key`

## Cập nhật code thủ công

```bash
# Trên Oracle VM:
cd /opt/pmp
git pull origin main
cd server && npm install --production=false
sudo systemctl restart pmp

# Kiểm tra:
sudo systemctl status pmp --no-pager
curl http://localhost/api/health
```

## Troubleshooting

### Server không start
```bash
sudo journalctl -u pmp -n 50 --no-pager
```

### Nginx lỗi
```bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx -n 20
```

### DB bị hỏng
```bash
cd /opt/pmp/server
node -r tsx/cjs src/db/migrate.ts
```

### MTU issue (SSH timeout từ internet)
```bash
# Kiểm tra MTU hiện tại
ip link show enp0s6 | grep mtu

# Fix nếu bị reset về 9000
sudo ip link set dev enp0s6 mtu 1500
sudo tee /etc/networkd-dispatcher/routable.d/fix-mtu.sh > /dev/null <<'EOF'
#!/bin/bash
ip link set dev enp0s6 mtu 1500
EOF
sudo chmod +x /etc/networkd-dispatcher/routable.d/fix-mtu.sh
```

## Firewall (iptables)

Rules được lưu vào `/etc/iptables/rules.v4` qua `netfilter-persistent`.

Các port mở:
- 22 — SSH
- 80 — HTTP (nginx)
- 443 — HTTPS / SSH fallback
- 3000 — Node.js (internal, qua nginx)

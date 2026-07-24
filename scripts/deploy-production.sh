#!/bin/sh
set -eu

if [ "${MODBOTS_DEPLOY_SOURCE:-}" != "github-actions" ]; then
  echo "Production deploys must run through GitHub Actions."
  exit 1
fi

for variable in \
  NEXT_PUBLIC_MODBOTS_API_URL \
  NEXT_PUBLIC_MODBOTS_REALTIME_CONFIG_URL \
  NEXT_PUBLIC_MODBOTS_REALTIME_HEALTH_URL \
  NEXT_PUBLIC_MODBOTS_ACCOUNT_URL; do
  if [ -z "$(printenv "$variable")" ]; then
    echo "Missing production variable: $variable"
    exit 1
  fi
done

if [ "$(pwd -P)" != "/var/www/modbots-web" ]; then
  echo "Run this deployment from /var/www/modbots-web."
  exit 1
fi

export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use modbots-web

npm ci
npm run build

if pm2 describe modbots-web >/dev/null 2>&1; then
  pm2 restart modbots-web --update-env
else
  pm2 start npm --name modbots-web --cwd /var/www/modbots-web -- start -- -p 3001
fi

attempt=1
while [ "$attempt" -le 60 ]; do
  if curl --fail --silent --show-error http://127.0.0.1:3001/ |
    grep -q "<title>Mod Bots</title>"; then
    pm2 save
    pm2 describe modbots-web
    exit 0
  fi

  sleep 2
  attempt=$((attempt + 1))
done

pm2 logs modbots-web --lines 100 --nostream
echo "Mod Bots did not become healthy on port 3001."
exit 1

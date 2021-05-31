set -e

npm run build

echo "01-simple"
cd example/01-simple
repost request.http
cd -

echo "02-environments-json"
cd example/02-environments-json
repost request.http -e env.json
cd -

echo "03-environments-js"
cd example/03-environments-js
repost request.http -e env.js
cd -

echo "04-hooks"
cd example/04-hooks
repost request.http -H hook.js
cd -

echo "done"
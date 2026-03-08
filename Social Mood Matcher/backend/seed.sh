#!/bin/sh
set -e

DB_PATH="/app/data/moodmatcher.db"
API_URL="http://localhost:5000"

echo "🚀 Starting API in background..."
dotnet SocialMoodMatcher.API.dll &
API_PID=$!

# ── Wait for API to be healthy ─────────────────────────────────────────────
# We ping /api/auth/login; a 401 (wrong creds) means the API is UP and serving.
# We use -w to capture HTTP status and check for non-7 curl exit (7 = connection refused)
echo "⏳ Waiting for API to be ready..."
RETRIES=60
HTTP_STATUS="000"
until [ "$HTTP_STATUS" = "401" ] || [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "400" ]; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -eq 0 ]; then
    echo "⚠️  API did not respond in time – continuing without seed."
    wait $API_PID
    exit 0
  fi
  sleep 2
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"_health_","password":"_health_"}' 2>/dev/null || echo "000")
  echo "  API status: $HTTP_STATUS (waiting...)"
done
echo "✅ API is ready (HTTP $HTTP_STATUS)."

# ── Check if DB already has users (skip seed on restarts) ─────────────────
USER_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM AspNetUsers;" 2>/dev/null || echo "0")
echo "ℹ️  Current user count: $USER_COUNT"

if [ "$USER_COUNT" = "0" ]; then
  echo "🌱 Seeding test users via /api/auth/register ..."

  register() {
    NAME=$1; EMAIL=$2; PASS=$3
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST "$API_URL/api/auth/register" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"displayName\":\"$NAME\"}")
    echo "  [$STATUS] $NAME ($EMAIL)"
  }

  register "Alice"   "alice@test.com"  "Test123!"
  register "Bob"     "bob@test.com"    "Test123!"
  register "Priya"   "priya@test.com"  "Test123!"
  register "Sam"     "sam@test.com"    "Test123!"
  register "Jordan"  "jordan@test.com" "Test123!"

  # ── Seed starter moods ────────────────────────────────────────────────────
  echo "🌱 Seeding starter moods..."
  sqlite3 "$DB_PATH" "
    INSERT INTO UserMoods (UserId, MoodType, Description, CreatedAt)
    SELECT Id, 'Stressed', 'Too many deadlines today 😩', datetime('now','-10 minutes')
    FROM AspNetUsers WHERE Email = 'alice@test.com' LIMIT 1;

    INSERT INTO UserMoods (UserId, MoodType, Description, CreatedAt)
    SELECT Id, 'Stressed', 'Need a break from coding 🧠', datetime('now','-8 minutes')
    FROM AspNetUsers WHERE Email = 'bob@test.com' LIMIT 1;

    INSERT INTO UserMoods (UserId, MoodType, Description, CreatedAt)
    SELECT Id, 'Happy', 'Finished my project! 🎉', datetime('now','-15 minutes')
    FROM AspNetUsers WHERE Email = 'priya@test.com' LIMIT 1;

    INSERT INTO UserMoods (UserId, MoodType, Description, CreatedAt)
    SELECT Id, 'Calm', 'Enjoying a quiet evening ☕', datetime('now','-20 minutes')
    FROM AspNetUsers WHERE Email = 'sam@test.com' LIMIT 1;

    INSERT INTO UserMoods (UserId, MoodType, Description, CreatedAt)
    SELECT Id, 'Excited', 'Big plans for tomorrow 🚀', datetime('now','-5 minutes')
    FROM AspNetUsers WHERE Email = 'jordan@test.com' LIMIT 1;
  " && echo "  ✅ Moods inserted." || echo "  ⚠️  Mood seed failed."

  echo ""
  echo "✅ Seed complete! Test accounts (password: Test123!):"
  echo "   alice@test.com  bob@test.com  priya@test.com"
  echo "   sam@test.com    jordan@test.com"
else
  echo "ℹ️  Already seeded – skipping."
fi

# ── Hand off to API process ────────────────────────────────────────────────
echo "🎯 API running at $API_URL"
wait $API_PID

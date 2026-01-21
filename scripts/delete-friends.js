/*
Admin script: delete-friends.js (plain JavaScript)

Usage:
  - Provide a JSON file with an array of friend document IDs to delete:
      node -r dotenv/config scripts/delete-friends.js --file=path/to/ids.json

  - Or delete all friends for a specific user ID:
      node -r dotenv/config scripts/delete-friends.js --user=USER_ID

Notes:
  - This script uses Firebase Admin SDK. Set up credentials via
    GOOGLE_APPLICATION_CREDENTIALS or provide env vars as needed.
  - The repo's tsconfig.json excludes `scripts/` from client builds.
  - Be careful: deletions are irreversible.
*/

const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Simple arg parsing: --key=value or --key value
const argv = {}
const rawArgs = process.argv.slice(2)
for (let i = 0; i < rawArgs.length; i++) {
  const a = rawArgs[i]
  if (a.startsWith('--')) {
    const [k, v] = a.replace(/^--/, '').split('=')
    if (v !== undefined) argv[k] = v
    else argv[k] = rawArgs[i + 1] && !rawArgs[i + 1].startsWith('--') ? rawArgs[++i] : ''
  }
}

async function initAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp()
  }
  return admin.firestore()
}

async function deleteByIds(db, ids) {
  console.log(`Deleting ${ids.length} friend(s)...`)
  let deleted = 0
  for (const id of ids) {
    try {
      await db.collection('friends').doc(id).delete()
      deleted++
      console.log(`Deleted ${id}`)
    } catch (err) {
      console.error(`Failed to delete ${id}:`, err)
    }
  }
  console.log(`Finished. Deleted ${deleted}/${ids.length}`)
}

function askConfirmation(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(`${prompt} Type YES to confirm: `, (answer) => {
      rl.close()
      resolve(answer.trim() === 'YES')
    })
  })
}

async function deleteByUser(db, userId) {
  console.log(`Querying friends for user ${userId}...`)
  const q = db.collection('friends').where('ownerId', '==', userId)
  const snap = await q.get()
  if (snap.empty) {
    console.log('No friend documents found for user.')
    return
  }
  const total = snap.size
  console.log(`Found ${total} friend document(s) for user ${userId}`)
  const ok = await askConfirmation(`About to delete ${total} document(s) for user ${userId}.`)
  if (!ok) {
    console.log('Aborted by user.')
    return
  }
  const batch = db.batch()
  let count = 0
  for (const doc of snap.docs) {
    batch.delete(doc.ref)
    count++
    // Firestore batch limit is 500
    if (count % 500 === 0) {
      await batch.commit()
      console.log(`Committed ${count} deletions so far...`)
    }
  }
  if (count % 500 !== 0) await batch.commit()
  console.log(`Finished. Deleted ${count} documents for user ${userId}`)
}

async function main() {
  const db = await initAdmin()

  if (argv.file) {
    const filePath = path.resolve(process.cwd(), argv.file)
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath)
      process.exit(1)
    }
    const raw = fs.readFileSync(filePath, 'utf-8')
    let ids = []
    try {
      const j = JSON.parse(raw)
      if (Array.isArray(j)) ids = j
      else if (Array.isArray(j.ids)) ids = j.ids
      else {
        console.error('JSON must be an array of ids or { ids: [] }')
        process.exit(1)
      }
    } catch (err) {
      console.error('Failed to parse JSON file:', err)
      process.exit(1)
    }
    console.log(`Parsed ${ids.length} id(s) from ${filePath}`)
    const ok = await askConfirmation(`About to delete ${ids.length} friend document(s).`)
    if (!ok) {
      console.log('Aborted by user.')
      process.exit(0)
    }
    await deleteByIds(db, ids)
    process.exit(0)
  }

  if (argv.user) {
    await deleteByUser(db, argv.user)
    process.exit(0)
  }

  console.log('Usage: --file=path/to/ids.json  OR  --user=USER_ID')
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

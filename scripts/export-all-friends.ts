/*
 Node script to export all friends documents to JSON files under ./backups/
 Usage:
 1) Install firebase-admin: npm install firebase-admin
 2) Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path
 3) node ./scripts/export-all-friends.ts (ts-node) or compile to JS

 This script requires running with ts-node or compiling.
*/

import * as fs from 'fs'
import * as path from 'path'
import * as admin from 'firebase-admin'

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
	console.error(
		'Please set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON'
	)
	process.exit(1)
}

admin.initializeApp()
const db = admin.firestore()

async function exportAll() {
	const outDir = path.resolve(process.cwd(), 'backups')
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

	const friendsSnap = await db.collection('friends').get()
	const byUser = new Map<string, any[]>()

	friendsSnap.forEach((doc) => {
		const data = doc.data()
		const userId = data.userId || 'unknown'
		const arr = byUser.get(userId) || []
		arr.push({ id: doc.id, ...data })
		byUser.set(userId, arr)
	})

	for (const [userId, items] of byUser.entries()) {
		const file = path.join(
			outDir,
			`friends-${userId}-${new Date().toISOString()}.json`
		)
		fs.writeFileSync(
			file,
			JSON.stringify(
				{
					exportedAt: new Date().toISOString(),
					count: items.length,
					items,
				},
				null,
				2
			)
		)
		console.log(`Wrote ${file}`)
	}
}

exportAll().catch((err) => {
	console.error(err)
	process.exit(1)
})

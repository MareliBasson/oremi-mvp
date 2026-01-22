'use client'

import React from 'react'
import PreferencesDisplay from './PreferencesDisplay'
import PreferencesCheckins from './PreferencesCheckins'
import { Separator } from '@/components/ui/separator'

export default function Preferences() {
	return (
		<div className='space-y-4'>
			<PreferencesDisplay />
			<Separator />
			<PreferencesCheckins />
		</div>
	)
}

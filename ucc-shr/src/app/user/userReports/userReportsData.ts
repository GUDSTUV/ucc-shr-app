export type ReportStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'INVESTIGATION' | 'CLOSED'

export type ReportTimelineItem = {
	title: string
	note: string
	time: string
	done: boolean
}

export type UserReport = {
	id: string
	title: string
	status: ReportStatus
	submittedAt: string
	zone: string
	summary: string
	timeline: ReportTimelineItem[]
}

export const reportStatusStyles: Record<
	ReportStatus,
	{
		label: string
		chip: string
	}
> = {
	SUBMITTED: {
		label: 'Submitted',
		chip: 'bg-navy-light text-navy border border-navy/20',
	},
	UNDER_REVIEW: {
		label: 'Under review',
		chip: 'bg-red-light text-red-dark border border-red/30',
	},
	INVESTIGATION: {
		label: 'Investigation',
		chip: 'bg-amber-50 text-amber-700 border border-amber-200',
	},
	CLOSED: {
		label: 'Resolved',
		chip: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
	},
}

export const userReportsMock: UserReport[] = [
	{
		id: 'UCC-8291',
		title: 'Repeated verbal harassment after evening lectures',
		status: 'INVESTIGATION',
		submittedAt: '2026-03-20T09:12:00Z',
		zone: 'Faculty of Arts walkway',
		summary: 'Complainant reported repeated sexual comments and unwanted following near the shuttle stop.',
		timeline: [
			{
				title: 'Report submitted',
				note: 'Anonymous complaint logged and assigned to CEGRAD case officer.',
				time: 'Mar 20, 09:12 AM',
				done: true,
			},
			{
				title: 'Under review',
				note: 'Initial risk screening completed and survivor support options shared.',
				time: 'Mar 20, 11:45 AM',
				done: true,
			},
			{
				title: 'Investigation',
				note: 'Witness statements and CCTV review requested through campus security.',
				time: 'Mar 20, 01:30 PM',
				done: true,
			},
			{
				title: 'Resolution',
				note: 'Awaiting disciplinary committee recommendation.',
				time: 'Pending',
				done: false,
			},
		],
	},
	{
		id: 'UCC-8501',
		title: 'Unwanted touching reported during orientation event',
		status: 'UNDER_REVIEW',
		submittedAt: '2026-03-18T10:15:00Z',
		zone: 'Main auditorium',
		summary: 'Student reported non-consensual physical contact in a crowded hall during orientation.',
		timeline: [
			{
				title: 'Report submitted',
				note: 'Case received and confidentiality protocol activated.',
				time: 'Mar 18, 10:15 AM',
				done: true,
			},
			{
				title: 'Under review',
				note: 'Case officer scheduled follow-up interview and documented survivor needs.',
				time: 'Mar 18, 11:05 AM',
				done: true,
			},
			{
				title: 'Investigation',
				note: 'Pending witness availability confirmation from event marshals.',
				time: 'Queued',
				done: false,
			},
			{
				title: 'Resolution',
				note: 'Pending completion of formal investigation.',
				time: 'Pending',
				done: false,
			},
		],
	},
	{
		id: 'UCC-7942',
		title: 'Persistent online sexual harassment in class group chat',
		status: 'CLOSED',
		submittedAt: '2026-03-11T08:20:00Z',
		zone: 'Department WhatsApp group',
		summary: 'Case closed after documented sanctions and digital conduct directives were issued.',
		timeline: [
			{
				title: 'Report submitted',
				note: 'Screenshots and report details submitted by complainant.',
				time: 'Mar 11, 08:20 AM',
				done: true,
			},
			{
				title: 'Under review',
				note: 'Case validated under university anti-sexual harassment policy.',
				time: 'Mar 11, 10:00 AM',
				done: true,
			},
			{
				title: 'Investigation',
				note: 'Respondent interviewed and digital evidence reviewed by panel.',
				time: 'Mar 12, 09:15 AM',
				done: true,
			},
			{
				title: 'Resolution',
				note: 'Outcome communicated; mandatory consent training and sanctions applied.',
				time: 'Mar 13, 03:40 PM',
				done: true,
			},
		],
	},
	{
		id: 'UCC-8411',
		title: 'Stalking concerns around residence hall corridor',
		status: 'SUBMITTED',
		submittedAt: '2026-03-08T16:20:00Z',
		zone: 'Valco Hall',
		summary: 'Student reported repeated monitoring and intimidation by an unknown person near the hostel.',
		timeline: [
			{
				title: 'Report submitted',
				note: 'Case generated and queued for immediate triage.',
				time: 'Mar 08, 04:20 PM',
				done: true,
			},
			{
				title: 'Under review',
				note: 'Pending assignment to a safeguarding officer.',
				time: 'Pending',
				done: false,
			},
			{
				title: 'Investigation',
				note: 'Awaiting initial interview and residence security review.',
				time: 'Pending',
				done: false,
			},
			{
				title: 'Resolution',
				note: 'Pending investigation outcome and safety planning.',
				time: 'Pending',
				done: false,
			},
		],
	},
]

import {
	AlertTriangle,
	Lock,
	ShieldCheck,
	Users,
	MessageSquare,
	Eye,
	Hand,
	Smartphone,
	Scale,
	FileText,
} from 'lucide-react'

export const stats = [
	{ icon: AlertTriangle, value: '4 Types', label: 'of harassment recognized by UCC policy' },
	{ icon: Lock, value: '100%', label: 'Confidential reporting guaranteed' },
	{ icon: ShieldCheck, value: 'Expert', label: 'Counseling and guidance available' },
	{ icon: Users, value: '3 Steps', label: 'Simple reporting process' },
]

export const harassmentTypes = [
	{
		Icon: MessageSquare,
		title: 'Verbal Harassment',
		description: 'Unwanted comments, sexual demands, threats, and derogatory language targeting individuals.',
		examples: ['Inappropriate jokes or remarks', 'Sexual comments about appearance', 'Verbal threats or intimidation'],
	},
	{
		Icon: Eye,
		title: 'Non-Verbal Harassment',
		description: 'Unwanted gestures, intrusive staring, stalking, or displaying offensive material.',
		examples: ['Leering or persistent staring', 'Offensive gestures or signs', 'Stalking behaviour on/off campus'],
	},
	{
		Icon: Hand,
		title: 'Physical Harassment',
		description: 'Any unwanted physical contact or physical intimidation, from touching to assault.',
		examples: ['Unwanted touching or groping', "Blocking someone's movement", 'Any form of physical assault'],
	},
	{
		Icon: Smartphone,
		title: 'Digital Harassment',
		description: 'Harassment carried out through messages, social media, images, or online platforms.',
		examples: ['Sending explicit messages or images', 'Non-consensual sharing of images', 'Online threats or cyberstalking'],
	},
]

export const rights = [
	{
		Icon: ShieldCheck,
		title: 'Right to Safety',
		description: 'Every student and staff member has the right to a safe learning and working environment, free from all forms of sexual harassment.',
	},
	{
		Icon: Lock,
		title: 'Right to Confidentiality',
		description: 'Your identity and the details of your report are kept strictly confidential. Only authorized CEGRAD personnel handle your case.',
	},
	{
		Icon: Scale,
		title: 'Right to Fair Process',
		description: 'All reports are investigated impartially. Both the complainant and the respondent are entitled to a fair hearing and due process.',
	},
	{
		Icon: FileText,
		title: 'Right to Support',
		description: 'You are entitled to counselling, academic accommodations, and protective measures throughout and after the reporting process.',
	},
]

export const consentPrinciples = [
	{ letter: 'F', title: 'Freely Given', desc: 'Consent must be given without pressure, manipulation, or being under the influence.' },
	{ letter: 'R', title: 'Reversible', desc: 'Anyone can change their mind at any time, even if they have said yes before.' },
	{ letter: 'I', title: 'Informed', desc: 'You must know exactly what you are agreeing to. Deception invalidates consent.' },
	{ letter: 'E', title: 'Enthusiastic', desc: 'Consent should be a clear, enthusiastic yes. Silence or reluctance is not consent.' },
	{ letter: 'S', title: 'Specific', desc: 'Saying yes to one thing does not mean saying yes to everything else.' },
]

export const policyPoints = [
	'The University of Cape Coast strictly prohibits all forms of sexual and gender-based harassment.',
	'The UCC Anti-Sexual Harassment Policy applies to all students, staff, faculty, and visitors on campus.',
	'Any person who experiences or witnesses harassment is encouraged to report it without fear of retaliation.',
	'CEGRAD is the designated body responsible for receiving, investigating, and resolving all reports of sexual harassment.',
	'Perpetrators face disciplinary action ranging from warnings to dismissal or expulsion, depending on the severity.',
]

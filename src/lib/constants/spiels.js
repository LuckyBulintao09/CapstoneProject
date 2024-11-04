import { Star, User, Users2, Warehouse } from 'lucide-react';

/* eslint-disable sort-keys */
const spiels = {
	// Admin
	ADMIN_CARD_HEADER: 'New Proprietors',
	ADMIN_MODAL_HEADER: 'New Proprietors Approval',

	// Home
	CTA_LABEL: 'Call to Action',
	CTA_DESCRIPTION: [
		'Stay in the loop with UniHomes! Sign up with your email to receive the latest updates.',
		'Don’t miss out — join our community today!',
	],
	FOOTER: '© 2024 UniHomes',
	HERO_BADGE: 'New Release',
	HERO_DESCRIPTION:
		'Find your perfect rental with ease. Search verified dorms, condos, and apartments, explore listings, and connect with homeowners—all in one simple platform.',
	HOW_IT_WORKS: 'How It Works',
	HOW_IT_WORKS_DESCRIPTION:
		'UniHomes simplifies finding rentals in Baguio. Browse listings, explore detailed property information, and connect with homeowners quickly and effortlessly.',
	HOW_IT_WORKS_CARDS: [
		{
			label: 'Search Property',
			description:
				'Use our search tools to find available rental properties in Baguio that meet your preferences, such as location, price range, and amenities.',
		},
		{
			label: 'Explore Property',
			description:
				'View detailed information for each property, including photos, descriptions, and nearby points of interest to help you make an informed decision.',
		},
		{
			label: 'Choose Property',
			description:
				'Once you’ve found the perfect rental, contact the homeowner directly through our platform to arrange a viewing or secure the property.',
		},
	],

	STATS_LABEL: 'STATS',
	STATS_HEADER: 'Here are some stats to look at',
	STATS_DATA: [
		{
			label: 'Clients',
			stat: '21K',
			description: '+21 since last hour',
			avatar: User,
		},
		{
			label: 'Properties',
			stat: '1200',
			description: '+21 since last hour',
			avatar: Warehouse,
		},
		{
			label: 'Lessors',
			stat: '100',
			description: '+21 since last hour',
			avatar: Users2,
		},
		{
			label: 'Ratings',
			stat: '200',
			description: '+21 since last hour',
			avatar: Star,
		},
	],
	TESTIMONIALS_LABEL: 'TESTIMONIALS',
	TESTIMONIALS_HEADER: 'Meet our happy clients',
	TESTIMONIALS_DESCRIPTION:
		'Discover how UniHomes has simplified the rental search process. Our satisfied clients share their experiences of finding verified dorms, condos, and apartments through our user-friendly platform.',

	//Favorites
	TAB_ALL: 'All',
	TAB_UNREAD: 'Unread',
	FAVORITES_SUBHEADER: 'Explore Saved Listings',

	// Messages
	MESSAGES_HEADER: 'Inbox',
	MESSAGES_NO_RESULT: 'No results found.',
	MESSAGES_NO_CHATS_SELECTED: 'No chats selected.',

	// Buttons
	BUTTON_APPROVE: 'Approve',
	BUTTON_YES_APPROVE: 'Yes, Approve',
	BUTTON_YES_REJECT: 'Yes, Reject',
	BUTTON_BACK: 'Back',
	BUTTON_BOOK_NOW: 'Book Now',
	BUTTON_CANCEL: 'Cancel',
	BUTTON_CONTINUE: 'Continue',
	BUTTON_CONFIRM: 'Confirm',
	BUTTON_DEACTIVATE: 'Deactivate',
	BUTTON_DEACTIVATE_ACCOUNT: 'Deactivate Account',
	BUTTON_DELETE: 'Delete',
	BUTTON_EXPLORE_NOW: 'Explore Now',
	BUTTON_FILTER: 'Filter',
	BUTTON_LEARN_MORE: 'Learn More',
	BUTTON_LOGIN: 'Login',
	BUTTON_NEXT: 'Next',
	BUTTON_PROCEED: 'Proceed',
	BUTTON_REJECT: 'Reject',
	BUTTON_RESET_FILTER: 'Reset Filters',
	BUTTON_SAVE: 'Save',
	BUTTON_SEND: 'Send',
	BUTTON_SEND_RESET_REQUEST: 'Send Reset Request',
	BUTTON_SET_APPOINTMENT: 'Set Appointment',
	BUTTON_SIGN_IN: 'Sign In',
	BUTTON_SIGN_UP: 'Sign Up',
	BUTTON_SUBMIT: 'Submit',
	BUTTON_SUBSCRIBE: 'Subscribe',
	BUTTON_VIEW: 'View',
	BUTTON_VIEW_ALL: 'View all',
	BUTTON_SHOW_LISTINGS: 'Show Listings',
	BUTTON_BACK_HOME: 'Back to Home',
	BUTTON_SEARCH: 'Search',
	BUTTON_VISIT_COMPANY: 'Visit Company Page',
	BUTTON_MESSAGE: 'Message',
	BUTTON_RESERVE: 'Reserve',
	BUTTON_UPDATE_PROFILE: 'Update Profile',
	BUTTON_DELETE_ACCOUNT: 'Delete Account',
	BUTTON_SEND_REQUEST: 'Send Request',
	BUTTON_KEEP: 'Keep',
	BUTTON_YES_KEEP: 'Yes, Keep',
	BUTTON_REMOVE: 'Remove',
	BUTTON_YES_REMOVE: 'Yes, Remove',
	BUTTON_START_NOW: 'Start Now',

	// INPUT FIELDS
	FORM_ADDRESS: 'Address',
	FORM_NAME: 'Name',
	FORM_EMAIL: 'Email',
	FORM_CONTACT_NUMBER: 'Contact Number',
	FORM_BIRTHDATE: 'Date of birth',
	FORM_GOVERNMENT_ID: 'Government ID',
	FORM_VIEW_GOVERNMENT_ID: 'View Government ID',
	FORM_BUSINESS_LICENSE: 'Business License',
	FORM_VIEW_BUSINESS_LICENSE: 'View Business License',

	NAVBAR_OVERALL_LIST: [
		{
			label: 'Home',
			href: '/',
			sessionRequired: false,
		},
		{
			label: 'Listings',
			href: '/client/listings',
			sessionRequired: false,
		},
		// For logged in users
		{
			label: 'Messages',
			href: '/chat/inbox',
			sessionRequired: true,
		},
		{
			label: 'Favorites',
			href: '/client/favorites',
			sessionRequired: true,
		},

		{
			label: 'Pricing',
			href: '/pricing',
			sessionRequired: false,
		},
	],
	NAVBAR_MENU_LIST_WITH_DROPDOWN: [
		{
			label: 'Home',
			href: '/',
			description: 'Description for Home',
		},
	],

	NAVBAR_MENU_LIST_WITHOUT_DROPDOWN: [
		{
			label: 'Listings',
			href: '/client/listings',
		},
		// For logged in users
		{
			label: 'Messages',
			href: '/chat/inbox',
		},
		{
			label: 'Favorites',
			href: '/client/favorites',
		},
		{
			label: 'Pricing',
			href: '/pricing',
		},
	],

	NAVBAR_HOME_MENUCONTENT: [
		{
			label: 'Introduction',
			href: 'home/introduction',
			description: 'What is UniHomes?',
		},
		{
			label: 'Features',
			href: 'home/features',
			description: 'How it works',
		},
		{
			label: 'Reviews and Ratings',
			href: 'home/reviewsandratings',
			description: 'Testimonials',
		},
	],

	//MODALS
	MODAL_APPROVE: 'Confirm Approval',
	MODAL_APPROVE_HEADER: 'Are you sure you want to approve this lessor?',
	MODAL_APPROVE_COMPANY_HEADER:
		'Are you sure you want to approve this company?',
	MODAL_REJECT: 'Confirm Rejection',
	MODAL_REJECTION_HEADER: 'Are you sure you want to reject this lessor?',
	MODAL_REJECT_COMPANY_HEADER: 'Are you sure you want to reject this company?',
	MODAL_KEEP: 'Confirm Keep',
	MODAL_REMOVE: 'Confirm Remove',
	MODAL_KEEP_HEADER: 'Are you sure you want to keep this review?',
	MODAL_REMOVE_HEADER: 'Are you sure you want to remove this review?',

	LOREM:
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem temporibus, sunt, cum provident inventore possimus in vitae voluptate voluptatibus aliquid, laboriosam perferendis velit veritatis a iusto. Perspiciatis eius repellendus suscipit id vel veritatis quod quae nisi dolore odit dignissimos accusantium laudantium a consequatur nostrum,tenetur atque excepturi quos obcaecati delectus?',
};

export default spiels;

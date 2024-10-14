import MessagesSection from '@/modules/messages/components/MessagesSection';
export const metadata = {
	title: 'Inbox | Unihomes',
	description: 'Web Platform',
  }
export default async function inbox() {
	return (
        <div>
            <MessagesSection />
        </div>
    );
}

import Recat from 'react'
import DashboardLayout from '../../modules/lessor-dashboard/components/DashboardLayout'

export const metadata = {
  title: 'Dashboard | Unihomes',
  description: 'Web Platform',
}
const LessorDashboard = ({ children } : { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default LessorDashboard
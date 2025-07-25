import Guard from '@/components/custom/guard'

function Dashboard() {
  return (
    <Guard action="view" resource="dashboard_page">
      <div>Dashboard</div>
    </Guard>
  )
}

export default Dashboard

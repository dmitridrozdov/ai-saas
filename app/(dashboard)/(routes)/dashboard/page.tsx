import { UserButton } from "@clerk/nextjs"

const DashboardPage = () => {
  return (
    <div>
      Dashboard protected
      <UserButton afterSignOutUrl="/"></UserButton>
    </div>
  )
}

export default DashboardPage
import { UserButton } from "@clerk/nextjs"

const DashboardPage = () => {
  return (
    <div>
      Dashboard protected
      <UserButton></UserButton>
    </div>
  )
}

export default DashboardPage
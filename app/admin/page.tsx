import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRound, Briefcase, CalendarClock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold tracking-tight mb-6">Hospital Management System</h1>
      <div className="flex flex-col justify-start items-start space-y-4">
        <div className="flex flex-col justify-start items-start">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Staff Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Staff Management
                </CardTitle>
                <CardDescription>Manage hospital staff information</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                Add, edit, and manage staff profiles. View staff details, qualifications, and departments.
                </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                <Link href="/admin/staff">Access Staff Management</Link>
                </Button>
            </CardFooter>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Workload Management
                </CardTitle>
                <CardDescription>Track and manage staff workloads</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                Record and analyze staff workloads, including patient counts, procedures, and hours worked.
                </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                <Link href="/admin/staff/workload">Access Workload Management</Link>
                </Button>
            </CardFooter>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Schedule Management
                </CardTitle>
                <CardDescription>Manage staff schedules and shifts</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                Create and manage staff schedules, including shift assignments, departments, and time periods.
                </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                <Link href="/admin/staff/schedule">Access Schedule Management</Link>
                </Button>
            </CardFooter>
            </Card>
        </div>
    </div>
    <div className="flex flex-col justify-start items-start">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Patient Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
    </div>
    </div>
    
      
    </div>
  )
}

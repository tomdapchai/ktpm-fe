"use client";

import { Staff } from "@/types/staff";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  Mail, Phone, MapPin, Calendar, Briefcase, Award, Tag, User } from "lucide-react"
import { format } from "date-fns"
import {useEffect, useState} from "react";
import { logout } from "@/lib/cookies";
import { Button } from "@/components/ui/button";

const page = () => {
    const [staff, setStaff] = useState<Staff>();
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/staff/me");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setStaff(data.data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [])

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/auth");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (!staff) {
        return <div>Loading...</div>;
    }

  return <div className="space-y-6">
  <div className="flex justify-between items-start">
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">{staff.fullName}</h2>
        <Badge
          variant={staff.staffType === "DOCTOR" ? "default" : staff.staffType === "NURSE" ? "secondary" : "outline"}
        >
          {staff.staffType}
        </Badge>
        <Badge variant={staff.active ? "success" : "destructive"}>{staff.active ? "Active" : "Inactive"}</Badge>
      </div>
      <p className="text-muted-foreground">
        {staff.position} - {staff.department}
      </p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleLogout}>Logout</Button>
    </div>
  </div>

  <Tabs defaultValue="personal" className="w-full">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="personal">Personal Info</TabsTrigger>
      <TabsTrigger value="professional">Professional Info</TabsTrigger>
      <TabsTrigger value="account">Account Info</TabsTrigger>
    </TabsList>

    <TabsContent value="personal" className="space-y-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Personal details of the staff member.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Phone Number</p>
                <p className="text-muted-foreground">{staff.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">{staff.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Date of Birth</p>
                <p className="text-muted-foreground">{format(new Date(staff.dateOfBirth), "PPP")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Gender</p>
                <p className="text-muted-foreground">{staff.gender}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="professional" className="space-y-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Professional details and qualifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Department</p>
                <p className="text-muted-foreground">{staff.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Position</p>
                <p className="text-muted-foreground">{staff.position}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Joining Date</p>
              <p className="text-muted-foreground">{format(new Date(staff.joiningDate), "PPP")}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Qualifications</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {staff.qualifications.length > 0 ? (
                  staff.qualifications.map((qualification, index) => (
                    <Badge key={index} variant="secondary">
                      {qualification}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No qualifications listed</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Specializations</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {staff.specializations.length > 0 ? (
                  staff.specializations.map((specialization, index) => (
                    <Badge key={index} variant="secondary">
                      {specialization}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No specializations listed</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="account" className="space-y-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Account details and status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <div>
              <p className="font-medium">Staff ID</p>
              <p className="text-muted-foreground">{staff.id}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div>
              <p className="font-medium">Status</p>
              <Badge variant={staff.active ? "success" : "destructive"} className="mt-1">
                {staff.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {staff.subject && (
            <div className="flex items-start gap-2">
              <div>
                <p className="font-medium">Subject</p>
                <p className="text-muted-foreground">{staff.subject}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Password information is not displayed for security reasons.
          </p>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</div>;
};

export default page;

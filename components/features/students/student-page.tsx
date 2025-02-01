"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Upload, User, Phone, Mail, Home, Book, GraduationCap, UserPlus, Calendar } from "lucide-react";
import { useGetStudentById } from "@/utils/hooks/query-hooks/students/use-get-student-by-id";
import { Student } from "@prisma/client";

export default function StudentPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);
  const { data: student, isLoading: studentLoading } = useGetStudentById();

  useEffect(() => {
    if(studentLoading) return;
    if (!studentLoading && student?.result) {
      setStudentInfo(student?.result);
    }
  }, [studentLoading, student?.result]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSwitchChange = (name: keyof Student) => (checked: boolean) => {
    setStudentInfo((prev) => (prev ? { ...prev, [name]: checked } : prev));
  };

  const handleSelectChange = (name: keyof Student) => (value: string) => {
    setStudentInfo((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated student info:", studentInfo);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentInfo((prev) => (prev ? { ...prev, image_url: reader.result as string } : prev));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Student Profile</CardTitle>
          {!isEditing && (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={studentInfo?.image_url || undefined} alt={studentInfo?.name || "Student"} />
                <AvatarFallback className="text-3xl">
                  {studentInfo?.name?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{studentInfo?.name}</h2>
                <p className="text-gray-500">{studentInfo?.email}</p>
                <div className="flex space-x-2 mt-2">
                  <Badge variant={studentInfo?.isVerified ? "default" : "secondary"}>{studentInfo?.isVerified ? "Verified" : "Unverified"}</Badge>
                  <Badge variant={studentInfo?.isOnBoarded ? "default" : "secondary"}>{studentInfo?.isOnBoarded ? "Onboarded" : "Not Onboarded"}</Badge>
                </div>
              </div>
            </div>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="academic">Academic Information</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <User className="h-4 w-4" /> <span>Full Name</span>
                    </Label>
                    <Input id="name" name="name" value={studentInfo?.name || ""} onChange={handleInputChange} disabled={!isEditing} required />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="academic" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" /> <span>Qualification</span>
                    </Label>
                    <Input id="qualification" name="qualification" value={studentInfo?.qualification || ""} onChange={handleInputChange} disabled={!isEditing} required />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            {isEditing && (
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client"
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import { onboardingSchema, Role } from "@/schemas"; // Assuming this schema includes a role field
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/utils/hooks/mutate-hooks/onboarding/use-onboarding";
import toast from "react-hot-toast";





interface OnboardingProps {
  onboardingOption: boolean;
}

type FormData = z.infer<typeof onboardingSchema>;

function OnboardingPage({ onboardingOption }: OnboardingProps) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const { mutate: onboard_user, isPending : onboarding } = useOnboarding();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.STUDENT); // Track role selection
  const fileInputRef = useRef<HTMLInputElement>(null);
  const classes_list = [
    { value: 1, label: "One" },
    { value: 2, label: "Two" },
    { value: 3, label: "Three" },
    { value: 4, label: "Four" },
    { value: 5, label: "Five" },
    { value: 6, label: "Six" },
    { value: 7, label: "Seven" },
    { value: 8, label: "Eight" },
    { value: 9, label: "Nine" },
    { value: 10, label: "Ten" },
    { value: 11, label: "Eleven" },
    { value: 12, label: "Twelve" },
  ] ;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      guardianName: "",
      email: "",
      address: "",
      qualification: "",
      role: "student",
      class : "one"
       // Default value for role

    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<FormData> = (values) => {
    const new_data = {
      ...values,
      image: image || "",
    };
    onboard_user({
      ...new_data,
      image,
    },{
      onSuccess : (res) =>{
        if(res.message && res.result){
          toast.success(res.message)
          // reset();
        }else if(res.error){
          toast.error(res.error)
        }
      },
      onError : (err) =>{
        toast.success(err.message || "Failed to do onboarding")
      }
    });
  };

  return (
    <Dialog open={onboardingOption}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Onboarding</DialogTitle>
          <DialogDescription>Update user details</DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                placeholder="Enter name"
                {...register("name")}
                disabled={onboarding}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                placeholder="Enter phone number"
                {...register("phoneNumber")}
                disabled={onboarding}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guardian Name
              </label>
              <Input
                placeholder="Enter guardian name"
                {...register("guardianName")}
                disabled={onboarding}
              />
              {errors.guardianName && (
                <p className="text-sm text-red-500">
                  {errors.guardianName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                placeholder="Enter email"
                {...register("email")}
                disabled={onboarding}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <Textarea
                placeholder="Enter address"
                {...register("address")}
                disabled={onboarding}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <Input
                placeholder="Enter qualification"
                {...register("qualification")}
                disabled={onboarding}
              />
              {errors.qualification && (
                <p className="text-sm text-red-500">
                  {errors.qualification.message}
                </p>
              )}
            </div>

            {/* Role select field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <Select
                disabled={onboarding}
                onValueChange={(value: Role) => {
                  setValue("role", value);
                  setSelectedRole(value); // Update the selected role
                }}
                defaultValue={Role.STUDENT}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.TEACHER}>Teacher</SelectItem>
                  <SelectItem value={Role.STUDENT}>Student</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Conditional "Class" field for students */}
            {selectedRole === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <Select
                  disabled={onboarding}
                 onValueChange={(value) => {
                  setValue("class", value);
                }}
                defaultValue={classes_list[0].label} // Adjust based on loading state if necessary
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                   {classes_list.map((item)=>(
                    <SelectItem
                      key={item.label}
                      value={item.label}
                      >
                        {item.value}
                        </SelectItem>
                   ))}
                  </SelectContent>
                </Select>
                {errors.class && (
                  <p className="text-sm text-red-500">{errors.class.message}</p>
                )}
              </div>
            )}

            {/* File upload and button sections */}
            <div className="flex justify-evenly items-center">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" 
                    disabled={onboarding}
                  >Upload Image</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="w-full">Upload Image</DialogTitle>
                    <DialogDescription>
                      Choose an image file to upload. You can drag and drop or
                      click to select.
                    </DialogDescription>
                  </DialogHeader>
                  <div
                    className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {preview ? (
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-40 mb-4"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                    )}
                    <Label htmlFor="image" className="cursor-pointer">
                      {image ? image.name : "Click to select or drag an image here"}
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setOpen(false)} disabled={!image}>
                      Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div>
                {image ? <span>{image.name}</span> : <span>No file selected</span>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              {onboarding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full"
            disabled={onboarding}
            >Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingPage;

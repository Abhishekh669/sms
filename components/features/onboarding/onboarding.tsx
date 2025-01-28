"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeftSquare, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { onboardingSchema } from "@/schemas";



type FormData = z.infer<typeof onboardingSchema>; // Generate TypeScript type from Zod schema

const formFields = [
  { name: "username" as const, label: "Username", type: "text" },
  { name: "email" as const, label: "Official Email", type: "email" },
  { name: "phoneNumber" as const, label: "Phone Number", type: "tel" },
  { name: "address" as const, label: "Address", type: "textarea" },
  { name: "guardianName" as const, label: "Guardian Name", type: "text" },
];

export default function InteractiveOnboardingForm() {
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  const nextStep = async () => {
    // Validate the current step's field
    const isStepValid = await trigger(formFields[step].name);
    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, formFields.length - 1));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Onboarding Form</Button>
      </DialogTrigger>
      <DialogContent className=" max-w-md mx-auto top-1/2 transform -translate-y-1/2">
        <button
          onClick={() => setStep(0)}
          className=" text-gray-500 hover:text-gray-700"
        >
          {step !== 0 &&(
            <ArrowLeftSquare size={24} />
          )}
        </button>
        <DialogTitle className="text-2xl font-bold mb-4">
          Complete Your Profile
        </DialogTitle>
        <div className="mb-4 bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((step + 1) / formFields.length) * 100}%` }}
          ></div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formFields.map((field, index) => (
            <div key={field.name} className={step === index ? "block" : "hidden"}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  {...register(field.name)}
                  id={field.name}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              ) : (
                <Input
                  {...register(field.name)}
                  id={field.name}
                  type={field.type}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}
          <div className="flex justify-between mt-6">
            {step > 0 && (
              <Button type="button" onClick={prevStep} variant="outline">
                Previous
              </Button>
            )}
            {step < formFields.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

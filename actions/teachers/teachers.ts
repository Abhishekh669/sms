"use server"

import { uploadFile } from "@/lib/upload"
import {prisma} from "@/lib/prisma"
import { StudentType } from "../students/students";

export const create_teacher = async(values :StudentType) =>{
    try {

        let image_url="";
        if(values.image){
            const generate_link = await uploadFile(values.image);
        if(!generate_link?.url){
            return {error : "failed to upload the image"}
        }
        image_url = generate_link?.url;
        }

        const exit_teacher = await prisma.teacher.findFirst({
            where : {userId : values.userId}
        });
        if(exit_teacher){
            return {error : "Aleady existed teacher"}
        }

        const new_teacher = await prisma.teacher.create({
           data : {
            name : values.name,
            phoneNumber : values.phoneNumber,
            guardianName : values.guardianName,
            email : values.email,
            image : values?.image?.name || "",
            address :values.address,
            image_url : image_url,
            userId : values?.userId,
            qualification : values?.qualification,
            isOnBoarded : true,
            role : "Teacher"
            
    }

        });
        if(!new_teacher){
            return {error : "failed to create the teacher"}
        }


        const update_user = await prisma.user.update({
            where : {id : values.userId},
            data : {
               isOnBoarded : true,
               role : "Teacher"
            }
        });

        if(!update_user){
            return {error : "Failed to onboard the user"}
        }
        return {
            message : "student create successfully",
            result : JSON.stringify(new_teacher)
        }
        
    } catch (error) {
        return {error  : "Failed to create teacher"}
        
    }
}


export const create_student = async (values: StudentType) => {
    try {
      let image_url = "";
  
      if (values.image) {
        const generate_link = await uploadFile(values.image);
        if (!generate_link?.url) {
          console.log("failed to upload the image");
          return { error: "failed to upload the image" };
        }
        image_url = generate_link?.url;
      }
  
      const exist_students = await prisma.student.findFirst({
        where: { userId: values.userId },
      });
      if (exist_students) {
        return { error: "Aleady existed students" };
      }
      const new_student = await prisma.student.create({
        data: {
          name: values.name,
          phoneNumber: values.phoneNumber,
          guardianName: values.guardianName,
          email: values.email,
          image: values?.image?.name || "",
          address: values.address,
          image_url: image_url,
          class: values?.class || "",
          userId: values?.userId,
          qualification: values?.qualification,
          isOnBoarded: true,
          role: "Student",
        },
      });
  
      if (!new_student) {
        return { error: "failed to create the students" };
      }
  
      const update_user = await prisma.user.update({
        where: { id: values.userId },
        data: {
          isOnBoarded: true,
          role: "Student",
        },
      });
  
      if (!update_user) {
        return { error: "Failed to onboard the user" };
      }
  
      return {
        message: "student create successfully",
        result: JSON.stringify(new_student),
      };
    } catch (error) {
      return { error: "Failed to create student" };
    }
  };
  
  export const authorize_teacher = async (id : string) => {
    try {
      const check_teacher = await prisma.teacher.findUnique({
        where: { id },
      });
      if (!check_teacher) {
        return { error: "No teacher found" };
      }
      const verify_teacher = await prisma.teacher.update({
        where: {
          id,
        },
        data: {
          isVerified: true,
        },
      });
      if (!verify_teacher) {
        return { error: "Failed to verify the students" };
      }
      const verify_user = await prisma.user.update({
        where: { id: verify_teacher.userId },
        data: {
          isVerified: true,
        },
      });
      if (!verify_user) {
        return { error: "Failed to verify the user" };
      }
      return {
        message: `Successfully verified the student ${verify_teacher.name}`,
        result: JSON.stringify(verify_teacher),
      };
    } catch (error) {
      return { error: "Failed to authorzie the teacher" };
    }
  };
  
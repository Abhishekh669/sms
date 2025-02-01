"use server";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";

export async function uploadFile(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Get current date details
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Month is zero-based
    const day = now.getDate();

    // Format time as 12-hour format with AM/PM
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";

    // Define file extension
    const fileExtension = file.type.split("/")[1] || "jpg"; // Default to jpg if no type

    // Format filename as "image_HH_MM_SS_AMPM.jpg"
    const filename = `image_${hours}_${minutes}_${seconds}_${ampm}.${fileExtension}`;

    // Create the directory structure: /public/uploads/YYYY_M_D/
    const uploadDir = `./public/uploads/${year}_${month}_${day}`;

    // Ensure directory exists
    try {
      await fs.stat(uploadDir);
    } catch (e: unknown) {
      const error = e as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        await fs.mkdir(uploadDir, { recursive: true });
      } else {
        console.error("Error while creating directory:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
      }
    }

    // Save the file
    const filePath = `${uploadDir}/${filename}`;
    await fs.writeFile(filePath, buffer);

    // Return relative file URL for the frontend
    const fileUrl = `/uploads/${year}_${month}_${day}/${filename}`;

    return {
      message  :"got file url",
      url : fileUrl
    };
  } catch (e) {
    return {error : "Failed to get file url"}
  }
}




export async function deleteFile(fileUrl: string) {
  try {
    // Convert fileUrl to local path (remove leading `/uploads/`)
    const filePath = `./public${fileUrl}`;

    // Check if the file exists before deleting
    try {
      await fs.stat(filePath);
    } catch (e: unknown) {
      const error = e as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        return {error : "file not found"}
      } else {
        return {error : "something went wrong"}
      }
    }

    // Delete the file
    await fs.unlink(filePath);

    return {message : "deleted successfully", result : true}
  }catch(e){
    return {error : "failed to delete image"}
  }
}

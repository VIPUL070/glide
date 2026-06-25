import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file: Blob): Promise<string | null> => {
  // 1. If no file is provided, exit early with null
  if (!file) {
    console.error("Upload failed: No file provided.");
    return null;
  }

  try {
    // 2. Convert the frontend/browser 'Blob' into a format Node.js can read
    // First, convert it to a raw binary ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Then, convert that ArrayBuffer into a Node.js 'Buffer'
    const buffer = Buffer.from(arrayBuffer);

    // 3. To make it play nicely with modern 'async/await', we wrap it in a custom Promise.
    return await new Promise<string | null>((resolve, reject) => {
      
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Let Cloudinary auto-detect if it's an image, video, or raw file
        
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error("Cloudinary stream error:", error);
            reject(error);
          } else {
            // If successful, extract the secure URL. 
            resolve(result?.secure_url ?? null);
          }
        }
      );

      // 4. Write our file buffer to the stream and close it.
      // This is what actually triggers the upload.
      uploadStream.end(buffer);
    });

  } catch (error) {
    console.error("Error during Cloudinary upload process:", error);
    return null; 
  }
};

export default uploadOnCloudinary;
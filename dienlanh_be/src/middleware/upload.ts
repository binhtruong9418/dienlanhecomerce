// upload.ts
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, WEBP)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Upload to Cloudinary
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `dienlanh/${folder}`,
        resource_type: 'auto',
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

// Middleware để upload và gắn URL vào request
export const uploadSingleToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }

    const { folder } = req.body;
    const url = await uploadToCloudinary(req.file, folder || 'general');
    
    // Gắn URL vào request
    (req as any).fileUrl = url;
    
    next();
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string
): Promise<string[]> => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file, folder)
  );
  return Promise.all(uploadPromises);
};

// Middleware cho multiple files
export const uploadMultipleToCloudinaryMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return next();
    }

    const { folder } = req.body;
    const urls = await uploadMultipleToCloudinary(files, folder || 'general');
    
    // Gắn URLs vào request
    (req as any).fileUrls = urls;
    
    next();
  } catch (error) {
    next(error);
  }
};
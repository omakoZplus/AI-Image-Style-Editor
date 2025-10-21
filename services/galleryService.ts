import type { GalleryImage } from '../types';
import { addImageToDb, getAllImagesFromDb, deleteImageFromDb } from './dbService';

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
    return await getAllImagesFromDb();
};

export const saveImageToGallery = async (dataUrl: string): Promise<GalleryImage[]> => {
    const currentImages = await getGalleryImages();
    
    // Simple check to prevent saving the exact same data URL again
    if (currentImages.some(image => image.dataUrl === dataUrl)) {
        return currentImages;
    }

    const newImage: GalleryImage = {
        id: Date.now(),
        dataUrl: dataUrl,
    };

    await addImageToDb(newImage);

    // Re-fetch to ensure we have the latest sorted list from the DB
    return await getGalleryImages();
};

export const deleteImageFromGallery = async (id: number): Promise<GalleryImage[]> => {
    await deleteImageFromDb(id);
    return await getGalleryImages();
};

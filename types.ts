export interface ArtStyle {
  id: string;
  name: string;
  prompt: string;
  imageUrl: string;
  description: string;
}

export interface GalleryImage {
  id: number; // Using timestamp for simplicity
  dataUrl: string;
}

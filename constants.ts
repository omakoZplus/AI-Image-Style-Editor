import type { ArtStyle } from './types';

export const ART_STYLES: ArtStyle[] = [
  {
    id: 'rezero',
    name: 'Re:Zero',
    prompt: "Completely redraw and recreate the character(s) from the provided image in the art style of the anime 'Re:Zero − Starting Life in Another World'. Do not simply edit or apply a filter. This is a full re-rendering task. Faithfully replicate the style's distinct eye design with detailed irises, the soft and slightly desaturated color palette, and the expressive, emotional faces. The original character's pose, clothing, and key features must be preserved, but rendered entirely from scratch in the Re:Zero art style to ensure consistency.",
    imageUrl: 'https://placehold.co/200x200/A084E8/FFFFFF?text=Re:Zero',
    description: "Re:Zero − Starting Life in Another World is a Japanese light novel series written by Tappei Nagatsuki. The story centers on Subaru Natsuki, a hikikomori who is suddenly transported to another world. The series' art style is known for its detailed character designs, expressive eyes that convey a wide range of emotions, and a vibrant yet sometimes dark fantasy aesthetic.",
  },
  {
    id: 'naruto',
    name: 'Naruto',
    prompt: "Recreate the character(s) from scratch in the iconic art style of the 'Naruto' anime and manga. Avoid filters or simple edits to the original. The goal is a complete artistic transformation. Apply bold, dynamic line work, characteristic facial structures, and energetic expressions. The original pose, clothing, and composition must be maintained, but completely re-rendered in the distinct Naruto style.",
    imageUrl: 'https://placehold.co/200x200/FF7F00/FFFFFF?text=Naruto',
    description: "Naruto, created by Masashi Kishimoto, is a Japanese manga series about Naruto Uzumaki, an adolescent ninja who dreams of becoming the leader of his village. The art style is iconic for its dynamic action sequences, distinct character designs, and a visual language that blends traditional Japanese aesthetics with a modern, energetic feel.",
  },
  {
    id: 'dragonball',
    name: 'Dragon Ball',
    prompt: "Completely re-imagine and redraw the character(s) in the art style of 'Dragon Ball Z'. This is not an editing task; it is a full recreation. Focus on the sharp, angular character designs, defined musculature, and a sense of explosive energy. Preserve the original character's core design and pose, but render them entirely from the ground up with the high-octane, vibrant aesthetic of Dragon Ball Z.",
    imageUrl: 'https://placehold.co/200x200/F08030/FFFFFF?text=Dragon+Ball',
    description: "Dragon Ball is a Japanese media franchise created by Akira Toriyama. The series follows Son Goku's adventures as he trains in martial arts. The art style, particularly from Dragon Ball Z, is famous for its angular and muscular character designs, spiky hair, and intense, high-energy action scenes, defining a generation of shōnen anime.",
  },
  {
    id: 'uma-musume',
    name: 'Uma Musume',
    prompt: "Fully adapt and redraw the image in the art style of 'Uma Musume Pretty Derby'. Do not apply a simple filter; this requires a complete re-rendering. The style is defined by bright, cheerful aesthetics, incredibly detailed and colorful outfits, and large, expressive, shimmering eyes. Maintain the character's original identity and pose, but translate their appearance entirely into the high-detail, vibrant, and polished world of Uma Musume.",
    imageUrl: 'https://placehold.co/200x200/32CD32/FFFFFF?text=Uma+Musume',
    description: "Uma Musume Pretty Derby is a multimedia franchise about 'horse girls'—famous racehorses reborn as girls. They train to become the best racers. The art style is characterized by its bright, idol-like aesthetic, featuring detailed outfits, large, expressive eyes with intricate highlights, and a vibrant, high-energy presentation.",
  },
  {
    id: 'project-sekai',
    name: 'Project Sekai!',
    prompt: "Completely transform and redraw this image into the art style of 'Project Sekai! Colorful Stage'. This is a re-creation, not a filter. The style features modern, stylish designs with a vibrant, digital 'virtual singer' aesthetic. Pay close attention to intricate hair and clothing details, clean cel-shading, and a colorful, pop-art inspired flair. The original character and pose must be recognizable but fully and consistently integrated into this new style from scratch.",
    imageUrl: 'https://placehold.co/200x200/1E90FF/FFFFFF?text=Project+Sekai!',
    description: "Project Sekai! Colorful Stage is a Japanese mobile rhythm game featuring virtual singers like Hatsune Miku. Its art style is modern and stylish, reflecting a digital, pop-art inspired world. It's known for its trendy character designs, intricate hair and clothing, and a vibrant, high-tech aesthetic.",
  },
  {
    id: 'persona',
    name: 'Persona',
    prompt: "Completely redesign and redraw the character(s) in the slick, high-contrast art style of the 'Persona' series (specifically Persona 5). Do not simply edit the original; create a new image from scratch. Use a sharp, cel-shaded look with heavy, stylized shadows and bold outlines. Incorporate the iconic motifs of red, black, and white to give the final image a stylish, edgy, and graphic feel, while retaining the original subject's core characteristics and pose.",
    imageUrl: 'https://placehold.co/200x200/FF0000/FFFFFF?text=Persona',
    description: "Persona is a series of role-playing games developed by Atlus. The art style, especially from Persona 5, is renowned for its slick, high-contrast, cel-shaded visuals. It uses a distinct color palette (often red, black, and white) and bold, graphic user interfaces to create an edgy and unmistakable look.",
  },
];
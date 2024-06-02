

export type ProjectInfo = {
  title: string;
  description: string;
  date: string;
  link: string;
}

export const PROJECTS: ProjectInfo[] = [
  {
    title: "Nano Diffusion",
    description: "A project that uses diffusion models for image generation",
    date: "2022-01-01",
    link: "https://github.com/sarath-menon/nano-diffusion",
  },
  {
    title: "Transformer for Image Generation",
    description: "A project that uses transformers for image generation",
    date: "2022-02-01",
    link: "https://github.com/sarath-menon/transformer-image-gen",
  },
  {
    title: "Patch Embedding",
    description: "A project that uses patch embedding for image processing",
    date: "2022-03-01",
    link: "https://github.com/sarath-menon/patch-embedding",
  },
];

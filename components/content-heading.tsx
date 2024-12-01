import { slug as slugify } from "github-slugger";

export function contentHeading(level: number) {
  return function Heading({ children }: { children: React.ReactNode }) {
    const id = typeof children === "string" ? slugify(children) : undefined;
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return <Tag id={id}>{children}</Tag>;
  };
}

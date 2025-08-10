import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
};

const Seo = ({ title, description, canonicalPath }: SeoProps) => {
  useEffect(() => {
    document.title = title;

    const descSelector = 'meta[name="description"]';
    let desc = document.head.querySelector<HTMLMetaElement>(descSelector);
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    if (description) desc.content = description;

    // canonical
    const existingLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const link = existingLink ?? document.createElement('link');
    link.setAttribute('rel', 'canonical');
    const origin = window.location.origin;
    const path = canonicalPath ?? window.location.pathname;
    link.setAttribute('href', origin + path);
    if (!existingLink) document.head.appendChild(link);
  }, [title, description, canonicalPath]);

  return null;
};

export default Seo;

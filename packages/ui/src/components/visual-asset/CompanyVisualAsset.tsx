import './company-visual-asset.css';

export type CompanyVisualAssetItem = {
  src: string;
  alt: string;
  label: string;
};

export function CompanyVisualAsset({ src, alt, label }: CompanyVisualAssetItem) {
  return (
    <figure className="company-visual-asset">
      <img src={src} alt={alt} />
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export function CompanyVisualAssetGallery({ items }: { items: CompanyVisualAssetItem[] }) {
  return (
    <div className="company-visual-asset-gallery">
      {items.map((item) => <CompanyVisualAsset key={item.src} {...item} />)}
    </div>
  );
}

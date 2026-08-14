import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="page">
      <div className="cat-head top">
        <h1 className="display cat-title">
          PAGE NOT
          <br />
          FOUND.
        </h1>
        <p className="cat-summary">
          That link doesn&rsquo;t point anywhere. The work is still here.
        </p>
        <p className="cat-back">
          <Link href="/" className="back-link">
            <Icon name="arrow-left" size={14} /> BACK TO WORK
          </Link>
        </p>
      </div>
    </div>
  );
}

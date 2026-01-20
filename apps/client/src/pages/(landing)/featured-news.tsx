import { Link } from "@heroui/react";
import { LucideChevronRight } from "lucide-react";

import type { News } from "~/models/News";

interface FeaturedNewsProps {
  news: News[];
}

export default function FeaturedNews({ news }: FeaturedNewsProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-5" id="news">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="grid gap-1">
          <h4 className="text-2xl font-semibold">Öne Çıkan Haberler</h4>
          <p className="text-muted">
            Bu bölümde, dergimizin en son haberlerini ve duyurularını bulabilirsiniz. Edebiyat
            dünyasındaki gelişmeleri takip edin, etkinliklerimize katılın ve dergimizin sunduğu
            yeniliklerden haberdar olun.
          </p>
        </div>
        <div className="flex items-end justify-end">
          <Link color="foreground" href="/news">
            Tüm Haberleri Görüntüle
            <LucideChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

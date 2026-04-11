import { AuctionCard } from "@/components/auction/auction-card";
import type { AuctionItem } from "@/lib/mock-data";

interface RenderAuctionItemDeps {
  favoriteIds: Set<string>;
  toggleFavorite: (id: string) => void;
}

export function createAuctionRenderItem({
  favoriteIds,
  toggleFavorite,
}: RenderAuctionItemDeps) {
  const renderItem = ({ item }: { item: AuctionItem }) => (
    <AuctionCard
      id={item.id}
      type={item.type}
      title={item.title}
      address={item.address}
      auctionDate={item.auctionDate}
      appraisalPrice={item.appraisalPrice}
      minimumBid={item.minimumBid}
      bidRatio={item.bidRatio}
      failedBids={item.failedBids}
      area={item.area}
      thumbnailUrl={item.thumbnailUrl}
      isFavorited={favoriteIds.has(item.id)}
      onToggleFavorite={toggleFavorite}
      investmentRating={item.investmentRating}
      marketGapRate={item.marketGapRate}
      latestTradeAmount={item.latestTradeAmount}
    />
  );
  renderItem.displayName = "AuctionRenderItem";
  return renderItem;
}

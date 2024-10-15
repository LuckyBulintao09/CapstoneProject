import { IconSearch, IconStar, IconHighlight } from "@tabler/icons-react";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const items = [
  {
    icon: <IconSearch size={32} className="mb-2" />,
    title: "Increased Visibility",
    description: "Increased visibility on search results.",
    className: "col-span-2 border border-black",
  },
  {
    icon: <IconStar size={32} className="mb-2" />,
    title: "Featured Placement",
    description: "Featured placement on the homepage.",
    className: "border border-black",
  },
  {
    icon: <IconHighlight size={32} className="mb-2" />,
    title: "Highlighted Status",
    description: "Highlighted status for potential guests.",
    className: " border border-black",
  },
];

const Boost1 = () => {
  return (
    <BentoGrid className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
      {items.map((item) => (
        <BentoGridItem key={item.title} {...item} className={item.className} />
      ))}
    </BentoGrid>
  );
};
export default Boost1;

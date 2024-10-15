import { IconCash, IconEye, IconCalculator } from "@tabler/icons-react";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const items = [
  {
    icon: <IconCash size={32} className="mb-2" />,
    title: "Affordable",
    description: "Only pay when you earn!",
    className: "row-span-2 border border-black",
  },
  {
    icon: <IconEye size={32} className="mb-2" />,
    title: "Transparent",
    description: "No hidden fees or surprise charges.",
    className: " border border-black",
  },
  {
    icon: <IconCalculator size={32} className="mb-2" />,
    title: "Simple",
    description:
      "Easy to calculate, so you can focus on managing your property.",
    className: "col-start-2 row-start-2 border border-black",
  },
];

const WhyChoose1 = () => {
  return (
    <BentoGrid className="grid grid-cols-2 grid-rows-2 gap-4">
      {items.map((item) => (
        <BentoGridItem key={item.title} {...item} className={item.className} />
      ))}
    </BentoGrid>
  );
};
export default WhyChoose1;

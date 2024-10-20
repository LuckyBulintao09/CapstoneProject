import spiels from "@/lib/constants/spiels";
import { Separator } from "@radix-ui/react-dropdown-menu";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center py-2 dark:bg-secondary">
      <Separator className="w-full h-px bg-blue-500 opacity-30 my-2" />
      <p className="text-xs text-muted-foreground"> 
        {spiels.FOOTER} |{" "}
        <a href="#" className="hover:text-blue-500 hover:underline">
          Terms and Conditions
        </a>{" "}
        | All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

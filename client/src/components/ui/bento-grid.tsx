import { cn } from "@/lib/utils";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  price,
  availability
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  availability: string;
  price: number
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col ",
        className
      )}
    >
      <div className="group-hover/bento:translate-x-2 transition duration-200 flex flex-col justify-evenly">
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
        <div className="font-sans flex justify-between items-center font-semibold text-neutral-600 text-md mt-4 dark:text-neutral-300">
          Rs.{price} ({availability})
          <div className="w-[25%] flex justify-between">
            <span className='hover:bg-gray-100 rounded-full p-1'>
              <MdDelete className='h-4 w-4 cursor-pointer' />
            </span>
            <span className='hover:bg-gray-100 rounded-full p-1'>
              <FaEdit className='h-4 w-4 cursor-pointer' />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

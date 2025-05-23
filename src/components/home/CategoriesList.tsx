
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {categories} from "@/utils/categories";
import Link from "next/link";

function CategoriesList({category ,search}:{category?:string, search?:string} ) {

    const searchTerm = search? `&search=${search}`:"";
    return (
      <ScrollArea className="py-6">
<div className="flex gap-x-4">
    {categories.map((item)=>{
        const isActive = item.label === category;
        return (
            <Link key={item.label} href={`/?category=${item.label}&search=${searchTerm}`}>
                <article className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[100px] ${isActive ? "text-primary":""}` }>
                    <item.icon className="w-8 h-8" />
                    <p className="capitalize text-sm mt-1">
                        {item.label}
                    </p>
                </article>
            </Link>
        )
    })}
</div>
          <ScrollBar orientation="horizontal"/>
      </ScrollArea>
    );
}

export default CategoriesList;
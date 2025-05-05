import CategoriesList from "@/components/home/CategoriesList";
import PropertiesContainer from "@/components/home/PropertiesContainer";
import {Suspense} from "react";
import LoadingCards from "@/components/card/LoadingCards";

// Define the props correctly (no Promise needed)
interface PageProps {
    searchParams?: {
        category?: string;
        search?: string;
    };
}

async function HomePage({ searchParams }: PageProps) {
    const { category, search } = searchParams || {};

    return (
        <section>
            <CategoriesList
                category={category}
                search={search}
            />
            <Suspense fallback={<LoadingCards />}>
                <PropertiesContainer
                    category={category}
                    search={search}
                />
            </Suspense>
        </section>
    );
}

export default HomePage;
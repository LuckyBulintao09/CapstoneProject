import ListingsScreen from "@/modules/listing/screens/ListingsScreen";

export const metadata = {
    title: "Listings | Unihomes",
    description: "Web Platform",
};
export default async function searchListing() {
    return (
        <div>
            <ListingsScreen />
        </div>
    );
}

import FavoritesScreen from "@/modules/favorites/screens/FavoritesScreen";
export const metadata = {
    title: "Favorites | Unihomes",
    description: "Web Platform",
};
export default async function favorites() {
    return (
        <div>
            <FavoritesScreen />
        </div>
    );
}

import { createClient } from "@/utils/supabase/client";
const supabase = createClient();


export const handleDeleteAccount = async () => {
	try {
		const { data, error } = await supabase.auth.getUser();
		if (error) throw new Error("Could not get the current user");

		const userId = data.user.id;

		// Delete from auth
		const { error: authError } = await supabase.auth.admin.deleteUser(userId);
		if (authError) throw new Error(authError.message);

		// Delete from profile table
		const { error: accountError } = await supabase.from("account").delete().eq("id", userId);
		if (accountError) throw new Error(accountError.message);

		return { success: "Account deleted successfully." };
	} catch (error) {
		return { error: error.message };
	}
};

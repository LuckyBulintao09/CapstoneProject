
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchLandmarks = async () => {
    const {data, error} = await supabase
        .rpc('get_landmarks')

    if (error) {
        console.log(error)
        return null
    }
    return data
}
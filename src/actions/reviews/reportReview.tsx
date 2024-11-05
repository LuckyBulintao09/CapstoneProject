"use server"
import { createClient } from "@/utils/supabase/server"

const supabase = createClient()

export async function reportReview(reviewId: number, reason: string) {

    const { data, error } = await supabase
        .from('ratings_review')
        .update({ isReported: true, report_reason: reason })
        .eq('id', reviewId)

    if (error) {
        console.error(error)
        return false
    }

    return true
}
'use server'


import { createClient } from '@/utils/supabase/server'

const supabase = createClient()
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()


//THESE ARE ALL COUNTS WITHIN THE LAST HOUR
export const getTotalReservations = async () => {
    const { count, error } = await supabase
        .from('transaction')
        .select('id', { count: 'exact' })
        .gte('created_at', oneHourAgo)

    if (error) {
        console.error(error)
        return null
    }

    // console.log(count)
    return count
}

export const getTotalRatings = async () => {
    const { count, error } = await supabase
        .from('ratings_review')
        .select('id', { count: 'exact' })
        .gte('created_at', oneHourAgo)

    if (error) {
        console.error(error)
        return null
    }

    // console.log(count)
    return count
}

export const getTotalProperties = async () => {
    const { count, error } = await supabase
        .from('unit')
        .select('id', { count: 'exact' })
        .gte('created_at', oneHourAgo)

    if (error) {
        console.error(error)
        return null
    }

    // console.log(count)
    return count
}

export const getTotalLessors = async () => {
    const { count, error } = await supabase
        .from('account')
        .select('id', { count: 'exact' })
        .gte('approved_at', oneHourAgo)

    if (error) {
        console.error(error)
        return null
    }

    // console.log(count)
    return count
}

export const getTopReviews = async () => {
    const { data, error } = await supabase
        .from('ratings_review')
        .select('id, comment, ratings, account (firstname, lastname)')
        .eq('ratings', 5)
        .limit(3)

    if (error) {
        console.error(error)
        return null
    }

    
    return data
}


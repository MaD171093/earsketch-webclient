import audiokeysURL from "../data/audiokeys_recommendations.json"
import beatDataURL from "../data/beat_similarity_indices.json"

export async function getRecommendationData() {
    return (await fetch(audiokeysURL)).json()
}

export async function getBeatData() {
    return (await fetch(beatDataURL)).json()
}

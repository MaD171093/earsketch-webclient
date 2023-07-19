// Automated Creativity Assessment for CAI (Co-creative Artificial Intelligence) Project.
import { Report } from "./analysis"
import { Results } from "./complexityCalculator"
import { audiokeysPromise, beatsPromise } from "../app/recommender"
import NUMBERS_AUDIOKEYS from "../data/numbers_audiokeys"
import { Script } from "common"
import { mean } from "lodash"

export interface Assessment {
    fluency: {
        numSounds: number
        numTracks: number
        numInstruments: number
    }

    flexibility: {
        genres: number
    }

    originality: {
        avgSoundsCooccurence: number
    }

    elaboration: {
        lengthSeconds: number
        lengthMeasures: number
    }

    complexity: {
        breadth: number
        avgDepth: number
        rhythmicComplexity: number
        beatComplexity: number
    }

    effort: {
        timeOnTask: number
    }

    divergentThinking: number
    creativeProduct: number
    creativityScore: number
}

function emptyAssessment(): Assessment {
    return {
        fluency: {
            numSounds: 0,
            numTracks: 0,
            numInstruments: 0,
        },
        flexibility: {
            genres: 0,
        },
        originality: {
            avgSoundsCooccurence: 0,
        },
        elaboration: {
            lengthSeconds: 0,
            lengthMeasures: 0,
        },
        complexity: {
            breadth: 0,
            avgDepth: 0,
            rhythmicComplexity: 0,
            beatComplexity: 0,
        },
        effort: {
            timeOnTask: 0,
        },
        divergentThinking: 0,
        creativeProduct: 0,
        creativityScore: 0,
    }
}

function average(assessment: Assessment, subfacet: keyof Assessment) {
    const values: number [] = []
    for (const value of Object.values(assessment[subfacet])) {
        values.push(value)
    }
    return mean(values)
}

export async function assess(script: Script, complexity: Results, analysisReport: Report): Promise<Assessment> {
    const assessment = emptyAssessment()

    const uniqueSounds: string [] = []
    const uniqueTracks: number [] = []
    const uniqueInstruments: string [] = []
    const uniqueGenres: string [] = []

    for (const measure of Object.keys(analysisReport.MEASUREVIEW)) {
        for (const item of analysisReport.MEASUREVIEW[Number(measure)]) {
            if (!uniqueTracks.includes(item.track)) {
                uniqueTracks.push(item.track)
            }
            if (item.type === "sound" && item.instrument && item.genre) {
                if (!uniqueSounds.includes(item.name)) {
                    uniqueSounds.push(item.name)
                }
                if (!uniqueInstruments.includes(item.instrument)) {
                    uniqueInstruments.push(item.instrument)
                }
                if (!uniqueGenres.includes(item.genre)) {
                    uniqueGenres.push(item.genre)
                }
            }
        }
    }

    // Fluency = Average (z-# of sounds, z-tracks, z-instruments)
    assessment.fluency = {
        numSounds: uniqueSounds.length,
        numTracks: uniqueTracks.length,
        numInstruments: uniqueInstruments.length,
    }

    // Flexibility = z-# of genres
    assessment.flexibility.genres = uniqueGenres.length

    // Originality = z- sound co-occurrence
    let cooccurence = 0
    let beatComplexity = 0
    let rhythmicComplexity = 0

    for (const soundA of uniqueSounds) {
        const audioNumberA = Object.keys(NUMBERS_AUDIOKEYS).find(n => NUMBERS_AUDIOKEYS[n] === soundA)
        if (!audioNumberA) { continue }
        const audioRec = (await audiokeysPromise)[audioNumberA]
        if (!audioRec) { continue }
        for (const soundB of uniqueSounds) {
            if (soundA === soundB) { continue }
            const audioNumberB = Object.keys(NUMBERS_AUDIOKEYS).find(n => NUMBERS_AUDIOKEYS[n] === soundB)
            if (audioNumberA && audioNumberB) {
                if (audioRec !== undefined) {
                    for (const [num, value] of Object.entries(audioRec)) {
                        if (num === audioNumberB) {
                            cooccurence += value[1]
                        }
                    }
                    const bestBeats = (await beatsPromise)[audioNumberA] as number[]
                    for (const beat of bestBeats) {
                        if (NUMBERS_AUDIOKEYS[beat] === soundB) {
                            beatComplexity += 0
                            rhythmicComplexity += 0
                        }
                    }
                }
            }
        }
    }
    assessment.originality.avgSoundsCooccurence = cooccurence / uniqueSounds.length

    // Elaboration = Average (z-length seconds, measures)
    assessment.elaboration = {
        lengthSeconds: analysisReport.OVERVIEW["length (seconds)"],
        lengthMeasures: analysisReport.OVERVIEW.measures,
    }

    // Music Complexity = Average (z-entropy and z-cohesion)
    // Code Complexity = Average (z-breadth and z-Avg. Depth)
    // Complexity = Average (2 & 3)
    assessment.complexity = {
        breadth: complexity.depth.breadth,
        avgDepth: complexity.depth.avgDepth,
        rhythmicComplexity,
        beatComplexity,
    }

    // Effort = z-time on task
    assessment.effort.timeOnTask = 0

    // Divergent Thinking = Average (4, 5, 6, 7)
    assessment.divergentThinking = mean([average(assessment, "fluency"), average(assessment, "flexibility"), average(assessment, "originality"), average(assessment, "elaboration")])

    // Creative Product = Average (8, 9)
    assessment.creativeProduct = mean([average(assessment, "complexity"), average(assessment, "effort")])

    // Creativity in ES = Average (10, 11)
    assessment.creativityScore = mean([assessment.divergentThinking, assessment.creativeProduct])

    return assessment
}

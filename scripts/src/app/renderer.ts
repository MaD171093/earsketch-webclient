// Render scripts using an offline audio context.
import * as applyEffects from "../model/applyeffects"
import esconsole from "../esconsole"
import { Clip, Project } from "./player"
import { OfflineAudioContext } from "./audiocontext"
import { TempoMap } from "./tempo"

const NUM_CHANNELS = 2
const SAMPLE_RATE = 44100

// Render a result for offline playback.
export async function renderBuffer(result: Project) {
    esconsole("Begin rendering result to buffer.", ["debug", "renderer"])

    const origin = 0
    const tempoMap = new TempoMap(result)
    const duration = tempoMap.measureToTime(result.length + 1) // need +1 to render to end of last measure
    const context = new OfflineAudioContext(NUM_CHANNELS, SAMPLE_RATE * duration, SAMPLE_RATE)
    const mix = context.createGain()

    result.master = context.createGain()

    // we must go through every track and every audio clip and add each of
    // them to the audio context and start them at the right time
    // don't include the last track because we assume that's the metronome
    // track
    for (let i = 0; i < result.tracks.length - 1; i++) {
        const track = result.tracks[i]

        // dummy node
        // TODO: implement our custom analyzer node
        track.analyser = context.createGain() as unknown as AnalyserNode

        const startNode = applyEffects.buildAudioNodeGraph(
            context, mix, track, i, tempoMap,
            origin, result.master, [], false
        )

        const trackGain = context.createGain()
        trackGain.gain.setValueAtTime(1.0, context.currentTime)

        // TODO: Reduce duplication with `player`.
        for (const clip of track.clips) {
            const clipBufferStartTime = tempoMap.measureToTime(clip.measure + (clip.start - 1))
            const clipStartTime = tempoMap.measureToTime(clip.measure)
            const clipEndTime = tempoMap.measureToTime(clip.measure + (clip.end - clip.start))
            // create the audio source node to contain the audio buffer
            // and play it at the designated time
            const source = new AudioBufferSourceNode(context, { buffer: clip.audio })

            // Start/end locations within the clip's audio buffer, in seconds.
            const startTimeInClip = clipStartTime - clipBufferStartTime
            // the clip duration may be shorter than the buffer duration
            let clipDuration = clipEndTime - clipStartTime

            if (origin > clipEndTime) {
                // case: clip is playing in the past: skip the clip
                continue
            } else if (origin >= clipStartTime && origin < clipEndTime) {
                // case: clip is playing from the middle
                // calculate the offset and begin playing
                const clipStartOffset = origin - clipStartTime
                clipDuration -= clipStartOffset
                source.start(context.currentTime, startTimeInClip + clipStartOffset, clipDuration - clipStartOffset)
                // keep this flag so we only stop clips that are playing
                // (otherwise we get an exception raised)
                clip.playing = true
            } else {
                // case: clip is in the future
                // calculate when it should begin and register it to play
                const untilClipStart = clipStartTime - origin
                source.start(context.currentTime + untilClipStart, startTimeInClip, clipDuration)
                clip.playing = true
            }

            source.connect(trackGain)
            // keep a reference to this audio source so we can pause it
            clip.source = source
            clip.gain = trackGain // used to mute the track/clip
        }

        // if master track
        if (i === 0) {
            // master limiter for reducing overload clipping
            const limiter = context.createDynamicsCompressor()
            limiter.threshold.value = -1
            limiter.knee.value = 0
            limiter.ratio.value = 10000 // high compression ratio
            limiter.attack.value = 0 // as fast as possible
            limiter.release.value = 0.1 // could be a bit shorter

            result.master.connect(limiter)
            limiter.connect(trackGain)

            if (startNode !== undefined) {
                // TODO: the effect order (limiter) is not right
                trackGain.connect(startNode)
            } else {
                trackGain.connect(mix)
            }

            mix.connect(context.destination)
        } else {
            if (startNode !== undefined) {
                // track gain -> effect tree
                trackGain.connect(startNode)
            } else {
                // track gain -> (bypass effect tree) -> analyzer & master
                trackGain.connect(track.analyser)
                track.analyser.connect(result.master)
            }
        }
    }

    const buffer = await context.startRendering()
    esconsole("Render to buffer completed.", ["debug", "renderer"])
    return buffer
}

// Render a result for offline playback. Returns a Blob.
export async function renderWav(result: Project) {
    const buffer = await renderBuffer(result)
    const pcmarrayL = buffer.getChannelData(0)
    const pcmarrayR = buffer.getChannelData(1)

    const interleaved = interleave(pcmarrayL, pcmarrayR)
    const dataview = encodeWAV(interleaved, SAMPLE_RATE, 2)
    return new Blob([dataview], { type: "audio/wav" })
}

// Render a result to mp3 for offline playback. Returns a Blob.
export async function renderMp3(result: Project) {
    const buffer = await renderBuffer(result)
    const mp3encoder = new lamejs.Mp3Encoder(2, 44100, 160)
    const mp3Data = []

    const left = float32ToInt16(buffer.getChannelData(0))
    const right = float32ToInt16(buffer.getChannelData(1))
    const sampleBlockSize = 1152
    let mp3buf

    const len = left.length

    for (let i = 0; i < len; i += sampleBlockSize) {
        const leftChunk = left.subarray(i, i + sampleBlockSize)
        const rightChunk = right.subarray(i, i + sampleBlockSize)
        mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk)
        if (mp3buf.length > 0) {
            mp3Data.push(mp3buf)
        }
    }
    mp3buf = mp3encoder.flush()

    if (mp3buf.length > 0) {
        mp3Data.push(mp3buf)
    }

    return new Blob(mp3Data, { type: "audio/mp3" })
}

// Merge all the given clip buffers into one large buffer.
// Returns a promise that resolves to an AudioBuffer.
export async function mergeClips(clips: Clip[], tempoMap: TempoMap) {
    esconsole("Merging clips", ["debug", "renderer"])
    // calculate the length of the merged clips
    const length = Math.max(0, ...clips.map(clip => clip.measure + (clip.start - clip.end)))
    const duration = tempoMap.measureToTime(length + 1)

    // create an offline context for rendering
    const context = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(NUM_CHANNELS, SAMPLE_RATE * duration, SAMPLE_RATE)

    const mix = context.createGain()
    mix.connect(context.destination)

    for (const clip of clips) {
        const source = new AudioBufferSourceNode(context, { buffer: clip.audio })
        source.connect(mix)

        const startTime = tempoMap.measureToTime(clip.measure)
        const startOffset = tempoMap.measureToTime(clip.start)
        const endOffset = tempoMap.measureToTime(clip.end)

        if (endOffset < startOffset) {
            continue
        }

        source.start(startTime + startOffset)
        source.stop(startTime + (endOffset - startOffset))
    }

    const buffer = await context.startRendering()
    esconsole("Merged clips", ["debug", "renderer"])
    return buffer
}

// Create an interleaved two-channel array for WAV file output.
const interleave = (inputL: Float32Array, inputR: Float32Array) => {
    const length = inputL.length + inputR.length
    const result = new Float32Array(length)

    let index = 0; let inputIndex = 0

    while (index < length) {
        result[index++] = inputL[inputIndex]
        result[index++] = inputR[inputIndex]
        inputIndex++
    }
    return result
}

// Encode an array of interleaved 2-channel samples to a WAV file.
export function encodeWAV(samples: Float32Array, sampleRate: number, numChannels: number) {
    const buffer = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(buffer)

    // RIFF identifier
    writeString(view, 0, "RIFF")
    // file length
    view.setUint32(4, 32 + samples.length * 2, true)
    // RIFF type
    writeString(view, 8, "WAVE")
    // format chunk identifier
    writeString(view, 12, "fmt ")
    // format chunk length
    view.setUint32(16, 16, true)
    // sample format (raw)
    view.setUint16(20, 1, true)
    // channel count
    view.setUint16(22, numChannels, true)
    // sample rate
    view.setUint32(24, sampleRate, true)
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 4, true)
    // block align (channel count * bytes per sample)
    view.setUint16(32, numChannels * 2, true)
    // bits per sample
    view.setUint16(34, 16, true)
    // data chunk identifier
    writeString(view, 36, "data")
    // data chunk length
    view.setUint32(40, samples.length * 2, true)

    floatTo16BitPCM(view, 44, samples)

    return view
}

const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]))
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    }
}

const float32ToInt16 = (input: Float32Array) => {
    const res = new Int16Array(input.length)
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]))
        res[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    return res
}

const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
    }
}

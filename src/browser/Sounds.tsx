import React, { useRef, useEffect, ChangeEvent, MouseEvent, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"

import { VariableSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import classNames from "classnames"

import { reloadRecommendations } from "../app/reloadRecommender"
import { addUIClick } from "../cai/student"
import * as sounds from "./soundsState"
import * as soundsThunks from "./soundsThunks"
import * as appState from "../app/appState"
import * as editor from "../ide/Editor"
import * as user from "../user/userState"
import * as tabs from "../ide/tabState"
import type { RootState } from "../reducers"
import type { SoundEntity } from "common"

import { Collection, SearchBar } from "./Utils"

// TODO: Consider passing these down as React props or dispatching via Redux.
export const callbacks = {
    rename: (_: SoundEntity) => {},
    delete: (_: SoundEntity) => {},
    upload: () => {},
}

const SoundSearchBar = () => {
    const dispatch = useDispatch()
    const searchText = useSelector(sounds.selectSearchText)
    const dispatchSearch = (event: ChangeEvent<HTMLInputElement>) => dispatch(sounds.setSearchText(event.target.value))
    const dispatchReset = () => dispatch(sounds.setSearchText(""))
    const props = { searchText, dispatchSearch, dispatchReset }

    return <SearchBar {...props} />
}

const FilterButton = ({ category, value, isClearItem }: { category: keyof sounds.Filters, value: string, isClearItem: boolean }) => {
    const selected = isClearItem ? false : useSelector((state: RootState) => state.sounds.filters[category].includes(value))
    const dispatch = useDispatch()
    const { t } = useTranslation()

    return (
        <>
            <button
                className="border border-black cursor-pointer px-1 py-0.5 mt-1 mr-1 bg-gray-700 text-white rounded-lg hover:bg-blue-200 dark:bg-black dark:hover:bg-blue-500"
                onClick={() => {
                    if (isClearItem) {
                        dispatch(sounds.resetFilter(category))
                    } else {
                        if (selected) dispatch(sounds.removeFilterItem({ category, value }))
                        else dispatch(sounds.addFilterItem({ category, value }))
                    }
                    if (["genres", "instruments", "keys"].includes(category)) {
                        reloadRecommendations()
                    }
                }}
                title={isClearItem ? t("ariaDescriptors:sounds.clearFilter", { category }) : value}
                aria-label={isClearItem ? t("ariaDescriptors:sounds.clearFilter", { category }) : value}
            >
                <div className="w-5">
                    <i className={`icon-checkmark3 ${selected ? "block" : "hidden"}`} />
                </div>
                <div className="text-sm select-none">
                    {isClearItem ? t("clear") : value}
                </div>
            </button>
            {isClearItem && <hr className="border-1 my-2 border-black dark:border-white" />}
        </>
    )
}

interface ButtonFilterProps {
    title: string
    category: keyof sounds.Filters
    aria?: string
    items: string[]
    position: "center" | "left" | "right"
}

const ButtonFilterList = ({ category, items }: ButtonFilterProps) => {
    return <>
        <ul className="flex flex-row flex-wrap justify-center">
            {items.map((item, index) => <li key={index}>
                <FilterButton
                    value={item}
                    category={category}
                    isClearItem={false} />
            </li>)}
        </ul>
    </>
}

const Filters = () => {
    const { t } = useTranslation()
    const [currentFilterTab, setCurrentFilterTab] = useState<keyof sounds.Filters>("artists")
    const artists = useSelector(sounds.selectFilteredArtists)
    const genres = useSelector(sounds.selectFilteredGenres)
    const instruments = useSelector(sounds.selectFilteredInstruments)
    const keys = useSelector(sounds.selectFilteredKeys)
    const numArtistsSelected = useSelector(sounds.selectNumArtistsSelected)
    const numGenresSelected = useSelector(sounds.selectNumGenresSelected)
    const numInstrumentsSelected = useSelector(sounds.selectNumInstrumentsSelected)
    const numKeysSelected = useSelector(sounds.selectNumKeysSelected)

    return (
        <div className="p-2.5 text-center">
            <div className="mb-2">
                <button className="bg-blue text-white rounded p-1 mr-2" onClick={() => setCurrentFilterTab("artists")}>{t("soundBrowser.filterDropdown.artists")}{numArtistsSelected ? " (" + numArtistsSelected + ")" : ""}</button>
                <button className="bg-blue text-white rounded p-1 mr-2" onClick={() => setCurrentFilterTab("genres")}>{t("soundBrowser.filterDropdown.genres")}{numGenresSelected ? " (" + numGenresSelected + ")" : ""}</button>
                <button className="bg-blue text-white rounded p-1 mr-2" onClick={() => setCurrentFilterTab("instruments")}>{t("soundBrowser.filterDropdown.instruments")}{numInstrumentsSelected ? " (" + numInstrumentsSelected + ")" : ""}</button>
                <button className="bg-blue text-white rounded p-1 mr-2" onClick={() => setCurrentFilterTab("keys")}>{t("soundBrowser.filterDropdown.keys")}{numKeysSelected ? " (" + numKeysSelected + ")" : ""}</button>
            </div>

            {/* TODO: add an SR-only message about clicking on the buttons to filter the sounds (similar to soundtrap) */}
            {currentFilterTab === "artists" && <ButtonFilterList
                title={t("soundBrowser.filterDropdown.artists")}
                category="artists"
                aria={t("soundBrowser.clip.tooltip.artist")}
                items={artists}
                position="center"
            />}
            {currentFilterTab === "genres" && <ButtonFilterList
                title={t("soundBrowser.filterDropdown.genres")}
                category="genres"
                aria={t("soundBrowser.clip.tooltip.genre")}
                items={genres}
                position="center"
            />}
            {currentFilterTab === "instruments" && <ButtonFilterList
                title={t("soundBrowser.filterDropdown.instruments")}
                category="instruments"
                aria={t("soundBrowser.clip.tooltip.instrument")}
                items={instruments}
                position="center"
            />}
            {currentFilterTab === "keys" && <ButtonFilterList
                title={t("soundBrowser.filterDropdown.keys")}
                category="keys"
                aria={t("soundBrowser.clip.tooltip.instrument")}
                items={keys}
                position="center"
            />}
        </div>
    )
}

const ShowOnlyFavorites = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    return (
        <div className="flex items-center">
            <div className="pr-1.5">
                <input
                    type="checkbox"
                    onClick={(event: MouseEvent) => {
                        const elem = event.target as HTMLInputElement
                        dispatch(sounds.setFilterByFavorites(elem.checked))
                    }}
                    title={t("soundBrowser.button.showOnlyStarsDescriptive")}
                    aria-label={t("soundBrowser.button.showOnlyStarsDescriptive")}
                    role="checkbox"
                />
            </div>
            <div className="pr-1 text-sm">
                {t("soundBrowser.button.showOnlyStars")}
            </div>
            <i className="icon icon-star-full2 text-orange-600" />
        </div>
    )
}

const AddSound = () => {
    const { t } = useTranslation()

    return (
        <button
            className="flex items-center rounded-full px-2 bg-black text-white cursor-pointer"
            onClick={callbacks.upload}
        >
            <i className="icon icon-plus2 text-xs mr-1" />
            <div className="text-sm">
                {t("soundBrowser.button.addSound")}
            </div>
        </button>
    )
}

const Clip = ({ clip, bgcolor }: { clip: SoundEntity, bgcolor: string }) => {
    const dispatch = useDispatch()
    const previewFileName = useSelector(sounds.selectPreviewName)
    const previewNode = useSelector(sounds.selectPreviewNode)
    const name = clip.name
    const theme = useSelector(appState.selectColorTheme)
    const { t } = useTranslation()

    let tooltip = `${t("soundBrowser.clip.tooltip.file")}: ${name}
    ${t("soundBrowser.clip.tooltip.folder")}: ${clip.folder}
    ${t("soundBrowser.clip.tooltip.artist")}: ${clip.artist}
    ${t("soundBrowser.clip.tooltip.genre")}: ${clip.genre}
    ${t("soundBrowser.clip.tooltip.instrument")}: ${clip.instrument}
    ${t("soundBrowser.clip.tooltip.originalTempo")}: ${clip.tempo}
    ${t("soundBrowser.clip.tooltip.year")}: ${clip.year}`.replace(/\n\s+/g, "\n")

    if (clip.keySignature) {
        tooltip = tooltip.concat("\n", t("soundBrowser.clip.tooltip.key"), ": ", clip.keySignature)
    }

    const loggedIn = useSelector(user.selectLoggedIn)
    const isFavorite = loggedIn && useSelector(sounds.selectFavorites).includes(name)
    const userName = useSelector(user.selectUserName) as string
    const isUserOwned = loggedIn && clip.folder === userName.toUpperCase()
    const tabsOpen = !!useSelector(tabs.selectOpenTabs).length

    return (
        <div className="flex flex-row justify-start">
            <div className="h-auto border-l-8 border-blue-300" />
            <div className={`flex grow truncate justify-between py-0.5 ${bgcolor} border ${theme === "light" ? "border-gray-300" : "border-gray-700"}`}>
                <div className="flex items-center min-w-0" title={tooltip}>
                    <span className="text-sm truncate pl-3">{name}</span>
                </div>
                <div className="pl-2 pr-4">
                    <button
                        className="text-xs pr-1.5"
                        onClick={() => { dispatch(soundsThunks.previewSound(name)); addUIClick("sound - preview") }}
                        title={t("soundBrowser.clip.tooltip.previewSound")}
                    >
                        {previewFileName === name
                            ? (previewNode ? <i className="icon icon-stop2" /> : <i className="animate-spin es-spinner" />)
                            : <i className="icon icon-play4" />}
                    </button>
                    {loggedIn &&
                        (
                            <button
                                className="text-xs px-1.5"
                                onClick={() => dispatch(soundsThunks.markFavorite({ name: name, isFavorite }))}
                                title={t("soundBrowser.clip.tooltip.markFavorite")}
                            >
                                {isFavorite
                                    ? <i className="icon icon-star-full2 text-orange-600" />
                                    : <i className="icon icon-star-empty3 text-orange-600" />}
                            </button>
                        )}
                    {tabsOpen &&
                        (
                            <button
                                className="text-xs px-1.5 text-sky-700 dark:text-blue-400"
                                onClick={() => { editor.pasteCode(name); addUIClick("sample - copy") }}
                                title={t("soundBrowser.clip.tooltip.paste")}
                            >
                                <i className="icon icon-paste2" />
                            </button>
                        )}
                    {(loggedIn && isUserOwned) &&
                        (
                            <>
                                <button
                                    className="text-xs px-1.5 text-sky-700 dark:text-blue-400"
                                    onClick={() => callbacks.rename(clip)}
                                    title="Rename sound"
                                >
                                    <i className="icon icon-pencil3" />
                                </button>
                                <button
                                    className="text-xs pl-1.5 text-sky-700 dark:text-blue-400"
                                    onClick={() => callbacks.delete(clip)}
                                    title="Delete sound"
                                >
                                    <i className="icon icon-backspace" />
                                </button>
                            </>
                        )}
                </div>
            </div>
        </div>
    )
}

const ClipList = ({ names }: { names: string[] }) => {
    const entities = useSelector(sounds.selectAllEntities)
    const theme = useSelector(appState.selectColorTheme)

    return (
        <div className="flex flex-col">
            {names?.map((v: string) =>
                entities[v] && <Clip
                    key={v} clip={entities[v]}
                    bgcolor={theme === "light" ? "bg-white" : "bg-gray-900"}
                />
            )}
        </div>
    )
}

interface FolderProps {
    folder: string,
    names: string[],
    index: number,
    listRef: React.RefObject<any>
}

const Folder = ({ folder, names }: FolderProps) => {
    return (<>
        <div className="flex flex-row justify-start sticky top-0 bg-inherit">
            <div className="h-auto border-l-4 border-blue-500" />
            <div
                className="flex grow truncate justify-between items-center p-1.5 border-b border-r border-gray-500 dark:border-gray-700"
                title={folder}
            >
                <div className="truncate">{folder}</div>
            </div>
        </div>
        <ClipList names={names} />
    </>)
}

const WindowedRecommendations = () => {
    const loggedIn = useSelector(user.selectLoggedIn)
    const tabsOpen = !!useSelector(tabs.selectOpenTabs).length
    const recommendations = useSelector((state: RootState) => state.recommender.recommendations)
    const { t } = useTranslation()

    return (
        <Collection
            title={t("soundBrowser.title.recommendations").toLocaleUpperCase()}
            visible={loggedIn && tabsOpen}
            initExpanded={false}
        >
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        height={height}
                        width={width}
                        itemCount={1}
                        itemSize={() => 45}
                    >
                        {({ style }) => {
                            return (
                                <div style={style}>
                                    <ClipList names={recommendations} />
                                </div>
                            )
                        }}
                    </List>
                )}
            </AutoSizer>
        </Collection>
    )
}

const WindowedSoundCollection = ({ title, folders, namesByFolders, visible = true, initExpanded = true }: {
    title: string, folders: string[], namesByFolders: any, visible?: boolean, initExpanded?: boolean,
}) => {
    const listRef = useRef<List>(null)
    useEffect(() => {
        if (listRef?.current) {
            listRef.current.resetAfterIndex(0)
        }
    }, [folders, namesByFolders])

    const getItemSize = (index: number) => {
        const folderHeight = 41
        const clipHeight = 30
        return folderHeight + (clipHeight * namesByFolders[folders[index]].length)
    }

    return (
        <Collection
            title={title}
            visible={visible}
            initExpanded={initExpanded}
        >
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        height={height}
                        width={width}
                        itemCount={folders.length}
                        itemSize={getItemSize}
                    >
                        {({ index, style }) => {
                            const names = namesByFolders[folders[index]]
                            const folderClass = classNames({
                                "bg-gray-300 dark:bg-gray-800": true,
                            })
                            return (
                                <div style={style}
                                    className={folderClass}>
                                    <Folder
                                        folder={folders[index]}
                                        names={names}
                                        index={index}
                                        listRef={listRef}
                                    />
                                </div>
                            )
                        }}
                    </List>
                )}
            </AutoSizer>
        </Collection>
    )
}

const DefaultSoundCollection = () => {
    const { t } = useTranslation()
    const folders = useSelector(sounds.selectFilteredRegularFolders)
    const namesByFolders = useSelector(sounds.selectFilteredRegularNamesByFolders)
    const numSounds = useSelector(sounds.selectAllRegularNames).length
    const numFiltered = useSelector(sounds.selectFilteredRegularNames).length
    const filtered = numFiltered !== numSounds
    const title = `${t("soundBrowser.title.collection").toLocaleUpperCase()} (${filtered ? numFiltered + "/" : ""}${numSounds})`
    const props = { title, folders, namesByFolders }
    return <WindowedSoundCollection {...props} />
}

const FeaturedArtistCollection = () => {
    const { t } = useTranslation()
    const folders = useSelector(sounds.selectFilteredFeaturedFolders)
    const namesByFolders = useSelector(sounds.selectFilteredFeaturedNamesByFolders)
    const filteredListChanged = useSelector(sounds.selectFilteredListChanged)
    const visible = useSelector(sounds.selectFeaturedSoundVisibility)
    const initExpanded = true
    const numSounds = useSelector(sounds.selectFeaturedNames).length
    const numFiltered = useSelector(sounds.selectFilteredFeaturedNames).length
    const filtered = numFiltered !== numSounds
    const artists = useSelector(sounds.selectFeaturedArtists)
    const title = `${t("soundBrowser.title.featuredArtist").toLocaleUpperCase()}${artists.length > 1 ? "S" : ""} (${filtered ? numFiltered + "/" : ""}${numSounds})`
    const props = { title, folders, namesByFolders, filteredListChanged, visible, initExpanded }
    return <WindowedSoundCollection {...props} />
}

export const SoundBrowser = () => {
    const loggedIn = useSelector(user.selectLoggedIn)

    return (
        <>
            <div className="grow-0">
                <div className="pb-1">
                    <SoundSearchBar />
                    <Filters />
                </div>

                <div className={`${loggedIn ? "flex" : "hidden"} justify-between px-3 pb-1.5 mb-2`}>
                    <ShowOnlyFavorites />
                    <AddSound />
                </div>
            </div>

            <div className="grow flex flex-col justify-start" role="tabpanel">
                <WindowedRecommendations />
                <DefaultSoundCollection />
                <FeaturedArtistCollection />
            </div>
        </>
    )
}

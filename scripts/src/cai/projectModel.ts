// Project Modeling module for CAI (Co-creative Artificial Intelligence) Project.
import * as recommender from "../app/recommender"

let activeProject: string = ""
let availableGenres: string[] = []
// const availableInstruments: string[] = []

// Initialize empty model.
const defaultProjectModel = { genre: [], instrument: [], form: [], "code structure": [] }

const propertyOptions: { [key: string]: any } = {
    genre: availableGenres,
    // 'instrument': availableInstruments,
    form: ["ABA", "ABAB", "ABCBA", "ABAC", "ABACAB", "ABBA", "ABCCAB", "ABCAB", "ABCAC", "ABACA", "ABACABA"],
    "code structure": ["forLoop", "function", "consoleInput", "conditional"],
}

const suggestablePropertyOptions: { [key: string]: any } = {
    genre: availableGenres,
    // 'instrument': availableInstruments,
    form: ["[FORM]"],
    "code structure": ["forLoop", "function", "consoleInput", "conditional"],
}

const propertyButtons: { [key: string]: string } = {
    genre: "i have a genre I want to include",
    // 'instrument': "there's an instrument i want to make sure is in the project",
    form: "i have a form in mind",
    "code structure": "i need to use a specific code structure",
}

const suggestableProperties: { [key: string]: { [key: string]: any } } = {
    multiple: {
        genre: availableGenres,
        // 'instrument': availableInstruments,
    },
    one: {
        form: ["[FORM]"],
    },
}

const projectModel: { [key: string]: any } = {}

// returns a list of all properties that can be set/adjusted
export function getProperties() {
    return Object.keys(propertyOptions)
}

export function getOptions(propertyString: string) {
    if (Object.keys(propertyOptions).includes(propertyString)) {
        return propertyOptions[propertyString].slice(0)
    } else {
        return []
    }
}

export function randomPropertySuggestion() {
    let add: boolean = false
    let selectedProperty = null
    let selectedValue = null
    // gather all properties that can be suggested at the moment (all with multiple options, plus those one-offs that have not yet been filled)
    const possibleProperties = []
    const multiples = Object.keys(suggestableProperties.multiple)
    const singles = Object.keys(suggestableProperties.one)
    for (const multiple of multiples) {
        if (projectModel[activeProject][multiple].length < multiples.length) {
            possibleProperties.push(multiple)
        }
    }
    for (const single of singles) {
        if (projectModel[activeProject][single].length === 0) {
            possibleProperties.push(single)
        }
    }
    if (possibleProperties.length === 0) {
        return {}
    }
    // select a property at random
    const propertyIndex = getRandomInt(0, possibleProperties.length - 1)
    selectedProperty = possibleProperties[propertyIndex]
    // if this is a property that can hold multiple values, mark if we are adding to an extant list or providing a first value
    if (multiples.includes(selectedProperty) && projectModel[activeProject][selectedProperty].length > 0) {
        add = true
    }
    // list possible values, avoiding repeating existing values in the model
    const possibleValues = []
    for (const valueOption of suggestablePropertyOptions[selectedProperty].length) {
        if (!projectModel[activeProject][selectedProperty].includes(valueOption)) {
            possibleValues.push(valueOption)
        }
    }
    // select one at random
    if (possibleValues.length > 0) {
        const valueIndex = getRandomInt(0, possibleValues.length - 1)
        selectedValue = possibleValues[valueIndex]
    } else {
        return {}
    }
    return { property: selectedProperty, value: selectedValue, isAdded: add }
}

export function setActiveProject(projectName: string) {
    if (projectName in projectModel) {
        activeProject = projectName
    } else {
        // create empty, default project model
        activeProject = projectName
        clearModel()
    }
}

// Public getters.
export function getModel() {
    return projectModel[activeProject]
}

export function getPropertyButtons() {
    return propertyButtons
}

// Update model with key/value pair.
export function updateModel(property: string, value: string) {
    switch (property) {
        case "genre":
        case "code structure":
        case "instrument": {
            if (projectModel[activeProject][property].includes(value)) {
                projectModel[activeProject][property].push(value) // Unlimited number of genres/instruments.
            }
            break
        } case "form":
            projectModel[activeProject].form[0] = value // Only one form at a time.
            break
        default:
            console.log("Invalid project model entry.")
    }
    console.log(projectModel)
}

// Return to empty/default model.
export function clearModel() {
    projectModel[activeProject] = {}
    for (const i in defaultProjectModel) {
        projectModel[activeProject][i] = []
    }
}

// Empty single property array.
export function clearProperty(property: string) {
    projectModel[activeProject][property] = []
}

// Remove single property from array.
export function removeProperty(property: string, propertyValue: string) {
    if (projectModel[activeProject][property]) {
        const index = projectModel[activeProject][property].indexOf(propertyValue)
        if (index > -1) {
            projectModel[activeProject][property].splice(index, 1)
        }
    }
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
}

export function isEmpty() {
    for (const key in projectModel[activeProject]) {
        if (projectModel[activeProject][key] !== undefined && projectModel[activeProject][key].length !== 0) {
            return false
        }
    }
    return true
}

export function getNonEmptyFeatures() {
    const features = []
    for (const key in projectModel[activeProject]) {
        if (projectModel[activeProject][key] !== undefined && projectModel[activeProject][key].length !== 0) {
            features.push(key)
        }
    }
    return features
}

export function getAllProperties() {
    const properties = []
    for (const key in projectModel[activeProject]) {
        if (projectModel[activeProject][key] !== undefined && projectModel[activeProject][key].length !== 0) {
            for (const pVal in projectModel[activeProject][key]) {
                properties.push([key, projectModel[activeProject][key][pVal]])
            }
        }
    }
    return properties
}

export function hasProperty(property: string) {
    for (const key in projectModel[activeProject]) {
        if (projectModel[activeProject][key] !== undefined && projectModel[activeProject][key].length !== 0) {
            for (const pVal in projectModel[activeProject][key]) {
                if (projectModel[activeProject][key][pVal] === property) {
                    return true
                }
            }
        }
    }
    return false
}

export function setOptions() {
    availableGenres = recommender.availableGenres()
    propertyOptions.genre = availableGenres
    suggestablePropertyOptions.genre = availableGenres
    suggestableProperties.multiple.genre = availableGenres
    // availableInstruments = recommender.availableInstruments()
    // propertyOptions['instrument'] = availableInstruments
    // suggestablePropertyOptions['instrument'] = availableInstruments
    // suggestableProperties['multiple']['instrument'] = availableInstruments
}

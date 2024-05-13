import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./locales/en/common.json"
import es from "./locales/es/common.json"
import fr from "./locales/fr/common.json"
import iu from "./locales/iu/common.json"
import oj from "./locales/oj/common.json"
import uz from "./locales/uz/common.json"

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // TODO: convert localization files to new format: https://github.com/i18next/i18next-v4-format-converter
        compatibilityJSON: "v3",
        fallbackLng: "en",
        ns: ["common", "messages", "api", "bubble"],
        defaultNS: "common",
        debug: false,

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        resources: {
            en,
            es,
            fr,
            iu,
            oj,
            uz,
        },
    })

export default i18n

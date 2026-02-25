/**
 * XP ARENA — i18n Dictionary
 * Centralized text for multi-language support.
 */

const Languages = {
    current: localStorage.getItem('xp_lang') || 'en',

    dict: {
        en: {
            app_name: "XP ARENA",
            welcome: "Welcome, Areni",
            daily_reward: "Daily Reward",
            shop: "Armory",
            clans: "Clans",
            profile: "Profile",
            settings: "Settings",
            logout: "Logout"
        },
        pt: {
            app_name: "XP ARENA",
            welcome: "Bem-vindo, Areni",
            daily_reward: "Recompensa Diária",
            shop: "Arsenal",
            clans: "Clãs",
            profile: "Perfil",
            settings: "Configurações",
            logout: "Sair"
        }
    },

    get(key) {
        return this.dict[this.current][key] || this.dict['en'][key] || key;
    },

    setLang(lang) {
        if (this.dict[lang]) {
            this.current = lang;
            localStorage.setItem('xp_lang', lang);
            location.reload();
        }
    }
};

window.L = (key) => Languages.get(key);

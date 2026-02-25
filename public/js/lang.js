/**
 * XP ARENA — i18n Framework (Groundwork)
 * Dictionary structure for multi-language support.
 * Initially supports EN (English) and PT (Portuguese).
 */

const Lang = {
    current: localStorage.getItem('xp_lang') || 'en',

    dict: {
        en: {
            nav_home: "Home",
            nav_tool: "Tool",
            nav_rewards: "Rewards",
            nav_shop: "Shop",
            nav_clans: "Clans",
            nav_leaders: "Leaders",
            nav_profile: "Profile",

            hero_title: "COMMAND YOUR PRECISION",
            hero_sub: "The ultimate toolkit for Free Fire Arenis. Master your sensitivity and join the elite.",

            btn_claim: "CLAIM TODAY'S REWARD",
            btn_claimed: "REWARD CLAIMED",

            mystery_boot: "INITIATING SECURE CONNECTION...",
            mystery_warning: "WARNING: UNAUTHORIZED ACCESS DETECTED",

            toast_success: "Success!",
            toast_error: "System Error"
        },
        pt: {
            nav_home: "Início",
            nav_tool: "Ferramenta",
            nav_rewards: "Recompensas",
            nav_shop: "Loja",
            nav_clans: "Clãs",
            nav_leaders: "Rankings",
            nav_profile: "Perfil",

            hero_title: "DOMINE SUA PRECISÃO",
            hero_sub: "O kit de ferramentas definitivo para Arenis. Domine sua sensibilidade e junte-se à elite.",

            btn_claim: "RESGATAR RECOMPENSA",
            btn_claimed: "RECOMPENSA RESGATADA",

            mystery_boot: "INICIANDO CONEXÃO SEGURA...",
            mystery_warning: "AVISO: ACESSO NÃO AUTORIZADO DETECTADO",

            toast_success: "Sucesso!",
            toast_error: "Erro de Sistema"
        }
    },

    init() {
        this.apply();
        console.log(`Lang: Initialized in ${this.current.toUpperCase()}`);
    },

    set(lang) {
        if (this.dict[lang]) {
            this.current = lang;
            localStorage.setItem('xp_lang', lang);
            this.apply();
            return true;
        }
        return false;
    },

    get(key) {
        return (this.dict[this.current] && this.dict[this.current][key]) || key;
    },

    apply() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.dict[this.current][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = this.get(key);
                } else {
                    el.textContent = this.get(key);
                }
            }
        });
    }
};

window.Lang = Lang;
Lang.init();

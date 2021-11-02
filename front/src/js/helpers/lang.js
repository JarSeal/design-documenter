import assetsObj from '../../lang/assets';
import { LocalStorage, Logger, SessionStorage } from '../LIGHTER';
import { _CONFIG } from '../_CONFIG';

let assets, curLang;
const logger = new Logger('Beacon lang *****')

const loadAssets = () => {
    // Parse possible csv file here
    assets = assetsObj;
    return true;
};

const getLang = () => {
    let lang;
    const LS = new LocalStorage(_CONFIG.lsKeyPrefix);
    lang = LS.getItem('lang');
    if(!lang) {
        const SS = new SessionStorage(_CONFIG.ssKeyPrefix);
        lang = SS.getItem('lang');
    }
    return lang;
};

const getText = (id, replacers) => {
    let text = assets[id];
    if(!text) {
        logger.warn(`Text asset missing. id: ${id}, replacers: ${JSON.stringify(replacers)}`);
        return `[${id}]`;
    }
    text = text[curLang];
    if(!text) {
        logger.warn(`Text asset missing for lang: ${curLang}. id: ${id}, replacers: ${JSON.stringify(replacers)}`);
        return `[${id}]`;
    }
    return text;
};

export { loadAssets, getText };
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {translations, TranslationKeys, Language} from '../locales/translations';
import {setLanguage} from '../redux/slices/languageSlice';

export const useTranslation = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.language);

  const t = (key: TranslationKeys): string => {
    return translations[language]?.[key] || translations['en']?.[key] || (key as string);
  };

  const changeLanguage = (lang: Language) => {
    dispatch(setLanguage(lang));
  };

  return { t, language, changeLanguage };
};

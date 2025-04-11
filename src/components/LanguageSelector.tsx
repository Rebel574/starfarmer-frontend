
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-gray-600" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="block py-2 px-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
      >
        <option value="en">{t('language.en')}</option>
        <option value="mr">{t('language.mr')}</option>
      </select>
    </div>
  );
}
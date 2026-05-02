export function useLocale() {
  const { locale, availableLocales, setLocale } = useI18n()
  const localeCookie = useCookie('i18n_locale', { maxAge: 60 * 60 * 24 * 365 })

  async function switchLocale(code: string): Promise<void> {
    try {
      await setLocale(code as 'vi' | 'en')
      localeCookie.value = code
    } catch {
      // setLocale can throw a dispose error during route transitions — ignore it
      locale.value = code as 'vi' | 'en'
      localeCookie.value = code
    }
  }

  return { locale, availableLocales, switchLocale }
}

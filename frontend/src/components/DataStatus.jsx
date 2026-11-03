import { useSettings } from '../context/settings'

function DataStatus({ loading, error }) {
  const { t } = useSettings()

  if (loading) {
    return <p className="mt-10 text-center text-muted">{t.common.loading}</p>
  }

  if (error) {
    return <p className="mt-10 text-center text-red-500">{t.common.error}</p>
  }

  return null
}

export default DataStatus
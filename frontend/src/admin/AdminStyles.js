// Couleurs des boutons de l'administration, partagées par toutes les pages.
// Pour changer une couleur partout, modifie-la ici.
const COLORS = {
  edit: 'bg-blue-600 hover:bg-blue-700',
  publish: 'bg-green-600 hover:bg-green-700',
  unpublish: 'bg-orange-500 hover:bg-orange-600',
  feature: 'bg-purple-600 hover:bg-purple-700',
  unfeature: 'bg-gray-500 hover:bg-gray-600',
  danger: 'bg-red-600 hover:bg-red-700',
}

export function btn(kind) {
  return (
    'rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 ' +
    COLORS[kind]
  )
}
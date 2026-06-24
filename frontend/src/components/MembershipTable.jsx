import { useMemo } from 'react'

const MembershipTable = ({ memberships, loading, onEdit, onDelete, filterStatus, searchTerm }) => {
  const filteredMemberships = useMemo(() => {
    return memberships.filter((membership) => {
      const matchesStatus = !filterStatus || membership.status === filterStatus
      const matchesSearch = !searchTerm || membership.id.toString().includes(searchTerm)
      return matchesStatus && matchesSearch
    })
  }, [memberships, filterStatus, searchTerm])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge-active">Active</span>
      case 'expired':
        return <span className="badge-expired">Expired</span>
      case 'pending':
        return <span className="badge-pending">Pending</span>
      default:
        return <span className="badge-pending">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (filteredMemberships.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">No memberships found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cost</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expires</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMemberships.map((membership) => (
            <tr key={membership.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-800">{membership.id}</td>
              <td className="px-6 py-4 text-sm text-gray-800 capitalize">{membership.type}</td>
              <td className="px-6 py-4 text-sm">{getStatusBadge(membership.status)}</td>
              <td className="px-6 py-4 text-sm text-gray-800">${membership.cost}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(membership.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {membership.expire ? new Date(membership.expire).toLocaleDateString() : '—'}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(membership)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(membership)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MembershipTable

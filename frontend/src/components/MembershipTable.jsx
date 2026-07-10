import { useMemo } from 'react'

const MembershipTable = ({ memberships, loading, onEdit, onPauseActivate, filterStatus, searchTerm }) => {
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
      case 'banned':
        return <span className="badge-expired">Banned</span>
      case 'paused':
        return <span className="badge-pending">Paused</span>
      default:
        return <span className="badge-pending">{status}</span>
    }
  }

  const formatDate = (dateValue) => {
    // Handle null, undefined, or empty values
    if (!dateValue || dateValue === null || dateValue === undefined) return '—'
    
    // If it's a number (timestamp), convert it
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    // Convert to string for processing
    const dateString = String(dateValue)
    
    // Handle 'Invalid Date' string
    if (dateString === 'Invalid Date') return '—'
    
    // Try to parse the date
    let date
    if (dateString.includes('T')) {
      // ISO format: 2024-01-15T10:30:00.000Z
      date = new Date(dateString)
    } else if (dateString.includes('-')) {
      // Handle PostgreSQL timestamp format: "2024-01-15 14:30:00"
      if (dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ')
        const [year, month, day] = datePart.split('-')
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      } else {
        // Date format: 2024-01-15
        const [year, month, day] = dateString.split('-')
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }
    } else {
      // Try direct parsing
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
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
                {formatDate(membership.created_at)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDate(membership.expire)}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(membership)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    title="Change status (Active ↔ Paused)"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onPauseActivate(membership)}
                    className={`px-3 py-1 text-sm rounded hover:opacity-80 transition ${
                      membership.status === 'paused' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {membership.status === 'paused' ? 'Activate' : 'Pause'}
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

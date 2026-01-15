'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { friendsService } from '@/lib/friendsService';
import { Friend, FriendInput } from '@/types/friend';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FriendInput>({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    notes: '',
  });

  const loadFriends = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await friendsService.getFriends(user.uid);
      setFriends(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingFriend) {
        await friendsService.updateFriend(editingFriend.id, formData);
      } else {
        await friendsService.addFriend(user.uid, formData);
      }
      await loadFriends();
      resetForm();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to save friend');
    }
  };

  const handleEdit = (friend: Friend) => {
    setEditingFriend(friend);
    setFormData({
      name: friend.name,
      email: friend.email || '',
      phone: friend.phone || '',
      birthday: friend.birthday || '',
      notes: friend.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (friendId: string) => {
    if (!confirm('Are you sure you want to delete this friend?')) return;

    try {
      await friendsService.deleteFriend(friendId);
      await loadFriends();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to delete friend');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthday: '',
      notes: '',
    });
    setEditingFriend(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Friends</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Add Friend Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            + Add Friend
          </button>
        )}

        {/* Friend Form */}
        {showForm && (
          <div className="mb-6 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {editingFriend ? 'Edit Friend' : 'Add New Friend'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingFriend ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Friends List */}
        {friends.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              No friends yet. Add your first friend!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {friend.name}
                </h3>
                {friend.email && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                    📧 {friend.email}
                  </p>
                )}
                {friend.phone && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                    📱 {friend.phone}
                  </p>
                )}
                {friend.birthday && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                    🎂 {(() => {
                      try {
                        return new Date(friend.birthday).toLocaleDateString();
                      } catch {
                        return friend.birthday;
                      }
                    })()}
                  </p>
                )}
                {friend.notes && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 italic">
                    {friend.notes}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(friend)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(friend.id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

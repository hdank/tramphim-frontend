import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { toast } from 'react-toastify';

const BellIcon = ({ hasUnread }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={hasUnread ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31M5 19.5A2.5 2.5 0 017.5 22h9a2.5 2.5 0 012.5-2.5M5 19.5v-.75A9.001 9.001 0 0118 9.75v.75m0 0h3.75a2.25 2.25 0 012.25 2.25v.75"
    />
  </svg>
);

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/binhluan/user/notifications/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        
        // Calculate unread count
        const unread = data.filter(n => !n.da_xem).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count periodically
  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${API_BASE_URL}/api/binhluan/${notificationId}/mark-as-read/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, da_xem: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${API_BASE_URL}/api/binhluan/${notificationId}/delete-notification/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Xóa thông báo thành công');
      } else {
        toast.error('Lỗi khi xóa thông báo');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Lỗi khi xóa thông báo');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.da_xem) {
      await markAsRead(notification.id);
    }

    // Get phim info from comment ID
    if (notification.binh_luan_id) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(
          `${API_BASE_URL}/api/binhluan/comment/${notification.binh_luan_id}/phim-info/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const phimInfo = await response.json();
          const movieSlug = phimInfo.slug;
          const commentId = notification.binh_luan_id;
          
          if (movieSlug && commentId) {
            const url = `/phim/${movieSlug}#binh_luan_${commentId}`;
            
            // Check if we're already on the same page
            const currentPath = window.location.pathname;
            const targetPath = `/phim/${movieSlug}`;
            
            setIsOpen(false);
            
            if (currentPath === targetPath) {
              // Same page, just scroll to the element
              setTimeout(() => {
                const element = document.getElementById(`binh_luan_${commentId}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('ring-2', 'ring-sky-400', 'bg-white/10');
                  setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-sky-400', 'bg-white/10');
                  }, 3000);
                }
              }, 100);
            } else {
              // Different page, navigate and let page handle scrolling
              window.location.href = url;
            }
            return;
          }
        } else {
          toast.error('Không thể tải thông tin phim');
        }
      } catch (error) {
        console.error('Error fetching phim info:', error);
        toast.error('Lỗi khi tải thông tin phim');
      }
    }

    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center text-white/80 hover:text-white focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <BellIcon hasUnread={unreadCount > 0} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md bg-[#23252b] shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="sticky top-0 border-b border-gray-100/10 bg-[#23252b] px-4 py-3">
            <h3 className="text-sm font-medium text-white">Thông báo</h3>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-center text-gray-400">
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/10">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 transition-colors group flex items-start gap-3 ${
                    notification.da_xem
                      ? 'hover:bg-white/5'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className="flex-1 cursor-pointer flex gap-3 items-start min-w-0"
                  >
                    {notification.binh_luan?.nguoi_dung?.anh_dai_dien_url ? (
                      <img
                        src={notification.binh_luan.nguoi_dung.anh_dai_dien_url}
                        alt={notification.binh_luan.nguoi_dung.username}
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center ring-1 ring-white/10">
                        <span className="text-xs font-semibold text-white">
                          {notification.binh_luan?.nguoi_dung?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-medium">
                          {notification.binh_luan?.nguoi_dung?.username}
                        </span>
                        {' '}
                        {notification.loai === 'reply' && 'đã trả lời bình luận của bạn'}
                      </p>

                      {notification.binh_luan?.noi_dung && (
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          "{notification.binh_luan.noi_dung}"
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.ngay_tao).toLocaleDateString('vi-VN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {!notification.da_xem && (
                      <div className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 mt-2"></div>
                    )}
                  </div>

                  <button
                    onClick={(e) => deleteNotification(e, notification.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                    title="Xóa thông báo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

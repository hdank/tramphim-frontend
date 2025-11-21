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
      d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"
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



  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-10 h-10 text-white/80 hover:text-white focus:outline-none transition-colors rounded-md"
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
        <div className="fixed top-16 left-1/2 z-[60] mt-2 max-h-[80vh] w-[90vw] max-w-md -translate-x-1/2 overflow-y-auto rounded-xl bg-[#23252b]/95 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-black ring-opacity-5 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-96 sm:translate-x-0">
          <div className="sticky top-0 border-b border-gray-100/10 bg-[#23252b]/95 backdrop-blur-xl px-4 py-3 z-10">
            <h3 className="text-sm font-medium text-white">Thông báo</h3>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-center text-gray-400">
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : !user ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400">Vui lòng đăng nhập để xem thông báo</p>
              <a href="/dang-nhap" className="mt-2 inline-block rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
                Đăng nhập
              </a>
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
                  className={`px-4 py-3 transition-colors group flex items-start gap-3 ${notification.da_xem
                    ? 'hover:bg-white/5'
                    : 'bg-white/10 hover:bg-white/15'
                    }`}
                >
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className="flex-1 cursor-pointer flex gap-3 items-start min-w-0"
                  >
                    {notification.loai === 'system' ? (
                      <div className="h-8 w-8 rounded-full bg-sky-600 flex-shrink-0 flex items-center justify-center ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                          <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : notification.binh_luan?.nguoi_dung?.anh_dai_dien_url ? (
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
                      {notification.loai === 'system' ? (
                        <>
                          <p className="text-sm text-white font-medium">
                            Hệ thống
                          </p>
                          <p className="text-xs text-gray-300 mt-1 whitespace-pre-line">
                            {notification.noi_dung}
                          </p>
                        </>
                      ) : (
                        <>
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
                        </>
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
                    className="flex-shrink-0 text-gray-400 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-1"
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

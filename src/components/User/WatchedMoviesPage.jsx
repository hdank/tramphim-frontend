import React, { useEffect, useState } from 'react';
import { getAllProgressFromDB } from '../Header/WatchedMoviesDropdown';

export default function WatchedMoviesPage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const allMovies = await getAllProgressFromDB();
                // Filter and sort logic similar to Dropdown
                const movieMap = new Map();
                allMovies.forEach((item) => {
                    const progressPercentage = (item.progress / item.duration) * 100;
                    if (progressPercentage < 90) {
                        const movieKey = item.slug;
                        if (!movieMap.has(movieKey) || new Date(item.lastUpdated) > new Date(movieMap.get(movieKey).lastUpdated)) {
                            movieMap.set(movieKey, item);
                        }
                    }
                });
                const sortedMovies = Array.from(movieMap.values()).sort((a, b) => {
                    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
                });
                setMovies(sortedMovies);
            } catch (error) {
                console.error("Error loading history:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-white">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-[#191B24] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white md:text-3xl">Lịch Sử Xem</h1>
                </div>

                {movies.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {movies.map((movie) => {
                            const progressPercentage = (movie.progress / movie.duration) * 100;
                            const movieLanguage = movie.ngonngu || "vi";
                            return (
                                <a
                                    key={movie.id}
                                    href={`/xem-phim/${movie.slug}/tap-${movie.sotap}/${movieLanguage}`}
                                    className="group relative flex overflow-hidden rounded-lg bg-[#23252b] transition-colors hover:bg-[#2a2c33]"
                                >
                                    <div className="relative w-32 flex-shrink-0 overflow-hidden">
                                        <img
                                            src={movie.banner || movie.poster_url} // Fallback if banner missing
                                            alt={movie.ten_phim}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                                            <div
                                                className="h-full bg-sky-500"
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center p-4">
                                        <h3 className="line-clamp-1 text-sm font-medium text-white group-hover:text-sky-400">
                                            {movie.ten_phim}
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Đang xem tập {movie.sotap}
                                        </p>
                                        <p className="mt-2 text-xs text-gray-500">
                                            {new Date(movie.lastUpdated).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="rounded-full bg-white/5 p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-white">Chưa có lịch sử xem</h3>
                        <p className="mt-2 text-gray-400">Các phim bạn đang xem dở sẽ hiện ở đây.</p>
                        <a href="/" className="mt-6 rounded-md bg-sky-500 px-6 py-2 text-sm font-medium text-white hover:bg-sky-400 transition-colors">
                            Khám phá phim ngay
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

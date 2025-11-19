import React, { useEffect, useState } from 'react';
import { getAllFavoriteMovies, clearFavoriteMovies } from '../Header/FavoriteMoviesDropdown';

export default function FavoriteMoviesPage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            const data = await getAllFavoriteMovies();
            setMovies(data);
            setLoading(false);
        };
        loadMovies();
    }, []);

    const handleClear = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tất cả phim yêu thích?")) {
            await clearFavoriteMovies();
            setMovies([]);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-white">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-[#191B24] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white md:text-3xl">Phim Yêu Thích</h1>
                    {movies.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="rounded-md bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                            Xóa tất cả
                        </button>
                    )}
                </div>

                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {movies.map((movie) => (
                            <a
                                key={movie.slug}
                                href={`/phim/${movie.slug}`}
                                className="group relative block overflow-hidden rounded-lg bg-[#23252b] transition-transform hover:scale-105"
                            >
                                <div className="aspect-[2/3] w-full overflow-hidden">
                                    <img
                                        src={movie.poster_url}
                                        alt={movie.ten_phim}
                                        className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="truncate text-sm font-medium text-white group-hover:text-sky-400">
                                        {movie.ten_phim}
                                    </h3>
                                    <p className="truncate text-xs text-gray-400">{movie.ten_khac}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="rounded-full bg-white/5 p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-white">Chưa có phim yêu thích</h3>
                        <p className="mt-2 text-gray-400">Hãy thêm phim vào danh sách yêu thích để xem lại sau.</p>
                        <a href="/" className="mt-6 rounded-md bg-sky-500 px-6 py-2 text-sm font-medium text-white hover:bg-sky-400 transition-colors">
                            Khám phá phim ngay
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

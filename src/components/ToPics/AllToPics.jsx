const getHref = (slug) => `/chu-de/${slug}`;

const defaultColors = [
    "from-[#6654CC] to-[#8072E2]",
    "from-[#47526D] to-[#596688]",
    "from-[#44A38A] to-[#55C3A5]",
    "from-[#8C60C0] to-[#A277DA]",
    "from-[#9E6445] to-[#B67657]",
    "from-[#7F4E4E] to-[#996363]",
    "from-[#574E7F] to-[#736399]",
];

const AllToPics = ({ themesData }) => {
    const fetchedThemes = themesData?.map((theme, index) => ({
        ...theme,
        color: defaultColors[index % defaultColors.length]
    })) || [];

    if (fetchedThemes.length === 0) {
        return (
            <div className="py-10 text-center">
                <div className="inline-block px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                    <p className="text-white text-lg font-semibold">
                        Không có chủ đề nào để hiển thị
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-2 lg:px-0 px-2">
            <div className="space-y-3">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-1 w-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"></div>
                    <h2 className="bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-lg font-bold text-transparent lg:text-2xl">
                        Khám Phá Toàn Bộ Chủ Đề
                    </h2>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-sky-500/50 via-cyan-500/30 to-transparent"></div>
            </div>

            <div
                className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-6 pt-4 lg:gap-4"
                role="navigation"
                aria-label="Các chủ đề phim"
            >
                {fetchedThemes.map(({ ten, slug, color }) => (
                    <a
                        key={slug}
                        href={getHref(slug)}
                        className={`relative h-[70px] overflow-hidden rounded-lg bg-gradient-to-br p-2 lg:p-4 shadow-lg transition-transform duration-500 ease-in-out hover:-translate-y-1 sm:h-[100px] lg:h-[120px] ${color}`}
                    >
                        <div className="relative z-10 flex h-full flex-col gap-2 items-start justify-center lg:justify-end">
                            <h3 className="text-sm font-bold md:text-lg text-white line-clamp-2">
                                {ten}
                            </h3>

                            <div className="hidden sm:flex flex-row items-center justify-center gap-2 text-center text-[10px] lg:text-sm font-normal text-white">
                                <span>Xem chủ đề</span>
                            </div>
                        </div>

                        <svg
                            className="theme-svg"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            viewBox="0 0 1440 200"
                        >
                            {Array.from({ length: 25 }, (_, i) => {
                                const y = 20 + i * 12;
                                const amp = 25;
                                return (
                                    <path
                                        key={i}
                                        d={`
                                            M0,${y}
                                            C 360,${y - amp} 720,${y + amp} 1080,${y}
                                            C 1260,${y - amp} 1440,${y + amp} 1440,${y}
                                        `}
                                        stroke="#ccc"
                                        fill="none"
                                        strokeWidth="2"
                                        opacity="0.5"
                                    />
                                );
                            })}
                        </svg>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default AllToPics;

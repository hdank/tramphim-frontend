import React from 'react';

const categories = [
    { title: 'Conan', subtitle: 'Khám phá', color: 'bg-indigo-600', link: '/tim-kiem?q=conan' },
    { title: 'Dong Hua', subtitle: 'Khám phá', color: 'bg-slate-600', link: '/dong-hua' },
    { title: 'Marvel', subtitle: 'Khám phá', color: 'bg-teal-500', link: '/tim-kiem?q=marvel' },
    { title: 'Doraemon', subtitle: 'Khám phá', color: 'bg-purple-500', link: '/tim-kiem?q=doraemon' },
    { title: 'Chiếu Rạp Hot', subtitle: 'Khám phá', color: 'bg-orange-700', link: '/loai-phim/phim-chieu-rap' },
    { title: 'Harry Potter', subtitle: 'Khám phá', color: 'bg-red-800', link: '/tim-kiem?q=harry+potter' },
    { title: 'Chủ đề khác', subtitle: '+7 chủ đề', color: 'bg-violet-800', link: '/chu-de' },
];

const TopographyPattern = () => (
    <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="topography" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M10,10 Q30,40 50,10 T90,10" fill="none" stroke="white" strokeWidth="1" />
                    <path d="M10,30 Q30,60 50,30 T90,30" fill="none" stroke="white" strokeWidth="1" />
                    <path d="M10,50 Q30,80 50,50 T90,50" fill="none" stroke="white" strokeWidth="1" />
                    <path d="M10,70 Q30,100 50,70 T90,70" fill="none" stroke="white" strokeWidth="1" />
                    <path d="M10,90 Q30,120 50,90 T90,90" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="50" cy="50" r="2" fill="white" opacity="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topography)" />
        </svg>
    </div>
);

export default function HeroOverlay() {
    return (
        <div className="relative w-full z-20 px-4 pt-4 pb-6 md:px-8 md:pb-8 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:pt-0 lg:px-16 lg:pb-12 xl:px-20 lg:bg-transparent bg-[#0a0a0f]">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white drop-shadow-md lg:text-xl mb-2">Bạn Đang Quan Tâm Gì ?</h2>
                <div className="w-full h-[1px] bg-[#dfae47] opacity-80 shadow-[0_0_8px_rgba(223,174,71,0.6)]"></div>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar md:grid md:grid-cols-4 lg:grid-cols-7 lg:overflow-visible">
                {categories.map((cat, index) => (
                    <a
                        key={index}
                        href={cat.link}
                        className={`${cat.color} relative group block flex-shrink-0 overflow-hidden rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10 w-36 h-24 sm:w-auto sm:h-28 lg:h-auto snap-start`}
                    >
                        {/* Topography Pattern Background */}
                        <TopographyPattern />

                        {/* Glass effect overlay */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />

                        {/* Gradient glow */}
                        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />

                        <div className="relative z-10 flex flex-col h-full justify-between lg:justify-start">
                            <h3 className="text-base font-bold text-white lg:text-lg leading-tight">{cat.title}</h3>
                            <p className="flex items-center text-xs font-medium text-white/80 mt-1">
                                {cat.subtitle}
                                <svg
                                    className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

import React, { useState } from "react";
import Episodes from "../EposideList/EpisodeList.jsx";
import MovieCast from "./MovieActor.jsx";
import MovieImages from "./MovieGallery";
import Trailer from "./Trailer.jsx";
import PhanLienQuan from "./MovieSeaSon.jsx";

const MovieTabsAndCast = ({
  vietsubEpisodes,
  thuyetMinhEpisodes,
  longtiengEpisodes,
  slug,
  currentType,
  actors,
  images,
  phanlienquan,
  trailer_url,
  movieTitle,
  initialSortAscending,
}) => {
  const [activeTab, setActiveTab] = useState("episodes");

  return (
    <div className="py-4">
      <h2 className="mb-4 text-lg font-semibold lg:text-xl">Mục Phim</h2>

      <div className="flex items-start gap-3 border-b border-gray-700 text-xs lg:gap-8 lg:text-base">
        <TabButton
          label="Tập Phim"
          tabName="episodes"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* Thêm điều kiện kiểm tra dữ liệu phanlienquan */}
        {phanlienquan && phanlienquan.length > 0 && (
          <TabButton
            label="Phần Liên Quan"
            tabName="phanlienquans"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        <TabButton
          label="Trailer"
          tabName="trailer"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          label="Diễn viên"
          tabName="cast"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* Tab Hình ảnh luôn hiển thị */}
        <TabButton
          label="Hình ảnh"
          tabName="images"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="pt-4 lg:pt-8">
        {activeTab === "episodes" && (
          <Episodes
            vietsub={vietsubEpisodes}
            thuyetminh={thuyetMinhEpisodes}
            longtieng={longtiengEpisodes}
            slug={slug}
            currentType={currentType}
            movieTitle={movieTitle}
            initialSortAscending={initialSortAscending}
          />
        )}
        {activeTab === "cast" && <MovieCast actors={actors} />}
        {activeTab === "images" && <MovieImages imagesData={images} />}
        {activeTab === "trailer" && <Trailer trailer_url={trailer_url} />}
        {activeTab === "phanlienquans" && <PhanLienQuan movie={phanlienquan} />}
      </div>
    </div>
  );
};

const TabButton = ({ label, tabName, activeTab, setActiveTab }) => {
  const isActive = activeTab === tabName;
  return (
    <button
      className={`duration-400 relative px-2 py-4 text-xs lg:text-sm font-medium transition-colors ease-in-out ${isActive ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      onClick={() => setActiveTab(tabName)}
    >
      {label}
      {isActive && (
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 transform border-b-2 border-sky-300"
          style={{ width: "20px" }}
        />
      )}
    </button>
  );
};

export default MovieTabsAndCast;
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const apiBaseUrl = process.env.PUBLIC_API_BASE_URL;
const domain = process.env.PUBLIC_DOMAIN;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticLoaiPhimList = [{ ten: "Phim Chiếu Rạp", slug: "phim-chieu-rap" }];
const staticLichChieu = [{ ten: "Lịch Chiếu", slug: "lich-chieu" }];

const allSitemapFiles = [];
const MAX_URLS_PER_FILE = 10000;
const SITEMAP_LASTMOD = new Date().toISOString().split("T")[0];

// Cấu hình giới hạn trang
const START_PAGE = 1;
const END_PAGE = 2;

// --------------------------------------------------------------------------------

/**
 * Tạo nội dung XML cho sitemap
 */
function createSitemapContent(urls, changefreq, priority) {
 let content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
 
 urls.forEach((url) => {
  content += ` <url>
  <loc>${url}</loc>
  <lastmod>${SITEMAP_LASTMOD}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
 </url>
`;
 });
 
 content += "</urlset>";
 return content;
}

// --------------------------------------------------------------------------------

/**
 * Xử lý sitemap index khi có nhiều file
 */
function handleSitemapIndex(sitemapName, sitemapFiles, publicDir) {
 if (sitemapFiles.length === 1) {
  allSitemapFiles.push(sitemapFiles[0]);
 } else if (sitemapFiles.length > 1) {
  const indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(file => ` <sitemap>
  <loc>${domain}/${file}</loc>
 </sitemap>`).join("\n")}
</sitemapindex>`;
  
  const indexFileName = `index-${sitemapName}.xml`;
  const indexFilePath = path.join(publicDir, indexFileName);
  fs.writeFileSync(indexFilePath, indexContent);
  allSitemapFiles.push(indexFileName);
  console.log(`✅ Đã tạo sitemap index: ${indexFileName}`);
 }
}

// --------------------------------------------------------------------------------

/**
 * Lấy danh sách thể loại từ API
 */
async function fetchTheLoaiList() {
 const apiUrl = `${apiBaseUrl}/api/theloai/`;
 console.log(`\n📥 Đang lấy danh sách thể loại từ API...`);
 
 try {
  const response = await axios.get(apiUrl);
  if (Array.isArray(response.data)) {
   console.log(`✅ Đã lấy ${response.data.length} thể loại`);
   return response.data;
  }
  console.error("❌ Dữ liệu API không đúng định dạng");
  return [];
 } catch (error) {
  console.error("❌ Lỗi khi fetch thể loại:", error.message);
  return [];
 }
}

// --------------------------------------------------------------------------------

/**
 * Tạo sitemap cho danh sách tĩnh
 */
async function generateStaticSitemap(list, sitemapName) {
 const publicDir = path.join(__dirname, "public");
 const urls = list.map(item =>
  `${domain}${item.urlPrefix}${item.slug || item.value}`
 );

 console.log(`\n📝 Tạo sitemap: ${sitemapName} (${urls.length} URLs)...`);

 try {
  if (!fs.existsSync(publicDir)) {
   fs.mkdirSync(publicDir);
  }

  const sitemapFiles = [];
  const numFiles = Math.ceil(urls.length / MAX_URLS_PER_FILE);

  for (let i = 0; i < numFiles; i++) {
   const start = i * MAX_URLS_PER_FILE;
   const end = start + MAX_URLS_PER_FILE;
   const fileUrls = urls.slice(start, end);

   const fileName = `${sitemapName}${i > 0 ? `-${i}` : ""}.xml`;
   const filePath = path.join(publicDir, fileName);
   sitemapFiles.push(fileName);

   const content = createSitemapContent(fileUrls, "daily", 0.7);
   fs.writeFileSync(filePath, content);
   console.log(` ✓ ${fileName}`);
  }

  handleSitemapIndex(sitemapName, sitemapFiles, publicDir);
 } catch (error) {
  console.error(`❌ Lỗi tạo sitemap ${sitemapName}:`, error.message);
 }
}

// --------------------------------------------------------------------------------

/**
 * Lấy tập phim theo slug (ĐÃ THÊM LONGTIENG)
 */
async function fetchEpisodes(slug) {
 const episodes = [];
 const languages = [
  { lang: "vietsub", url: `${apiBaseUrl}/api/phim/${slug}/vietsub/?server=sv1` },
  { lang: "thuyetminh", url: `${apiBaseUrl}/api/phim/${slug}/thuyetminh/?server=sv1` },
  { lang: "longtieng", url: `${apiBaseUrl}/api/phim/${slug}/longtieng/?server=sv1` } // <--- ĐÃ THÊM LONGTIENG
 ];

 for (const { lang, url } of languages) {
  try {
   const response = await axios.get(url);
   const data = response.data;

   if (Array.isArray(data) && data.length > 0) {
    data.forEach(ep => {
     if (ep?.tap_phim) {
      episodes.push({
       phim_slug: slug,
       tap_slug: ep.tap_phim.slug,
       ngon_ngu: ep.ngon_ngu
      });
     }
    });
   }
  } catch (error) {
   if (error.response?.status !== 404) {
    console.error(` ⚠️ Lỗi lấy tập ${lang} cho "${slug}"`);
   }
  }
 }
 
 return episodes;
}

// --------------------------------------------------------------------------------

/**
 * Tạo sitemap cho từng loại phim
 */
async function generateSitemapForType(loaiPhim, sitemapName, startPage = 1, endPage = Infinity) {
 const publicDir = path.join(__dirname, "public");
 const baseUrl = `${domain}/phim/`;
 const limit = 24;
 let currentPage = startPage;
 let totalPages = Infinity;
 const urls = [];

 console.log(`\n📝 Tạo sitemap: ${loaiPhim} (trang ${startPage}-${endPage})...`);

 try {
  if (!fs.existsSync(publicDir)) {
   fs.mkdirSync(publicDir);
  }

  while (currentPage <= totalPages && currentPage <= endPage) {
   const apiUrl = `${apiBaseUrl}/api/filter/?page=${currentPage}&limit=${limit}&loai_phim=${loaiPhim}&sort=ngay-tao`;
   
   const response = await axios.get(apiUrl);
   const data = response.data;

   if (currentPage === startPage) {
    totalPages = data.pagination.total_pages;
    console.log(` 📊 Tổng ${totalPages} trang, xử lý đến trang ${Math.min(totalPages, endPage)}`);
   }

   if (Array.isArray(data.data)) {
    data.data.forEach(movie => urls.push(`${baseUrl}${movie.slug}`));
   }

   currentPage++;
  }

  console.log(` ✓ Đã lấy ${urls.length} URLs`);

  const sitemapFiles = [];
  const numFiles = Math.ceil(urls.length / MAX_URLS_PER_FILE);

  for (let i = 0; i < numFiles; i++) {
   const start = i * MAX_URLS_PER_FILE;
   const fileUrls = urls.slice(start, start + MAX_URLS_PER_FILE);
   const fileName = `${sitemapName}${i > 0 ? `-${i}` : ""}.xml`;
   const filePath = path.join(publicDir, fileName);
   
   sitemapFiles.push(fileName);
   const content = createSitemapContent(fileUrls, "daily", 0.8);
   fs.writeFileSync(filePath, content);
   console.log(` ✓ ${fileName}`);
  }

  handleSitemapIndex(sitemapName, sitemapFiles, publicDir);
 } catch (error) {
  console.error(`❌ Lỗi tạo sitemap ${loaiPhim}:`, error.message);
 }
}

// --------------------------------------------------------------------------------

/**
 * Tạo sitemap cho tập phim
 */
async function generateEpisodeSitemap(startPage, endPage) {
 const publicDir = path.join(__dirname, "public");
 const baseUrl = `${domain}/xem-phim/`;
 const limit = 64
 const urls = [];

 console.log(`\n📝 Tạo sitemap tập phim (trang ${startPage}-${endPage})...`);

 try {
  const movieTypes = ["phim-le", "phim-bo", "hoat-hinh"];
  const allSlugs = [];

  for (const type of movieTypes) {
   const slugs = await getAllMovieSlugs(type, limit, apiBaseUrl, startPage, endPage);
   allSlugs.push(...slugs);
  }

  console.log(` 📊 Đã lấy ${allSlugs.length} slugs phim`);

  for (const slug of allSlugs) {
   const episodes = await fetchEpisodes(slug);
   episodes.forEach(ep => {
    urls.push(`${baseUrl}${ep.phim_slug}/${ep.tap_slug}/${ep.ngon_ngu}`);
   });
  }

  console.log(` ✓ Tạo được ${urls.length} URLs tập phim`);

  const sitemapFiles = [];
  const numFiles = Math.ceil(urls.length / MAX_URLS_PER_FILE);

  for (let i = 0; i < numFiles; i++) {
   const start = i * MAX_URLS_PER_FILE;
   const fileUrls = urls.slice(start, start + MAX_URLS_PER_FILE);
   const fileName = `sitemap-episodes${i > 0 ? `-${i}` : ""}.xml`;
   const filePath = path.join(publicDir, fileName);
   
   sitemapFiles.push(fileName);
   const content = createSitemapContent(fileUrls, "daily", 0.9);
   fs.writeFileSync(filePath, content);
   console.log(` ✓ ${fileName}`);
  }

  handleSitemapIndex("episodes", sitemapFiles, publicDir);
 } catch (error) {
  console.error("❌ Lỗi tạo sitemap tập phim:", error.message);
 }
}

// --------------------------------------------------------------------------------

/**
 * Lấy tất cả slug phim theo loại
 */
async function getAllMovieSlugs(loaiPhim, limit, apiBaseUrl, startPage = 1, endPage = Infinity) {
 // Bỏ qua phim-chieu-rap
 if (loaiPhim === "phim-chieu-rap") {
  return [];
 }

 const slugs = [];
 let currentPage = startPage;
 let totalPages = Infinity;

 while (currentPage <= totalPages && currentPage <= endPage) {
  const apiUrl = `${apiBaseUrl}/api/filter/?page=${currentPage}&limit=${limit}&loai_phim=${loaiPhim}&sort=ngay-tao`;
  
  try {
   const response = await axios.get(apiUrl);
   const data = response.data;

   if (currentPage === startPage) {
    totalPages = data.pagination.total_pages;
   }

   if (Array.isArray(data.data)) {
    data.data.forEach(movie => slugs.push(movie.slug));
   }

   currentPage++;
  } catch (error) {
   console.error(` ⚠️ Lỗi lấy slugs ${loaiPhim} (trang ${currentPage})`);
   break;
  }
 }
 
 return slugs;
}

// --------------------------------------------------------------------------------

/**
 * Tạo sitemap index chính
 */
async function generateMasterSitemapIndex() {
 const publicDir = path.join(__dirname, "public");
 const content = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapFiles.map(file => ` <sitemap>
  <loc>${domain}/${file}</loc>
 </sitemap>`).join("\n")}
</sitemapindex>`;

 const filePath = path.join(publicDir, "sitemap.xml");
 fs.writeFileSync(filePath, content);
 console.log(`\n✅ Đã tạo sitemap chính: public/sitemap.xml`);
}

// --------------------------------------------------------------------------------

/**
 * Tạo robots.txt
 */
async function generateRobotsTxt() {
 const publicDir = path.join(__dirname, "public");
 const content = `User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/
Allow: /

Sitemap: ${domain}/sitemap.xml`;

 const filePath = path.join(publicDir, "robots.txt");
 fs.writeFileSync(filePath, content);
 console.log(`✅ Đã tạo robots.txt: public/robots.txt`);
}

// --------------------------------------------------------------------------------

/**
 * Chạy tất cả tác vụ
 */
(async () => {
 try {
  console.log("\n🚀 BẮT ĐẦU TẠO SITEMAP & ROBOTS.TXT");
  console.log(`⚙️ Cấu hình: Trang ${START_PAGE} - ${END_PAGE}\n`);

  const dynamicTheLoaiList = await fetchTheLoaiList();
  
  const combinedStaticList = [
   ...dynamicTheLoaiList.map(item => ({ ...item, urlPrefix: "/the-loai/" })),
   ...staticLoaiPhimList.map(item => ({ ...item, urlPrefix: "/loai-phim/" })),
   ...staticLichChieu.map(item => ({ ...item, urlPrefix: "/" }))
  ];

  await generateSitemapForType("phim-le", "sitemap-movies", START_PAGE, END_PAGE);
  await generateSitemapForType("phim-bo", "sitemap-series", START_PAGE, END_PAGE);
  await generateSitemapForType("hoat-hinh", "sitemap-cartoons", START_PAGE, END_PAGE);

  await generateStaticSitemap(combinedStaticList, "sitemap-categories");
  await generateEpisodeSitemap(START_PAGE, END_PAGE);
  await generateMasterSitemapIndex();
  await generateRobotsTxt();

  console.log("\n🎉 HOÀN THÀNH TẤT CẢ TÁC VỤ!\n");
 } catch (error) {
  console.error("\n❌ LỖI NGHIÊM TRỌNG:", error.message);
  process.exit(1);
 }
})();
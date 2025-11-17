import { e as createComponent, f as createAstro, r as renderTemplate, u as unescapeHTML, h as addAttribute } from './astro/server_BuMcwEkM.mjs';
import 'kleur/colors';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$SeoLoaiPhim = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SeoLoaiPhim;
  const { slug, currentCategoryName } = Astro2.props;
  const capitalizeWords = (str) => str.toLowerCase().split(" ").filter((word) => word.trim() !== "").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const categoryCap = capitalizeWords(currentCategoryName);
  const siteName = "MePhimTV";
  const currentUrl = Astro2.url.href;
  const siteUrl = Astro2.url.origin;
  const titleTag = `${categoryCap} Mi\u1EC5n Ph\xED C\u1EADp Nh\u1EADt Nhanh Nh\u1EA5t M\u1EDBi Nh\u1EA5t Full HD T\u1EA1i ${siteName}`;
  const seoDescription = `Tuy\u1EC3n Ch\u1ECDn ${categoryCap} Vietsub, Thuy\u1EBFt Minh \u0110\u1EA7y \u0110\u1EE7, Xem Mi\u1EC5n Ph\xED Ch\u1EA5t L\u01B0\u1EE3ng HD Tr\xEAn ${siteName}.`;
  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${currentUrl}#webpage`,
        url: currentUrl,
        name: titleTag,
        isPartOf: { "@id": `${siteUrl}#website` },
        description: seoDescription,
        breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
        inLanguage: "vi"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${currentUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang Ch\u1EE7",
            item: siteUrl
          },
          {
            "@type": "ListItem",
            position: 2,
            name: currentCategoryName.charAt(0).toUpperCase() + currentCategoryName.slice(1),
            item: currentUrl
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: siteName,
        description: `Xem Phim Vietsub Thuy\u1EBFt Minh HD T\u1EA1i ${siteName}`,
        inLanguage: "vi-VN",
        publisher: { "@id": `${siteUrl}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/tim-kiem?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: siteName,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
          contentUrl: `${siteUrl}/logo.png`
        },
        image: { "@id": `${siteUrl}#organization` }
      }
    ]
  };
  return renderTemplate(_a || (_a = __template(["<title>", '</title><meta name="description"', '><meta name="robots" content="index, follow"><link rel="canonical"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name"', '><meta property="og:image"', '><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><link rel="icon" href="/favicon.ico" type="image/x-icon"><script type="application/ld+json">', "<\/script>"])), titleTag, addAttribute(seoDescription, "content"), addAttribute(currentUrl, "href"), addAttribute(titleTag, "content"), addAttribute(seoDescription, "content"), addAttribute(currentUrl, "content"), addAttribute(siteName, "content"), addAttribute(`${siteUrl}/thumb_web.png`, "content"), addAttribute(titleTag, "content"), addAttribute(seoDescription, "content"), addAttribute(`${siteUrl}/thumb_web.png`, "content"), unescapeHTML(JSON.stringify(fullSchema)));
}, "/home/vohaidang/Desktop/tramphim-v2/ui/src/seometas/SeoLoaiPhim.astro", void 0);

export { $$SeoLoaiPhim as $ };

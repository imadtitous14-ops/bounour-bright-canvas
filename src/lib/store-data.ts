export const STORE = {
  name: "BOUNOUR",
  tagline: "TECH",
  phone: "0559337429",
  address: "Ouled Yaich, Blida — en face le showroom FIAT (HCI)",
  email: "bounourtech@gmail.com",
  socials: {
    facebook: "https://www.facebook.com/Lexusdeco",
    instagram: "https://www.instagram.com/bounour.tech/",
    tiktok: "https://www.tiktok.com/@bounour.tech",
    youtube: "https://www.youtube.com/@BounourTech-x2s",
  },
};

export const CATEGORIES = [
  { id: "all", name: "Tout", nameAr: "الكل" },
  { id: "smartphones", name: "Smartphones", nameAr: "هواتف" },
  { id: "earpods", name: "Earpods", nameAr: "سماعات" },
  { id: "casque", name: "Casques", nameAr: "سماعات رأس" },
  { id: "tablette", name: "Tablettes", nameAr: "أجهزة لوحية" },
  { id: "smartwatch", name: "Montres", nameAr: "ساعات" },
  { id: "accessoires", name: "Accessoires", nameAr: "إكسسوارات" },
  { id: "chargeurs", name: "Chargeurs", nameAr: "شواحن" },
  { id: "cables", name: "Câbles", nameAr: "كوابل" },
  { id: "powerbank", name: "Power Bank", nameAr: "بطاريات" },
  { id: "digital", name: "Digital", nameAr: "رقمي" },
  { id: "services", name: "Services", nameAr: "خدمات" },
];

export const WILAYAS = ["01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi","05 - Batna","06 - Béjaïa","07 - Biskra","08 - Béchar","09 - Blida","10 - Bouira","11 - Tamanrasset","12 - Tébessa","13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou","16 - Alger","17 - Djelfa","18 - Jijel","19 - Sétif","20 - Saïda","21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma","25 - Constantine","26 - Médéa","27 - Mostaganem","28 - M'Sila","29 - Mascara","30 - Ouargla","31 - Oran","32 - El Bayadh","33 - Illizi","34 - Bordj Bou Arréridj","35 - Boumerdès","36 - El Tarf","37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela","41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla","45 - Naâma","46 - Aïn Témouchent","47 - Ghardaïa","48 - Relizane","49 - El M'Ghair","50 - El Meniaa","51 - Ouled Djellal","52 - Bordj Badji Mokhtar","53 - Béni Abbès","54 - Timimoun","55 - Touggourt","56 - Djanet","57 - In Salah","58 - In Guezzam"];

export const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  cat: string;
  badge: string | null;
  img: string;
  specs: string;
}

import productsJson from "./products-data.json";

export function getProducts(): Product[] {
  return productsJson as Product[];
}

export function getBadgeVariant(badge: string | null): "promo" | "new" | "default" {
  if (badge === "Promo") return "promo";
  if (badge === "Nouveau") return "new";
  return "default";
}
